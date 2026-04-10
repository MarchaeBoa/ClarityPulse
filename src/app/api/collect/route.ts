// ============================================================
// ClarityPulse — Event Collection Endpoint
// POST /api/collect
//
// Receives events from the browser tracking script (cp.js)
// and persists them to the database.
//
// Privacy-first: no cookies, IP truncated, no personal data stored.
//
// MVP: Direct INSERT to PostgreSQL (Supabase)
// Future: Publish to Kafka → Worker batch COPY
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import type {
  PageviewPayload,
  CustomEventPayload,
  EventPayload,
  TokenCacheEntry,
} from '@/lib/tracking/types';
import {
  shouldBlockRequest,
  isBlockedIP,
  parseUserAgent,
  truncateIP,
  fnv1a,
} from '@/lib/tracking/filters';

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
// In production, this would be backed by Redis
const tokenCache = new Map<string, TokenCacheEntry>();
const TOKEN_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// --- Dedup window (in-memory for MVP) ---
const dedupMap = new Map<string, number>();
const DEDUP_WINDOW = 5_000; // 5 seconds
const DEDUP_CLEANUP_INTERVAL = 30_000; // cleanup every 30s

// Periodic dedup cleanup
let lastDedupCleanup = Date.now();

function cleanupDedup() {
  const now = Date.now();
  if (now - lastDedupCleanup < DEDUP_CLEANUP_INTERVAL) return;
  lastDedupCleanup = now;

  const cutoff = now - DEDUP_WINDOW;
  for (const [key, ts] of dedupMap) {
    if (ts < cutoff) dedupMap.delete(key);
  }
}

// --- Rate limiter ---

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

// --- Token validation ---
// MVP: Stub that accepts known test tokens
// Production: Query sites table with cache

async function validateToken(
  token: string
): Promise<TokenCacheEntry | null> {
  // Check cache first
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

// --- Payload validation ---

function isValidPayload(body: unknown): body is EventPayload {
  if (!body || typeof body !== 'object') return false;
  const p = body as Record<string, unknown>;

  // Required fields for all events
  if (typeof p.t !== 'string' || !['pv', 'ev'].includes(p.t)) return false;
  if (typeof p.tk !== 'string' || p.tk.length < 8 || p.tk.length > 64) return false;
  if (typeof p.u !== 'string' || p.u.length > 2048) return false;
  if (typeof p.p !== 'string' || p.p.length > 1024) return false;
  if (typeof p.ts !== 'number') return false;
  if (typeof p.sid !== 'string' || p.sid.length > 32) return false;

  // Timestamp validation: must be within ±5 minutes of server time
  const serverNow = Date.now();
  const drift = Math.abs(serverNow - p.ts);
  if (drift > 5 * 60 * 1000) return false;

  // Pageview-specific validation
  if (p.t === 'pv') {
    if (typeof p.vw !== 'number' || typeof p.vh !== 'number') return false;
    if (p.uniq !== 0 && p.uniq !== 1) return false;
  }

  // Custom event-specific validation
  if (p.t === 'ev') {
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

  return true;
}

// --- Dedup check ---

function isDuplicate(payload: EventPayload): boolean {
  const key =
    payload.t === 'pv'
      ? `${payload.sid}:${payload.p}:pv`
      : `${payload.sid}:${(payload as CustomEventPayload).n}:ev`;

  const now = Date.now();
  const lastSeen = dedupMap.get(key);
  if (lastSeen && now - lastSeen < DEDUP_WINDOW) {
    return true;
  }
  dedupMap.set(key, now);
  return false;
}

// --- Extract client IP from request ---

function getClientIP(request: NextRequest): string {
  // Standard proxy headers
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return '0.0.0.0';
}

// --- Extract hostname from Origin or Referer ---

function getRequestHostname(request: NextRequest): string {
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      return new URL(origin).hostname;
    } catch {
      return '';
    }
  }
  const referer = request.headers.get('referer');
  if (referer) {
    try {
      return new URL(referer).hostname;
    } catch {
      return '';
    }
  }
  return '';
}

// --- Persist event ---
// MVP: Logs to console (replace with Supabase INSERT)

async function persistPageview(
  payload: PageviewPayload,
  siteId: string,
  sessionHash: number,
  device: ReturnType<typeof parseUserAgent>,
  countryCode: string | null
): Promise<void> {
  // TODO: Replace with Supabase INSERT
  // const { error } = await supabase.from('pageviews').insert({
  //   site_id: siteId,
  //   session_hash: sessionHash,
  //   page_url: payload.u,
  //   page_path: payload.p,
  //   page_query: payload.q || null,
  //   referrer: payload.r || null,
  //   referrer_domain: payload.rd || null,
  //   utm_source: payload.us || null,
  //   utm_medium: payload.um || null,
  //   utm_campaign: payload.uc || null,
  //   utm_content: payload.un || null,
  //   utm_term: payload.ut || null,
  //   country_code: countryCode,
  //   device_type: device.device_type,
  //   os: device.os,
  //   os_version: device.os_version,
  //   browser: device.browser,
  //   browser_version: device.browser_version,
  //   viewport_width: payload.vw,
  //   viewport_height: payload.vh,
  //   is_entry: payload.uniq === 1,
  //   occurred_at: new Date(payload.ts).toISOString(),
  // });

  if (process.env.NODE_ENV === 'development') {
    console.log('[ClarityPulse] Pageview:', {
      site_id: siteId,
      session_hash: sessionHash,
      path: payload.p,
      referrer: payload.rd || 'direct',
      device: device.device_type,
      browser: device.browser,
      country: countryCode || 'unknown',
      utm_source: payload.us || null,
    });
  }
}

async function persistCustomEvent(
  payload: CustomEventPayload,
  siteId: string,
  sessionHash: number,
  device: ReturnType<typeof parseUserAgent>,
  countryCode: string | null
): Promise<void> {
  // TODO: Replace with Supabase INSERT
  // const { error } = await supabase.from('custom_events').insert({
  //   site_id: siteId,
  //   session_hash: sessionHash,
  //   event_name: payload.n,
  //   page_url: payload.u,
  //   page_path: payload.p,
  //   properties: payload.pr || null,
  //   country_code: countryCode,
  //   device_type: device.device_type,
  //   occurred_at: new Date(payload.ts).toISOString(),
  // });

  if (process.env.NODE_ENV === 'development') {
    console.log('[ClarityPulse] Event:', {
      site_id: siteId,
      session_hash: sessionHash,
      name: payload.n,
      properties: payload.pr,
      path: payload.p,
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
  // Always return 202 with CORS headers (even on error)
  // This prevents leaking information about validation failures
  const accepted = () =>
    NextResponse.json(null, { status: 202, headers: CORS_HEADERS });

  const rateLimited = () =>
    NextResponse.json(null, {
      status: 429,
      headers: {
        ...CORS_HEADERS,
        'Retry-After': '60',
      },
    });

  try {
    // 1. Get client IP
    const clientIP = getClientIP(request);
    const truncatedIP = truncateIP(clientIP);

    // 2. Rate limit check
    if (!checkRateLimit(truncatedIP)) {
      return rateLimited();
    }

    // 3. Parse body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return accepted(); // Silently reject malformed JSON
    }

    // 4. Validate payload structure
    if (!isValidPayload(body)) {
      return accepted(); // Silently reject invalid payloads
    }

    // 5. Validate site token
    const site = await validateToken(body.tk);
    if (!site) {
      return accepted(); // Don't reveal if token exists
    }

    // 6. Check Origin against allowed domains
    const requestHostname = getRequestHostname(request);
    if (
      site.allowedDomains.length > 0 &&
      !site.allowedDomains.includes(requestHostname)
    ) {
      return accepted(); // Don't reveal allowed domains
    }

    // 7. Run traffic filters
    const userAgent = request.headers.get('user-agent') || '';
    const filterResult = shouldBlockRequest({
      ip: clientIP,
      hostname: requestHostname,
      userAgent,
      url: body.u,
      viewportWidth: body.t === 'pv' ? body.vw : undefined,
      viewportHeight: body.t === 'pv' ? body.vh : undefined,
    });

    if (filterResult.blocked) {
      return accepted(); // Silently drop filtered traffic
    }

    // 8. Check blocked IPs
    // TODO: Fetch blocked IPs from DB (cached)
    // const blockedIPs = await getBlockedIPs(site.siteId);
    // if (isBlockedIP(clientIP, blockedIPs)) return accepted();

    // 9. Dedup check
    if (isDuplicate(body)) {
      return accepted(); // Silently drop duplicates
    }

    // 10. Enrich event
    const device = parseUserAgent(userAgent);
    const sessionHash = fnv1a(
      `${truncatedIP}|${userAgent}|${new Date().toISOString().substring(0, 10)}`
    );

    // TODO: GeoIP lookup from truncated IP
    const countryCode: string | null = null;

    // 11. Persist
    if (body.t === 'pv') {
      await persistPageview(body, site.siteId, sessionHash, device, countryCode);
    } else if (body.t === 'ev') {
      await persistCustomEvent(
        body as CustomEventPayload,
        site.siteId,
        sessionHash,
        device,
        countryCode
      );
    }

    // 12. Periodic cleanup
    cleanupDedup();

    return accepted();
  } catch (error) {
    // Never crash — analytics should be invisible
    if (process.env.NODE_ENV === 'development') {
      console.error('[ClarityPulse] Collection error:', error);
    }
    return accepted();
  }
}
