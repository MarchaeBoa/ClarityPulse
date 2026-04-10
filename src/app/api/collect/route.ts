// ============================================================
// ClarityPulse — Event Collection Endpoint
// POST /api/collect
//
// Receives events from the browser tracking script (cp.js)
// and persists them to the database.
//
// Supports two payload formats:
//   1. Batch (v2): { e: [...events], tk: "site_token" }
//   2. Single (legacy): { t: "pv", tk: "token", ... }
//
// Privacy-first: no cookies, IP truncated, no personal data stored.
//
// MVP: In-memory queue → console log
// Production: Queue → Kafka → Workers → ClickHouse
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import type {
  PageviewPayload,
  CustomEventPayload,
  PageLeavePayload,
  EventPayload,
  BatchPayload,
  TokenCacheEntry,
  InternalTrafficConfig,
} from '@/lib/tracking/types';
import {
  shouldBlockRequest,
  isInternalTraffic,
  parseUserAgent,
  truncateIP,
  fnv1a,
} from '@/lib/tracking/filters';
import { pushEvent } from '@/lib/tracking/queue';

// --- CORS headers ---
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '3600',
  'Cache-Control': 'no-store',
};

// --- Rate limiting (in-memory for MVP) ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 60; // max events per window per IP

// --- Token cache (in-memory for MVP) ---
const tokenCache = new Map<string, TokenCacheEntry>();
const TOKEN_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// --- Dedup window (in-memory for MVP) ---
const dedupMap = new Map<string, number>();
const DEDUP_WINDOW = 5_000; // 5 seconds
const DEDUP_CLEANUP_INTERVAL = 30_000;
let lastDedupCleanup = Date.now();

// --- Internal traffic config (per-site in production, global for MVP) ---
const internalTrafficConfig: InternalTrafficConfig = {
  blockedCIDRs: [
    // Common private ranges — customize per deployment
    // '10.0.0.0/8',
    // '172.16.0.0/12',
    // '192.168.0.0/16',
  ],
  internalHeader: 'X-CP-Internal',
  internalHeaderValue: 'true',
};

// --- Max events per batch ---
const MAX_BATCH_SIZE = 20;

// --- Helpers ---

function cleanupDedup() {
  const now = Date.now();
  if (now - lastDedupCleanup < DEDUP_CLEANUP_INTERVAL) return;
  lastDedupCleanup = now;

  const cutoff = now - DEDUP_WINDOW;
  dedupMap.forEach((ts, key) => {
    if (ts < cutoff) dedupMap.delete(key);
  });
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

async function validateToken(
  token: string
): Promise<TokenCacheEntry | null> {
  const cached = tokenCache.get(token);
  if (cached && Date.now() - cached.cachedAt < TOKEN_CACHE_TTL) {
    return cached.isActive ? cached : null;
  }

  // TODO: Query Supabase for the site with this public_token
  // const { data: site } = await supabase
  //   .from('sites')
  //   .select('id, allowed_domains, is_active')
  //   .eq('public_token', token)
  //   .eq('is_active', true)
  //   .single();

  // MVP: Accept any well-formed token (32-char hex)
  if (/^[a-f0-9]{32}$/.test(token)) {
    const entry: TokenCacheEntry = {
      siteId: `site_${token.substring(0, 8)}`,
      allowedDomains: [],
      isActive: true,
      cachedAt: Date.now(),
    };
    tokenCache.set(token, entry);
    return entry;
  }

  return null;
}

function isValidEvent(body: unknown): body is EventPayload {
  if (!body || typeof body !== 'object') return false;
  const p = body as Record<string, unknown>;

  if (typeof p.t !== 'string' || !['pv', 'ev', 'pl'].includes(p.t)) return false;
  if (typeof p.ts !== 'number') return false;
  if (typeof p.sid !== 'string' || p.sid.length > 32) return false;

  // Timestamp validation: must be within ±5 minutes of server time
  const drift = Math.abs(Date.now() - p.ts);
  if (drift > 5 * 60 * 1000) return false;

  // Pageview-specific validation
  if (p.t === 'pv') {
    if (typeof p.u !== 'string' || p.u.length > 2048) return false;
    if (typeof p.p !== 'string' || p.p.length > 1024) return false;
    if (typeof p.vw !== 'number' || typeof p.vh !== 'number') return false;
    if (p.uniq !== 0 && p.uniq !== 1) return false;
  }

  // Custom event-specific validation
  if (p.t === 'ev') {
    if (typeof p.u !== 'string' || p.u.length > 2048) return false;
    if (typeof p.p !== 'string' || p.p.length > 1024) return false;
    if (typeof p.n !== 'string' || p.n.length > 128) return false;
    if (p.pr !== undefined && p.pr !== null) {
      if (typeof p.pr !== 'object' || Array.isArray(p.pr)) return false;
      const keys = Object.keys(p.pr as object);
      if (keys.length > 10) return false;
      for (const key of keys) {
        if (key.length > 64) return false;
        const val = (p.pr as Record<string, unknown>)[key];
        if (typeof val === 'string' && val.length > 256) return false;
        if (!['string', 'number', 'boolean'].includes(typeof val)) return false;
      }
    }
  }

  // Page leave-specific validation
  if (p.t === 'pl') {
    if (typeof p.p !== 'string' || p.p.length > 1024) return false;
    if (typeof p.et !== 'number' || p.et < 0 || p.et > 86400) return false;
    if (typeof p.sd !== 'number' || p.sd < 0 || p.sd > 100) return false;
  }

  return true;
}

function isDuplicate(event: EventPayload): boolean {
  let key: string;

  switch (event.t) {
    case 'pv':
      key = `${event.sid}:${event.p}:pv`;
      break;
    case 'ev':
      key = `${event.sid}:${(event as CustomEventPayload).n}:ev`;
      break;
    case 'pl':
      key = `${event.sid}:${event.p}:pl`;
      break;
    default:
      return false;
  }

  const now = Date.now();
  const lastSeen = dedupMap.get(key);
  if (lastSeen && now - lastSeen < DEDUP_WINDOW) {
    return true;
  }
  dedupMap.set(key, now);
  return false;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '0.0.0.0';
}

function getRequestHostname(request: NextRequest): string {
  const origin = request.headers.get('origin');
  if (origin) {
    try { return new URL(origin).hostname; } catch { /* skip */ }
  }
  const referer = request.headers.get('referer');
  if (referer) {
    try { return new URL(referer).hostname; } catch { /* skip */ }
  }
  return '';
}

/**
 * Parse request body into events array + site token.
 * Handles both batch (v2) and single (legacy) formats.
 */
function parsePayload(body: unknown): { events: unknown[]; token: string } | null {
  if (!body || typeof body !== 'object') return null;

  const b = body as Record<string, unknown>;

  // Batch format: { e: [...], tk: "token" }
  if (Array.isArray(b.e) && typeof b.tk === 'string') {
    if (b.e.length === 0 || b.e.length > MAX_BATCH_SIZE) return null;
    return { events: b.e, token: b.tk };
  }

  // Legacy single event format: { t: "pv", tk: "token", ... }
  if (typeof b.t === 'string' && typeof b.tk === 'string') {
    return { events: [b], token: b.tk };
  }

  return null;
}

// --- Process a single event ---

function processEvent(
  event: EventPayload,
  siteId: string,
  sessionHash: number,
  device: ReturnType<typeof parseUserAgent>,
  countryCode: string | null
): void {
  if (event.t === 'pv') {
    const pv = event as PageviewPayload;
    pushEvent(siteId, {
      site_id: siteId,
      session_hash: sessionHash,
      event_type: 'pageview',
      page_url: pv.u,
      page_path: pv.p,
      page_query: pv.q || undefined,
      referrer: pv.r || undefined,
      referrer_domain: pv.rd || undefined,
      utm_source: pv.us || undefined,
      utm_medium: pv.um || undefined,
      utm_campaign: pv.uc || undefined,
      utm_content: pv.un || undefined,
      utm_term: pv.ut || undefined,
      country_code: countryCode || undefined,
      device_type: device.device_type,
      os: device.os,
      os_version: device.os_version,
      browser: device.browser,
      browser_version: device.browser_version,
      viewport_width: pv.vw,
      viewport_height: pv.vh,
      is_entry: pv.uniq === 1,
      is_unique: pv.uniq === 1,
      occurred_at: new Date(pv.ts).toISOString(),
    });
  } else if (event.t === 'ev') {
    const ev = event as CustomEventPayload;
    pushEvent(siteId, {
      site_id: siteId,
      session_hash: sessionHash,
      event_type: 'custom_event',
      page_url: ev.u,
      page_path: ev.p,
      event_name: ev.n,
      properties: ev.pr || undefined,
      country_code: countryCode || undefined,
      device_type: device.device_type,
      os: device.os,
      os_version: device.os_version,
      browser: device.browser,
      browser_version: device.browser_version,
      is_entry: false,
      is_unique: false,
      occurred_at: new Date(ev.ts).toISOString(),
    });
  } else if (event.t === 'pl') {
    const pl = event as PageLeavePayload;
    pushEvent(siteId, {
      site_id: siteId,
      session_hash: sessionHash,
      event_type: 'page_leave',
      page_url: '',
      page_path: pl.p,
      engagement_time: pl.et,
      scroll_depth: pl.sd,
      country_code: countryCode || undefined,
      device_type: device.device_type,
      os: device.os,
      os_version: device.os_version,
      browser: device.browser,
      browser_version: device.browser_version,
      is_entry: false,
      is_unique: false,
      occurred_at: new Date(pl.ts).toISOString(),
    });
  }
}

// ============================================================
// CORS preflight handler
// ============================================================

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

// ============================================================
// Main event collection handler
// ============================================================

export async function POST(request: NextRequest) {
  const accepted = () =>
    NextResponse.json(null, { status: 202, headers: CORS_HEADERS });

  const rateLimited = () =>
    NextResponse.json(null, {
      status: 429,
      headers: { ...CORS_HEADERS, 'Retry-After': '60' },
    });

  try {
    // 1. Get client IP
    const clientIP = getClientIP(request);
    const truncatedIP = truncateIP(clientIP);

    // 2. Rate limit check
    if (!checkRateLimit(truncatedIP)) {
      return rateLimited();
    }

    // 3. Check internal traffic
    if (isInternalTraffic(clientIP, request.headers, internalTrafficConfig)) {
      return accepted();
    }

    // 4. Parse body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return accepted();
    }

    // 5. Parse payload (batch or single)
    const parsed = parsePayload(body);
    if (!parsed) return accepted();

    // 6. Validate site token
    const site = await validateToken(parsed.token);
    if (!site) return accepted();

    // 7. Check Origin against allowed domains
    const requestHostname = getRequestHostname(request);
    if (
      site.allowedDomains.length > 0 &&
      !site.allowedDomains.includes(requestHostname)
    ) {
      return accepted();
    }

    // 8. Parse User-Agent and compute session hash (once per request)
    const userAgent = request.headers.get('user-agent') || '';
    const device = parseUserAgent(userAgent);
    const sessionHash = fnv1a(
      `${truncatedIP}|${userAgent}|${new Date().toISOString().substring(0, 10)}`
    );

    // TODO: GeoIP lookup from truncated IP
    const countryCode: string | null = null;

    // 9. Process each event in the batch
    let processed = 0;
    for (const rawEvent of parsed.events) {
      // Validate event structure
      if (!isValidEvent(rawEvent)) continue;

      const event = rawEvent as EventPayload;

      // Run traffic filters (for pageview events with viewport data)
      if (event.t === 'pv') {
        const pv = event as PageviewPayload;
        const filterResult = shouldBlockRequest({
          ip: clientIP,
          hostname: requestHostname,
          userAgent,
          url: pv.u,
          viewportWidth: pv.vw,
          viewportHeight: pv.vh,
        });
        if (filterResult.blocked) continue;
      }

      // Dedup check
      if (isDuplicate(event)) continue;

      // Enrich and queue
      processEvent(event, site.siteId, sessionHash, device, countryCode);
      processed++;
    }

    // 10. Periodic dedup cleanup
    cleanupDedup();

    if (process.env.NODE_ENV === 'development' && processed > 0) {
      console.log(`[ClarityPulse] Processed ${processed}/${parsed.events.length} events`);
    }

    return accepted();
  } catch (error) {
    // Never crash — analytics should be invisible
    if (process.env.NODE_ENV === 'development') {
      console.error('[ClarityPulse] Collection error:', error);
    }
    return accepted();
  }
}
