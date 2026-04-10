/**
 * ClarityPulse Tracking Script
 * Privacy-first, cookie-free, lightweight analytics
 *
 * Usage:
 *   <script data-site="YOUR_TOKEN" src="https://cdn.claritypulse.io/cp.js" defer></script>
 *
 * Custom events:
 *   window.claritypulse('event', 'signup_click', { plan: 'pro' });
 *
 * Size target: < 4kb gzipped
 */
(function () {
  'use strict';

  // --- Early exit conditions ---
  var w = window;
  var d = document;
  var n = navigator;
  var l = location;

  // Don't track if page is prerendering
  if (d.visibilityState === 'prerender') return;

  // Respect Do Not Track
  if (n.doNotTrack === '1' || w.doNotTrack === '1') return;

  // Don't track automated browsers
  if (n.webdriver) return;

  // --- Find script config ---
  var scriptEl = d.currentScript || d.querySelector('script[data-site]');
  if (!scriptEl) return;

  var siteToken = scriptEl.getAttribute('data-site');
  if (!siteToken) return;

  var apiUrl = scriptEl.getAttribute('data-api') || '/api/collect';
  var manualMode = scriptEl.hasAttribute('data-manual');

  // --- Hostname filter ---
  var ignoredHosts = ['localhost', '127.0.0.1', '0.0.0.0'];
  var hostname = l.hostname;
  if (
    ignoredHosts.indexOf(hostname) !== -1 ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.test')
  ) {
    return;
  }

  // --- Ignore param check ---
  if (l.search.indexOf('claritypulse_ignore=true') !== -1) return;

  // --- Sensitive query params to strip ---
  var sensitiveParams = [
    'email', 'token', 'password', 'secret', 'key', 'auth',
    'access_token', 'refresh_token', 'api_key', 'apikey',
    'session_id', 'sessionid', 'credential', 'ssn', 'credit_card'
  ];

  // --- Utilities ---

  /**
   * Simple FNV-1a 32-bit hash for generating session IDs
   */
  function fnv1a(str) {
    var hash = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = (hash * 0x01000193) >>> 0;
    }
    return hash.toString(16);
  }

  /**
   * Strip sensitive parameters from a query string
   */
  function sanitizeQuery(search) {
    if (!search || search.length < 2) return '';
    try {
      var params = search.substring(1).split('&');
      var clean = [];
      for (var i = 0; i < params.length; i++) {
        var key = params[i].split('=')[0].toLowerCase();
        var isSensitive = false;
        for (var j = 0; j < sensitiveParams.length; j++) {
          if (key === sensitiveParams[j]) {
            isSensitive = true;
            break;
          }
        }
        if (!isSensitive) {
          clean.push(params[i]);
        }
      }
      return clean.length > 0 ? '?' + clean.join('&') : '';
    } catch (e) {
      return '';
    }
  }

  /**
   * Parse UTM parameters from the current URL
   */
  function parseUTM() {
    var utm = {};
    try {
      var params = l.search.substring(1).split('&');
      for (var i = 0; i < params.length; i++) {
        var parts = params[i].split('=');
        var key = decodeURIComponent(parts[0]);
        var val = parts[1] ? decodeURIComponent(parts[1]) : '';
        if (key === 'utm_source') utm.us = val;
        else if (key === 'utm_medium') utm.um = val;
        else if (key === 'utm_campaign') utm.uc = val;
        else if (key === 'utm_content') utm.un = val;
        else if (key === 'utm_term') utm.ut = val;
      }
    } catch (e) {
      // Silent fail
    }
    return utm;
  }

  /**
   * Extract domain from a URL
   */
  function extractDomain(url) {
    if (!url) return '';
    try {
      // Handle protocol-relative URLs
      if (url.indexOf('//') === 0) url = 'https:' + url;
      var a = d.createElement('a');
      a.href = url;
      return a.hostname || '';
    } catch (e) {
      return '';
    }
  }

  /**
   * Send event data to the API endpoint
   * Uses sendBeacon for reliability (survives page unload),
   * falls back to fetch for broader compatibility
   */
  function send(payload) {
    var data = JSON.stringify(payload);

    try {
      if (n.sendBeacon) {
        var blob = new Blob([data], { type: 'application/json' });
        var queued = n.sendBeacon(apiUrl, blob);
        if (queued) return;
      }
    } catch (e) {
      // sendBeacon failed, fall through to fetch
    }

    // Fallback: fetch with keepalive
    try {
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
        keepalive: true,
        mode: 'cors',
        credentials: 'omit'
      }).catch(function () {
        // Silent fail — analytics should never break the site
      });
    } catch (e) {
      // Final fallback: XMLHttpRequest
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', apiUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data);
      } catch (e2) {
        // Completely give up — never throw
      }
    }
  }

  // --- Session management (in-memory only, no cookies) ---

  var sessionId = fnv1a(String(Date.now()) + String(Math.random()));
  var isFirstPageview = true;

  // --- Deduplication ---

  var lastPageviewUrl = '';
  var lastPageviewTime = 0;
  var DEDUP_INTERVAL = 500; // ms — prevent double-fire in SPAs

  // --- UTM (parsed once, cached) ---

  var utmParams = parseUTM();

  // --- Core tracking functions ---

  /**
   * Track a pageview event
   */
  function trackPageview() {
    var now = Date.now();
    var currentUrl = l.href;

    // Dedup: same URL within 500ms
    if (currentUrl === lastPageviewUrl && now - lastPageviewTime < DEDUP_INTERVAL) {
      return;
    }

    // Only track visible pages
    if (d.visibilityState === 'hidden') return;

    lastPageviewUrl = currentUrl;
    lastPageviewTime = now;

    var referrer = d.referrer;
    var referrerDomain = extractDomain(referrer);

    // Don't count same-site as referrer
    if (referrerDomain === hostname) {
      referrer = '';
      referrerDomain = '';
    }

    var payload = {
      t: 'pv',
      tk: siteToken,
      u: currentUrl.substring(0, 2048),
      p: l.pathname,
      q: sanitizeQuery(l.search),
      vw: w.innerWidth || 0,
      vh: w.innerHeight || 0,
      ts: now,
      sid: sessionId,
      uniq: isFirstPageview ? 1 : 0
    };

    // Add referrer (only on first pageview or external referrer)
    if (referrer && isFirstPageview) {
      payload.r = referrer.substring(0, 2048);
      payload.rd = referrerDomain;
    }

    // Add UTMs (only if present)
    if (utmParams.us) payload.us = utmParams.us;
    if (utmParams.um) payload.um = utmParams.um;
    if (utmParams.uc) payload.uc = utmParams.uc;
    if (utmParams.un) payload.un = utmParams.un;
    if (utmParams.ut) payload.ut = utmParams.ut;

    isFirstPageview = false;

    send(payload);
  }

  /**
   * Track a custom event
   */
  function trackEvent(name, properties) {
    if (!name || typeof name !== 'string') return;

    // Sanitize event name
    name = name.substring(0, 128).replace(/[^a-zA-Z0-9_\-\.]/g, '_');

    // Sanitize properties
    var cleanProps = null;
    if (properties && typeof properties === 'object') {
      cleanProps = {};
      var keys = Object.keys(properties);
      var count = Math.min(keys.length, 10); // Max 10 properties
      for (var i = 0; i < count; i++) {
        var key = keys[i].substring(0, 64);
        var val = properties[keys[i]];
        if (typeof val === 'string') {
          cleanProps[key] = val.substring(0, 256);
        } else if (typeof val === 'number' || typeof val === 'boolean') {
          cleanProps[key] = val;
        }
      }
    }

    var payload = {
      t: 'ev',
      tk: siteToken,
      n: name,
      u: l.href.substring(0, 2048),
      p: l.pathname,
      ts: Date.now(),
      sid: sessionId
    };

    if (cleanProps) {
      payload.pr = cleanProps;
    }

    send(payload);
  }

  // --- SPA support: intercept History API ---

  var previousPath = l.pathname;

  function onNavigation() {
    // Check if path actually changed (ignore hash-only changes for non-hash routers)
    if (l.pathname === previousPath && l.search === '') return;
    previousPath = l.pathname;

    // Re-parse UTMs on navigation (SPAs may add UTM params dynamically)
    utmParams = parseUTM();

    if (!manualMode) {
      trackPageview();
    }
  }

  // Monkey-patch pushState and replaceState
  function patchHistoryMethod(method) {
    var original = history[method];
    if (!original) return;

    history[method] = function () {
      var result = original.apply(this, arguments);
      // Use setTimeout to let the browser update location first
      setTimeout(onNavigation, 0);
      return result;
    };
  }

  patchHistoryMethod('pushState');
  patchHistoryMethod('replaceState');

  // Back/forward navigation
  w.addEventListener('popstate', function () {
    setTimeout(onNavigation, 0);
  });

  // Hash-based routing support
  w.addEventListener('hashchange', function () {
    if (!manualMode) {
      trackPageview();
    }
  });

  // --- Visibility change: track when tab becomes visible again ---
  // (Handles case where user opens link in background tab)

  var pendingVisibilityPageview = false;

  d.addEventListener('visibilitychange', function () {
    if (d.visibilityState === 'visible' && pendingVisibilityPageview) {
      pendingVisibilityPageview = false;
      if (!manualMode) {
        trackPageview();
      }
    }
  });

  // --- Public API ---

  w.claritypulse = function (command, arg1, arg2) {
    switch (command) {
      case 'event':
        trackEvent(arg1, arg2);
        break;
      case 'pageview':
        trackPageview();
        break;
    }
  };

  // Process queued commands (if user called claritypulse() before script loaded)
  var queue = w.claritypulse && w.claritypulse.q;
  if (queue && queue.length) {
    for (var i = 0; i < queue.length; i++) {
      w.claritypulse.apply(null, queue[i]);
    }
  }

  // --- Initial pageview ---

  function init() {
    if (d.visibilityState === 'hidden') {
      pendingVisibilityPageview = true;
      return;
    }

    if (!manualMode) {
      trackPageview();
    }
  }

  // Use requestIdleCallback if available, otherwise run immediately
  if (w.requestIdleCallback) {
    w.requestIdleCallback(init, { timeout: 1000 });
  } else {
    init();
  }
})();
