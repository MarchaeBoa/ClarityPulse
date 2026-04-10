// ============================================================
// ClarityPulse — TypeScript Tracking SDK
// For use in SPAs and TypeScript projects via npm
//
// Usage:
//   import { init, trackEvent, trackPageview } from '@/lib/tracking/sdk';
//   init({ siteToken: 'YOUR_TOKEN' });
//   trackEvent('signup_click', { plan: 'pro' });
// ============================================================

import type { ClarityPulseConfig, PageviewPayload, CustomEventPayload } from './types';

// --- State ---
let config: Required<ClarityPulseConfig> | null = null;
let sessionId = '';
let isFirstPageview = true;
let lastPageviewUrl = '';
let lastPageviewTime = 0;
let previousPath = '';
let utmParams: Record<string, string> = {};
let initialized = false;

// Cleanup functions for SPA observers
const cleanupFns: Array<() => void> = [];

// --- Constants ---
const DEDUP_INTERVAL = 500;
const DEFAULT_SENSITIVE_PARAMS = [
  'email', 'token', 'password', 'secret', 'key', 'auth',
  'access_token', 'refresh_token', 'api_key', 'apikey',
  'session_id', 'sessionid', 'credential',
];
const DEFAULT_IGNORED_HOSTNAMES = ['localhost', '127.0.0.1', '0.0.0.0'];

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

function send(payload: PageviewPayload | CustomEventPayload): void {
  if (!config) return;

  const data = JSON.stringify(payload);

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

function debug(...args: unknown[]): void {
  if (config?.debug) {
    console.log('[ClarityPulse]', ...args);
  }
}

// --- SPA History observer ---

function setupSPAObserver(): void {
  const onNavigation = () => {
    if (location.pathname === previousPath) return;
    previousPath = location.pathname;
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
    (history as Record<string, unknown>)[method] = function (
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

  // Cleanup function
  cleanupFns.push(() => {
    for (const method of methods) {
      (history as Record<string, unknown>)[method] = originals[method];
    }
    window.removeEventListener('popstate', onPopState);
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
  };

  sessionId = fnv1a(`${Date.now()}${Math.random()}`);
  previousPath = location.pathname;
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
          trackPageview();
        }
      };
      document.addEventListener('visibilitychange', onVisible);
    } else {
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
  const currentUrl = location.href;

  // Dedup
  if (currentUrl === lastPageviewUrl && now - lastPageviewTime < DEDUP_INTERVAL) {
    return;
  }

  if (document.visibilityState === 'hidden') return;

  lastPageviewUrl = currentUrl;
  lastPageviewTime = now;

  let referrer = document.referrer;
  let referrerDomain = extractDomain(referrer);

  // Don't count same-site as referrer
  if (referrerDomain === location.hostname) {
    referrer = '';
    referrerDomain = '';
  }

  const payload: PageviewPayload = {
    t: 'pv',
    tk: config.siteToken,
    u: currentUrl.substring(0, 2048),
    p: location.pathname,
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
  send(payload);
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
    tk: config.siteToken,
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
  send(payload);
}

/**
 * Destroy the tracker and clean up all observers
 */
export function destroy(): void {
  for (const cleanup of cleanupFns) {
    cleanup();
  }
  cleanupFns.length = 0;
  config = null;
  initialized = false;
  debug('Destroyed');
}
