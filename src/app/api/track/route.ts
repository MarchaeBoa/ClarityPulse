// ============================================================
// ClarityPulse — Tracking API Endpoint
// POST /api/track
//
// Production-ready event collection endpoint that:
//   1. Receives events from the tracking script (cp.js) or SDK
//   2. Validates the project token against the database
//   3. Filters bots, spam, and invalid traffic
//   4. Persists pageviews and custom events to PostgreSQL
//
// Payload formats:
//   Batch (v2): { e: [...events], tk: "site_public_token" }
//   Single:     { t: "pv", tk: "token", ... }
//
// Privacy: no cookies, IPs truncated, no personal data stored.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import type {
  PageviewPayload,
  CustomEventPayload,
  PageLeavePayload,
  EventPayload,
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
import { initTrackingDB } from '@/lib/tracking/db';

// --- Initialize DB persistence on first import ---
initTrackingDB();

// ============================================================
// CORS
// ============================================================

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '3600',
  'Cache-Control': 'no-store',
};

// ============================================================
// Rate Limiting (in-memory, per-IP)
// ============================================================

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 60; // max events per window per IP

// Periodic cleanup to prevent memory leaks
const RATE_LIMIT_CLEANUP_INTERVAL = 5 * 60_000; // 5 minutes
let lastRateLimitCleanup = Date.now();

function cleanupRateLimit(): void {
  const now = Date.now();
  if (now - lastRateLimitCleanup < RATE_LIMIT_CLEANUP_INTERVAL) return;
  lastRateLimitCleanup = now;
  rateLimitMap.forEach((entry, key) => {
    if (now > entry.resetAt) rateLimitMap.delete(key);
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

// ============================================================
// Token Cache (in-memory with TTL)
// ============================================================

const tokenCache = new Map<string, TokenCacheEntry>();
const TOKEN_CACHE_TTL = 5 * 60_000; // 5 minutes
const TOKEN_CACHE_NEGATIVE_TTL = 60_000; // 1 minute for invalid tokens

// Negative cache to avoid repeated DB lookups for invalid tokens
const negativeTokenCache = new Map<string, number>();

async function validateToken(token: string): Promise<TokenCacheEntry | null> {
  // Quick format check — public_token is a 32-char hex string
  if (!/^[a-f0-9]{32}$/.test(token)) {
    return null;
  }

  // Check positive cache
  const cached = tokenCache.get(token);
  if (cached && Date.now() - cached.cachedAt < TOKEN_CACHE_TTL) {
    return cached.isActive ? cached : null;
  }

  // Check negative cache (prevents spam of invalid tokens hitting DB)
  const negCached = negativeTokenCache.get(token);
  if (negCached && Date.now() - negCached < TOKEN_CACHE_NEGATIVE_TTL) {
    return null;
  }

  // Query database for the site with this public_token
  try {
    const supabase = getAdminClient();
    const { data: site, error } = await supabase
      .from('sites')
      .select('id, domain, allowed_domains, is_active, workspace_id')
      .eq('public_token', token)
      .eq('is_active', true)
      .single();

    if (error || !site) {
      negativeTokenCache.set(token, Date.now());
      return null;
    }

    const entry: TokenCacheEntry = {
      siteId: site.id,
      allowedDomains: site.allowed_domains ?? [],
      isActive: site.is_active,
      cachedAt: Date.now(),
    };

    tokenCache.set(token, entry);
    return entry;
  } catch {
    // On DB error, don't cache — allow retry on next request
    return null;
  }
}

// ============================================================
// Deduplication (in-memory, short window)
// ============================================================

const dedupMap = new Map<string, number>();
const DEDUP_WINDOW = 5_000; // 5 seconds
const DEDUP_CLEANUP_INTERVAL = 30_000;
let lastDedupCleanup = Date.now();

function cleanupDedup(): void {
  const now = Date.now();
  if (now - lastDedupCleanup < DEDUP_CLEANUP_INTERVAL) return;
  lastDedupCleanup = now;
  const cutoff = now - DEDUP_WINDOW;
  dedupMap.forEach((ts, key) => {
    if (ts < cutoff) dedupMap.delete(key);
  });
}

function isDuplicate(event: EventPayload, siteId: string): boolean {
  let key: string;
  switch (event.t) {
    case 'pv':
      key = `${siteId}:${event.sid}:${event.p}:pv`;
      break;
    case 'ev':
      key = `${siteId}:${event.sid}:${(event as CustomEventPayload).n}:ev`;
      break;
    case 'pl':
      key = `${siteId}:${event.sid}:${event.p}:pl`;
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

// ============================================================
// Spam Protection: payload size + honeypot field
// ============================================================

const MAX_BODY_SIZE = 64 * 1024; // 64 KB max body
const MAX_BATCH_SIZE = 20;

// ============================================================
// Internal Traffic Configuration
// ============================================================

const internalTrafficConfig: InternalTrafficConfig = {
  blockedCIDRs: [],
  internalHeader: 'X-CP-Internal',
  internalHeaderValue: 'true',
};

// ============================================================
// Validation
// ============================================================

function isValidEvent(body: unknown): body is EventPayload {
  if (!body || typeof body !== 'object') return false;
  const p = body as Record<string, unknown>;

  if (typeof p.t !== 'string' || !['pv', 'ev', 'pl'].includes(p.t)) return false;
  if (typeof p.ts !== 'number') return false;
  if (typeof p.sid !== 'string' || p.sid.length === 0 || p.sid.length > 32) return false;

  // Timestamp drift: must be within +/- 5 minutes
  const drift = Math.abs(Date.now() - p.ts);
  if (drift > 5 * 60_000) return false;

  // Pageview validation
  if (p.t === 'pv') {
    if (typeof p.u !== 'string' || p.u.length === 0 || p.u.length > 2048) return false;
    if (typeof p.p !== 'string' || p.p.length === 0 || p.p.length > 1024) return false;
    if (typeof p.vw !== 'number' || typeof p.vh !== 'number') return false;
    if (p.vw < 0 || p.vh < 0 || p.vw > 10000 || p.vh > 10000) return false;
    if (p.uniq !== 0 && p.uniq !== 1) return false;
    // Optional string fields
    if (p.r !== undefined && typeof p.r !== 'string') return false;
    if (p.rd !== undefined && typeof p.rd !== 'string') return false;
    if (p.q !== undefined && typeof p.q !== 'string') return false;
    if (p.us !== undefined && (typeof p.us !== 'string' || p.us.length > 256)) return false;
    if (p.um !== undefined && (typeof p.um !== 'string' || p.um.length > 256)) return false;
    if (p.uc !== undefined && (typeof p.uc !== 'string' || p.uc.length > 256)) return false;
    if (p.un !== undefined && (typeof p.un !== 'string' || p.un.length > 256)) return false;
    if (p.ut !== undefined && (typeof p.ut !== 'string' || p.ut.length > 256)) return false;
  }

  // Custom event validation
  if (p.t === 'ev') {
    if (typeof p.u !== 'string' || p.u.length === 0 || p.u.length > 2048) return false;
    if (typeof p.p !== 'string' || p.p.length === 0 || p.p.length > 1024) return false;
    if (typeof p.n !== 'string' || p.n.length === 0 || p.n.length > 128) return false;
    // Validate properties
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

  // Page leave validation
  if (p.t === 'pl') {
    if (typeof p.p !== 'string' || p.p.length === 0 || p.p.length > 1024) return false;
    if (typeof p.et !== 'number' || p.et < 0 || p.et > 86400) return false;
    if (typeof p.sd !== 'number' || p.sd < 0 || p.sd > 100) return false;
  }

  return true;
}

// ============================================================
// Payload Parsing
// ============================================================

function parsePayload(body: unknown): { events: unknown[]; token: string } | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;

  // Spam protection: reject if honeypot field is present
  if (b.hp !== undefined && b.hp !== '') return null;

  // Batch format: { e: [...], tk: "token" }
  if (Array.isArray(b.e) && typeof b.tk === 'string') {
    if (b.e.length === 0 || b.e.length > MAX_BATCH_SIZE) return null;
    return { events: b.e, token: b.tk };
  }

  // Legacy single event: { t: "pv", tk: "token", ... }
  if (typeof b.t === 'string' && typeof b.tk === 'string') {
    return { events: [b], token: b.tk };
  }

  return null;
}

// ============================================================
// Helpers
// ============================================================

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

// ============================================================
// Event Processing — enrich and queue for DB persistence
// ============================================================

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
// CORS Preflight
// ============================================================

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

// ============================================================
// POST /api/track — Main Handler
// ============================================================

export async function POST(request: NextRequest) {
  // Always return 202 for valid requests (analytics should be invisible)
  const accepted = () =>
    NextResponse.json({ status: 'accepted' }, { status: 202, headers: CORS_HEADERS });

  const rateLimited = () =>
    NextResponse.json(
      { status: 'rate_limited' },
      { status: 429, headers: { ...CORS_HEADERS, 'Retry-After': '60' } }
    );

  const badRequest = (reason: string) =>
    NextResponse.json(
      { status: 'error', reason },
      { status: 400, headers: CORS_HEADERS }
    );

  try {
    // --- 1. Extract client IP ---
    const clientIP = getClientIP(request);
    const truncatedIP = truncateIP(clientIP);

    // --- 2. Rate limit check ---
    if (!checkRateLimit(truncatedIP)) {
      return rateLimited();
    }

    // --- 3. Spam: check Content-Length ---
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return badRequest('payload_too_large');
    }

    // --- 4. Skip internal traffic ---
    if (isInternalTraffic(clientIP, request.headers, internalTrafficConfig)) {
      return accepted();
    }

    // --- 5. Parse body ---
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return badRequest('invalid_json');
    }

    // --- 6. Parse payload envelope ---
    const parsed = parsePayload(body);
    if (!parsed) {
      return badRequest('invalid_payload');
    }

    // --- 7. Validate project token (project_id) against database ---
    const site = await validateToken(parsed.token);
    if (!site) {
      return badRequest('invalid_project_id');
    }

    // --- 8. Check Origin against allowed domains ---
    const requestHostname = getRequestHostname(request);
    if (
      site.allowedDomains.length > 0 &&
      requestHostname &&
      !site.allowedDomains.includes(requestHostname)
    ) {
      // Silently accept but don't process (domain mismatch)
      return accepted();
    }

    // --- 9. Parse User-Agent + compute session hash ---
    const userAgent = request.headers.get('user-agent') || '';
    const device = parseUserAgent(userAgent);

    // Don't process bot traffic
    if (device.device_type === 'bot') {
      return accepted();
    }

    const sessionHash = fnv1a(
      `${truncatedIP}|${userAgent}|${new Date().toISOString().substring(0, 10)}`
    );

    // TODO: GeoIP lookup from truncated IP
    const countryCode: string | null = null;

    // --- 10. Process each event ---
    let processed = 0;
    let skipped = 0;

    for (const rawEvent of parsed.events) {
      // Validate event structure
      if (!isValidEvent(rawEvent)) {
        skipped++;
        continue;
      }

      const event = rawEvent as EventPayload;

      // Bot/spam filter for pageview events
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
        if (filterResult.blocked) {
          skipped++;
          continue;
        }
      }

      // Dedup check (includes siteId for isolation)
      if (isDuplicate(event, site.siteId)) {
        skipped++;
        continue;
      }

      // Enrich and queue for DB persistence
      processEvent(event, site.siteId, sessionHash, device, countryCode);
      processed++;
    }

    // --- 11. Periodic cleanups ---
    cleanupDedup();
    cleanupRateLimit();

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[ClarityPulse /track] site=${site.siteId.substring(0, 8)}… ` +
        `processed=${processed} skipped=${skipped}`
      );
    }

    return accepted();
  } catch (error) {
    // Never crash — analytics endpoints must be invisible
    if (process.env.NODE_ENV === 'development') {
      console.error('[ClarityPulse /track] Unhandled error:', error);
    }
    return accepted();
  }
}
