// ============================================================
// ClarityPulse — TypeScript Tracking SDK v2
// For use in SPAs and TypeScript projects via npm
//
// Usage:
//   import { init, trackEvent, trackPageview } from '@/lib/tracking/sdk';
//   init({ siteToken: 'YOUR_TOKEN' });
//   trackEvent('signup_click', { plan: 'pro' });
// ============================================================

import type {
  ClarityPulseConfig,
  PageviewPayload,
  CustomEventPayload,
  PageLeavePayload,
  EventPayload,
} from './types';

// --- State ---
let config: Required<ClarityPulseConfig> | null = null;
let sessionId = '';
let isFirstPageview = true;
let lastPageviewPath = '';
let lastPageviewTime = 0;
let previousPath = '';
let utmParams: Record<string, string> = {};
let initialized = false;

// Cleanup functions for SPA observers
const cleanupFns: Array<() => void> = [];

// --- Constants ---
const DEDUP_INTERVAL = 500;
const FLUSH_INTERVAL = 2000;
const MAX_BUFFER = 10;
const DEFAULT_SENSITIVE_PARAMS = [
  'email', 'token', 'password', 'secret', 'key', 'auth',
  'access_token', 'refresh_token', 'api_key', 'apikey',
  'session_id', 'sessionid', 'credential',
];
const DEFAULT_IGNORED_HOSTNAMES = ['localhost', '127.0.0.1', '0.0.0.0'];

// --- Event Buffer ---
let buffer: EventPayload[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

// --- Engagement ---
let engagementStart = 0;
let totalEngagement = 0;
let isEngaged = false;
let leaveSent = false;

// --- Scroll depth ---
let maxScrollDepth = 0;
let scrollThrottle: ReturnType<typeof setTimeout> | null = null;

// --- Utilities ---

function fnv1a(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}

function sanitizeQuery(search: string): string {
  if (!search || search.length < 2) return '';
  const sensitive = config?.sensitiveParams ?? DEFAULT_SENSITIVE_PARAMS;
  try {
    const params = new URLSearchParams(search);
    for (const key of Array.from(params.keys())) {
      if (sensitive.includes(key.toLowerCase())) {
        params.delete(key);
      }
    }
    const result = params.toString();
    return result ? `?${result}` : '';
  } catch {
    return '';
  }
}

function parseUTM(): Record<string, string> {
  const utm: Record<string, string> = {};
  try {
    const params = new URLSearchParams(location.search);
    const mapping: Record<string, string> = {
      utm_source: 'us',
      utm_medium: 'um',
      utm_campaign: 'uc',
      utm_content: 'un',
      utm_term: 'ut',
    };
    for (const [param, key] of Object.entries(mapping)) {
      const val = params.get(param);
      if (val) utm[key] = val;
    }
  } catch {
    // Silent fail
  }
  return utm;
}

function extractDomain(url: string): string {
  if (!url) return '';
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

function debug(...args: unknown[]): void {
  if (config?.debug) {
    console.log('[ClarityPulse]', ...args);
  }
}

// --- Event Buffer ---

function flush(): void {
  if (!config || buffer.length === 0) return;
  const batch = buffer.splice(0);
  sendBatch(batch);
}

function enqueue(payload: EventPayload): void {
  buffer.push(payload);
  if (buffer.length >= MAX_BUFFER) {
    if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
    flush();
  } else if (!flushTimer) {
    flushTimer = setTimeout(() => {
      flushTimer = null;
      flush();
    }, FLUSH_INTERVAL);
  }
}

function sendBatch(events: EventPayload[]): void {
  if (!config) return;
  const data = JSON.stringify({ e: events, tk: config.siteToken });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([data], { type: 'application/json' });
      if (navigator.sendBeacon(config.apiUrl, blob)) return;
    }
  } catch {
    // Fall through
  }

  fetch(config.apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
    keepalive: true,
    mode: 'cors',
    credentials: 'omit',
  }).catch(() => {
    // Silent fail
  });
}

// --- Engagement ---

function startEngagement(): void {
  if (!isEngaged) {
    engagementStart = Date.now();
    isEngaged = true;
  }
}

function pauseEngagement(): void {
  if (isEngaged) {
    totalEngagement += Date.now() - engagementStart;
    isEngaged = false;
  }
}

function getEngagementTime(): number {
  let total = totalEngagement;
  if (isEngaged) total += Date.now() - engagementStart;
  return Math.round(total / 1000);
}

function resetEngagement(): void {
  totalEngagement = 0;
  engagementStart = Date.now();
  isEngaged = document.visibilityState !== 'hidden' && document.hasFocus();
}

// --- Scroll Depth ---

function updateScrollDepth(): void {
  const docHeight = Math.max(
    document.body?.scrollHeight || 0,
    document.documentElement?.scrollHeight || 0
  );
  const viewportHeight = window.innerHeight || 0;
  const scrollable = docHeight - viewportHeight;
  if (scrollable <= 0) {
    maxScrollDepth = 100;
    return;
  }
  const scrollTop = window.pageYOffset || document.documentElement?.scrollTop || 0;
  const depth = Math.round((scrollTop / scrollable) * 100);
  if (depth > maxScrollDepth) maxScrollDepth = Math.min(depth, 100);
}

// --- Page Leave ---

function trackPageLeave(): void {
  if (leaveSent) return;
  leaveSent = true;

  pauseEngagement();
  const et = getEngagementTime();
  if (et < 1) return;

  const payload: PageLeavePayload = {
    t: 'pl',
    p: location.pathname,
    et,
    sd: maxScrollDepth,
    ts: Date.now(),
    sid: sessionId,
  };

  buffer.push(payload);
  flush();
}

// --- SPA History observer ---

function setupSPAObserver(): void {
  const getPath = () => {
    return location.pathname + (config?.hashRouting ? location.hash : '');
  };

  const onNavigation = () => {
    const newPath = getPath();
    if (newPath === previousPath) return;

    trackPageLeave();
    previousPath = newPath;
    utmParams = parseUTM();

    if (!config?.manualPageviews) {
      trackPageview();
    }
  };

  // Patch pushState and replaceState
  const methods = ['pushState', 'replaceState'] as const;
  const originals: Record<string, typeof history.pushState> = {};

  for (const method of methods) {
    originals[method] = history[method].bind(history);
    (history as unknown as Record<string, unknown>)[method] = function (
      ...args: Parameters<typeof history.pushState>
    ) {
      const result = originals[method](...args);
      setTimeout(onNavigation, 0);
      return result;
    };
  }

  // Listen for popstate
  const onPopState = () => setTimeout(onNavigation, 0);
  window.addEventListener('popstate', onPopState);

  // Hash change (if hash routing enabled)
  const onHashChange = () => setTimeout(onNavigation, 0);
  if (config?.hashRouting) {
    window.addEventListener('hashchange', onHashChange);
  }

  // Scroll tracking
  const onScroll = () => {
    if (!scrollThrottle) {
      scrollThrottle = setTimeout(() => {
        scrollThrottle = null;
        updateScrollDepth();
      }, 200);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Visibility & focus
  const onVisibility = () => {
    if (document.visibilityState === 'hidden') {
      trackPageLeave();
    } else {
      leaveSent = false;
      startEngagement();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('focus', startEngagement);
  window.addEventListener('blur', pauseEngagement);
  window.addEventListener('pagehide', trackPageLeave);

  // Cleanup
  cleanupFns.push(() => {
    for (const method of methods) {
      (history as unknown as Record<string, unknown>)[method] = originals[method];
    }
    window.removeEventListener('popstate', onPopState);
    window.removeEventListener('hashchange', onHashChange);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('focus', startEngagement);
    window.removeEventListener('blur', pauseEngagement);
    window.removeEventListener('pagehide', trackPageLeave);
  });
}

// --- Public API ---

/**
 * Initialize the ClarityPulse tracker
 */
export function init(userConfig: ClarityPulseConfig): void {
  if (initialized) {
    debug('Already initialized');
    return;
  }

  // Don't track in non-browser environments
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Respect Do Not Track
  if (
    userConfig.honorDNT !== false &&
    (navigator.doNotTrack === '1' || (window as { doNotTrack?: string }).doNotTrack === '1')
  ) {
    debug('Do Not Track enabled, skipping');
    return;
  }

  // Don't track automated browsers
  if ((navigator as { webdriver?: boolean }).webdriver) return;

  // Check ignored hostnames
  const ignoreHosts = userConfig.ignoreHostnames ?? DEFAULT_IGNORED_HOSTNAMES;
  const hostname = location.hostname;
  if (
    ignoreHosts.includes(hostname) ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.test')
  ) {
    debug('Ignored hostname:', hostname);
    return;
  }

  // Ignore param
  if (location.search.includes('claritypulse_ignore=true')) return;

  config = {
    siteToken: userConfig.siteToken,
    apiUrl: userConfig.apiUrl ?? '/api/collect',
    debug: userConfig.debug ?? false,
    ignoreHostnames: ignoreHosts,
    sensitiveParams: userConfig.sensitiveParams ?? DEFAULT_SENSITIVE_PARAMS,
    manualPageviews: userConfig.manualPageviews ?? false,
    honorDNT: userConfig.honorDNT ?? true,
    hashRouting: userConfig.hashRouting ?? false,
  };

  // Generate session ID (day-scoped, cookie-free)
  const today = new Date().toISOString().substring(0, 10);
  const fingerprint = [
    screen.width, screen.height, screen.colorDepth,
    navigator.language || '',
    new Date().getTimezoneOffset(),
    today,
  ].join('|');
  sessionId = fnv1a(fingerprint + String(Math.random()));

  previousPath = location.pathname + (config.hashRouting ? location.hash : '');
  utmParams = parseUTM();
  initialized = true;

  // Set up SPA navigation observer
  setupSPAObserver();

  debug('Initialized with token:', config.siteToken.substring(0, 8) + '...');

  // Track initial pageview
  if (!config.manualPageviews) {
    if (document.visibilityState === 'hidden') {
      const onVisible = () => {
        if (document.visibilityState === 'visible') {
          document.removeEventListener('visibilitychange', onVisible);
          startEngagement();
          trackPageview();
        }
      };
      document.addEventListener('visibilitychange', onVisible);
    } else {
      startEngagement();
      trackPageview();
    }
  }
}

/**
 * Track a pageview event
 */
export function trackPageview(): void {
  if (!config) return;

  const now = Date.now();
  const currentPath = location.pathname;

  // Dedup
  if (currentPath === lastPageviewPath && now - lastPageviewTime < DEDUP_INTERVAL) {
    return;
  }

  if (document.visibilityState === 'hidden') return;

  lastPageviewPath = currentPath;
  lastPageviewTime = now;

  // Reset engagement and scroll for new page
  leaveSent = false;
  resetEngagement();
  maxScrollDepth = 0;

  let referrer = document.referrer;
  let referrerDomain = extractDomain(referrer);

  // Don't count same-site as referrer
  if (referrerDomain === location.hostname) {
    referrer = '';
    referrerDomain = '';
  }

  const payload: PageviewPayload = {
    t: 'pv',
    u: location.href.substring(0, 2048),
    p: currentPath,
    q: sanitizeQuery(location.search),
    vw: window.innerWidth || 0,
    vh: window.innerHeight || 0,
    ts: now,
    sid: sessionId,
    uniq: isFirstPageview ? 1 : 0,
  };

  if (referrer && isFirstPageview) {
    payload.r = referrer.substring(0, 2048);
    payload.rd = referrerDomain;
  }

  if (utmParams.us) payload.us = utmParams.us;
  if (utmParams.um) payload.um = utmParams.um;
  if (utmParams.uc) payload.uc = utmParams.uc;
  if (utmParams.un) payload.un = utmParams.un;
  if (utmParams.ut) payload.ut = utmParams.ut;

  isFirstPageview = false;

  debug('Pageview:', payload.p);
  enqueue(payload);
}

/**
 * Track a custom event
 */
export function trackEvent(
  name: string,
  properties?: Record<string, string | number | boolean>
): void {
  if (!config || !name) return;

  // Sanitize event name
  const cleanName = name
    .substring(0, 128)
    .replace(/[^a-zA-Z0-9_\-\.]/g, '_');

  // Sanitize properties
  let cleanProps: Record<string, string | number | boolean> | undefined;
  if (properties) {
    cleanProps = {};
    const keys = Object.keys(properties).slice(0, 10);
    for (const key of keys) {
      const val = properties[key];
      const cleanKey = key.substring(0, 64);
      if (typeof val === 'string') {
        cleanProps[cleanKey] = val.substring(0, 256);
      } else if (typeof val === 'number' || typeof val === 'boolean') {
        cleanProps[cleanKey] = val;
      }
    }
  }

  const payload: CustomEventPayload = {
    t: 'ev',
    n: cleanName,
    u: location.href.substring(0, 2048),
    p: location.pathname,
    ts: Date.now(),
    sid: sessionId,
  };

  if (cleanProps && Object.keys(cleanProps).length > 0) {
    payload.pr = cleanProps;
  }

  debug('Event:', cleanName, cleanProps);
  enqueue(payload);
}

/**
 * Destroy the tracker and clean up all observers
 */
export function destroy(): void {
  // Flush remaining events
  flush();

  for (const cleanup of cleanupFns) {
    cleanup();
  }
  cleanupFns.length = 0;

  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  config = null;
  initialized = false;
  debug('Destroyed');
}
