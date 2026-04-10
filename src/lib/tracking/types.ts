// ============================================================
// ClarityPulse — Tracking System Types
// Shared between browser SDK and API ingest endpoint
// ============================================================

// --- Payload types (sent from browser to server) ---

/** Pageview event payload — sent automatically on navigation */
export interface PageviewPayload {
  /** Event type: "pv" = pageview */
  t: 'pv';
  /** Site public token */
  tk: string;
  /** Full URL */
  u: string;
  /** URL path only */
  p: string;
  /** Query string (sanitized) */
  q?: string;
  /** Full referrer URL */
  r?: string;
  /** Referrer domain */
  rd?: string;
  /** utm_source */
  us?: string;
  /** utm_medium */
  um?: string;
  /** utm_campaign */
  uc?: string;
  /** utm_content */
  un?: string;
  /** utm_term */
  ut?: string;
  /** Viewport width */
  vw: number;
  /** Viewport height */
  vh: number;
  /** Client timestamp (ms) */
  ts: number;
  /** Session ID (ephemeral hash, not a cookie) */
  sid: string;
  /** 1 = first visit in session (unique visitor), 0 = returning */
  uniq: 0 | 1;
}

/** Custom event payload — sent via claritypulse('event', name, props) */
export interface CustomEventPayload {
  /** Event type: "ev" = custom event */
  t: 'ev';
  /** Site public token */
  tk: string;
  /** Event name */
  n: string;
  /** Event properties (max 10 keys, 256 chars per value) */
  pr?: Record<string, string | number | boolean>;
  /** Full URL where event fired */
  u: string;
  /** URL path */
  p: string;
  /** Client timestamp (ms) */
  ts: number;
  /** Session ID */
  sid: string;
}

/** Union of all event payloads */
export type EventPayload = PageviewPayload | CustomEventPayload;

// --- Server-side enriched event ---

/** Enriched event after server-side processing */
export interface EnrichedEvent {
  site_id: string;
  session_hash: number;
  event_type: 'pageview' | 'custom_event';

  // Page
  page_url: string;
  page_path: string;
  page_query?: string;

  // Referrer
  referrer?: string;
  referrer_domain?: string;

  // UTM
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;

  // Geo (derived from truncated IP)
  country_code?: string;
  region?: string;
  city?: string;

  // Device (derived from User-Agent)
  device_type?: 'mobile' | 'desktop' | 'tablet' | 'bot';
  os?: string;
  os_version?: string;
  browser?: string;
  browser_version?: string;

  // Viewport
  viewport_width?: number;
  viewport_height?: number;

  // Session
  is_entry: boolean;
  is_unique: boolean;

  // Custom event fields
  event_name?: string;
  properties?: Record<string, string | number | boolean>;

  // Timestamp
  occurred_at: string;
}

// --- SDK configuration ---

/** Configuration options for the tracking SDK */
export interface ClarityPulseConfig {
  /** Site public token (required) */
  siteToken: string;
  /** API endpoint URL (defaults to /api/collect on same origin) */
  apiUrl?: string;
  /** Enable debug logging to console (default: false) */
  debug?: boolean;
  /** Hostnames to ignore (default: localhost, 127.0.0.1) */
  ignoreHostnames?: string[];
  /** Query params to strip from URLs (default: email, token, password, etc.) */
  sensitiveParams?: string[];
  /** Disable automatic pageview tracking (default: false) */
  manualPageviews?: boolean;
  /** Respect Do Not Track header (default: true) */
  honorDNT?: boolean;
}

// --- Token cache entry ---

export interface TokenCacheEntry {
  siteId: string;
  allowedDomains: string[];
  isActive: boolean;
  cachedAt: number;
}

// --- API response types ---

export interface CollectResponse {
  status: 'accepted' | 'rate_limited';
}

// --- Internal filter types ---

export interface TrafficFilter {
  type: 'ip' | 'hostname' | 'bot' | 'param';
  shouldBlock: (context: FilterContext) => boolean;
}

export interface FilterContext {
  ip?: string;
  hostname: string;
  userAgent: string;
  url: string;
  isWebdriver?: boolean;
  viewportWidth?: number;
  viewportHeight?: number;
}
