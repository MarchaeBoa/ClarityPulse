/**
 * ClarityPulse Tracking Script v2
 * Privacy-first, cookie-free, lightweight analytics
 *
 * Features:
 * - Event batching (reduces network calls by up to 10x)
 * - Engagement time tracking (real time on page)
 * - Scroll depth measurement
 * - SPA-compatible (History API + hash routing)
 * - No cookies, no PII collection
 * - Do Not Track respected
 *
 * Usage:
 *   <script data-site="YOUR_TOKEN" src="https://cdn.claritypulse.io/cp.js" defer></script>
 *
 * Custom events:
 *   window.claritypulse('event', 'signup_click', { plan: 'pro' });
 *
 * Attributes:
 *   data-site    — Required. Your site public token.
 *   data-api     — API endpoint (default: /api/collect)
 *   data-manual  — Disable automatic pageview tracking
 *   data-hash    — Enable hash-based routing support
 *
 * Size target: < 4kb gzipped
 */
(function () {
  'use strict';

  var w = window;
  var d = document;
  var n = navigator;
  var l = location;

  // --- Early exit conditions ---
  if (d.visibilityState === 'prerender') return;
  if (n.doNotTrack === '1' || w.doNotTrack === '1') return;
  if (n.webdriver) return;

  // --- Script config ---
  var scriptEl = d.currentScript || d.querySelector('script[data-site]');
  if (!scriptEl) return;

  var siteToken = scriptEl.getAttribute('data-site');
  if (!siteToken) return;

  var apiUrl = scriptEl.getAttribute('data-api') || '/api/collect';
  var manualMode = scriptEl.hasAttribute('data-manual');
  var hashMode = scriptEl.hasAttribute('data-hash');

  // --- Hostname filter ---
  var hostname = l.hostname;
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.slice(-6) === '.local' ||
    hostname.slice(-5) === '.test'
  ) {
    return;
  }

  // --- Ignore param ---
  if (l.search.indexOf('claritypulse_ignore=true') !== -1) return;

  // --- Sensitive query params to strip ---
  var sensitiveParams = [
    'email', 'token', 'password', 'secret', 'key', 'auth',
    'access_token', 'refresh_token', 'api_key', 'apikey',
    'session_id', 'sessionid', 'credential', 'ssn', 'credit_card'
  ];

  // ================================================================
  // Utilities
  // ================================================================

  /** FNV-1a 32-bit hash */
  function fnv1a(str) {
    var hash = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = (hash * 0x01000193) >>> 0;
    }
    return hash.toString(16);
  }

  /** Strip sensitive parameters from query string */
  function sanitizeQuery(search) {
    if (!search || search.length < 2) return '';
    try {
      var params = search.substring(1).split('&');
      var clean = [];
      for (var i = 0; i < params.length; i++) {
        var key = params[i].split('=')[0].toLowerCase();
        var found = false;
        for (var j = 0; j < sensitiveParams.length; j++) {
          if (key === sensitiveParams[j]) { found = true; break; }
        }
        if (!found) clean.push(params[i]);
      }
      return clean.length ? '?' + clean.join('&') : '';
    } catch (e) {
      return '';
    }
  }

  /** Parse UTM parameters from current URL */
  function parseUTM() {
    var utm = {};
    try {
      var params = l.search.substring(1).split('&');
      for (var i = 0; i < params.length; i++) {
        var parts = params[i].split('=');
        var k = decodeURIComponent(parts[0]);
        var v = parts[1] ? decodeURIComponent(parts[1]) : '';
        if (k === 'utm_source') utm.us = v;
        else if (k === 'utm_medium') utm.um = v;
        else if (k === 'utm_campaign') utm.uc = v;
        else if (k === 'utm_content') utm.un = v;
        else if (k === 'utm_term') utm.ut = v;
      }
    } catch (e) { /* silent */ }
    return utm;
  }

  /** Extract domain from a URL */
  function extractDomain(url) {
    if (!url) return '';
    try {
      var a = d.createElement('a');
      a.href = url.indexOf('//') === 0 ? 'https:' + url : url;
      return a.hostname || '';
    } catch (e) {
      return '';
    }
  }

  // ================================================================
  // Session Management (cookie-free, day-scoped)
  // ================================================================

  var today = new Date().toISOString().substring(0, 10);
  var fingerprint = [
    screen.width, screen.height, screen.colorDepth,
    n.language || '',
    new Date().getTimezoneOffset(),
    today
  ].join('|');
  var sessionId = fnv1a(fingerprint + String(Math.random()));
  var isFirstPageview = true;

  // ================================================================
  // Event Buffer (batching)
  // ================================================================

  var buffer = [];
  var FLUSH_INTERVAL = 2000;
  var MAX_BUFFER = 10;
  var flushTimer = null;

  function flush() {
    if (!buffer.length) return;
    var batch = buffer.splice(0, buffer.length);
    sendBatch(batch);
  }

  function enqueue(payload) {
    buffer.push(payload);
    if (buffer.length >= MAX_BUFFER) {
      if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
      flush();
    } else if (!flushTimer) {
      flushTimer = setTimeout(function () {
        flushTimer = null;
        flush();
      }, FLUSH_INTERVAL);
    }
  }

  /** Send a batch of events. Fallback chain: sendBeacon → fetch → XHR */
  function sendBatch(events) {
    var data = JSON.stringify({ e: events, tk: siteToken });

    // 1. sendBeacon (survives page unload)
    try {
      if (n.sendBeacon) {
        var blob = new Blob([data], { type: 'application/json' });
        if (n.sendBeacon(apiUrl, blob)) return;
      }
    } catch (e) { /* fall through */ }

    // 2. fetch with keepalive
    try {
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
        keepalive: true,
        mode: 'cors',
        credentials: 'omit'
      }).catch(function () { /* silent */ });
    } catch (e) {
      // 3. XMLHttpRequest (final fallback)
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', apiUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data);
      } catch (e2) { /* give up silently */ }
    }
  }

  // ================================================================
  // Deduplication
  // ================================================================

  var lastPageviewPath = '';
  var lastPageviewTime = 0;
  var DEDUP_INTERVAL = 500;

  // ================================================================
  // UTM Cache
  // ================================================================

  var utmParams = parseUTM();

  // ================================================================
  // Engagement Time Tracking
  // ================================================================

  var engagementStart = 0;
  var totalEngagement = 0;
  var isEngaged = false;

  function startEngagement() {
    if (!isEngaged) {
      engagementStart = Date.now();
      isEngaged = true;
    }
  }

  function pauseEngagement() {
    if (isEngaged) {
      totalEngagement += Date.now() - engagementStart;
      isEngaged = false;
    }
  }

  function getEngagementTime() {
    var total = totalEngagement;
    if (isEngaged) total += Date.now() - engagementStart;
    return Math.round(total / 1000); // seconds
  }

  function resetEngagement() {
    totalEngagement = 0;
    engagementStart = Date.now();
    isEngaged = d.visibilityState !== 'hidden' && d.hasFocus();
  }

  // ================================================================
  // Scroll Depth Tracking
  // ================================================================

  var maxScrollDepth = 0;
  var scrollThrottle = null;

  function updateScrollDepth() {
    var docHeight = Math.max(
      d.body ? d.body.scrollHeight : 0,
      d.documentElement ? d.documentElement.scrollHeight : 0
    );
    var viewportHeight = w.innerHeight || 0;
    var scrollable = docHeight - viewportHeight;
    if (scrollable <= 0) {
      maxScrollDepth = 100;
      return;
    }
    var scrollTop = w.pageYOffset || (d.documentElement ? d.documentElement.scrollTop : 0) || 0;
    var depth = Math.round((scrollTop / scrollable) * 100);
    if (depth > maxScrollDepth) maxScrollDepth = Math.min(depth, 100);
  }

  w.addEventListener('scroll', function () {
    if (!scrollThrottle) {
      scrollThrottle = setTimeout(function () {
        scrollThrottle = null;
        updateScrollDepth();
      }, 200);
    }
  }, { passive: true });

  // ================================================================
  // Core Tracking
  // ================================================================

  var leaveSent = false;

  /** Track a pageview event */
  function trackPageview() {
    var now = Date.now();
    var currentPath = l.pathname;

    // Dedup: same path within 500ms
    if (currentPath === lastPageviewPath && now - lastPageviewTime < DEDUP_INTERVAL) {
      return;
    }

    // Only track visible pages
    if (d.visibilityState === 'hidden') return;

    lastPageviewPath = currentPath;
    lastPageviewTime = now;

    // Reset engagement and scroll for new page
    leaveSent = false;
    resetEngagement();
    maxScrollDepth = 0;

    var referrer = d.referrer;
    var referrerDomain = extractDomain(referrer);

    // Don't count same-site as referrer
    if (referrerDomain === hostname) {
      referrer = '';
      referrerDomain = '';
    }

    var payload = {
      t: 'pv',
      u: l.href.substring(0, 2048),
      p: currentPath,
      q: sanitizeQuery(l.search),
      vw: w.innerWidth || 0,
      vh: w.innerHeight || 0,
      ts: now,
      sid: sessionId,
      uniq: isFirstPageview ? 1 : 0
    };

    // Add referrer only on first pageview or external referrer
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
    enqueue(payload);
  }

  /** Track a custom event */
  function trackEvent(name, properties) {
    if (!name || typeof name !== 'string') return;

    // Sanitize event name
    name = name.substring(0, 128).replace(/[^a-zA-Z0-9_\-\.]/g, '_');

    // Sanitize properties
    var cleanProps = null;
    if (properties && typeof properties === 'object') {
      cleanProps = {};
      var keys = Object.keys(properties);
      var count = Math.min(keys.length, 10);
      for (var i = 0; i < count; i++) {
        var k = keys[i].substring(0, 64);
        var v = properties[keys[i]];
        if (typeof v === 'string') cleanProps[k] = v.substring(0, 256);
        else if (typeof v === 'number' || typeof v === 'boolean') cleanProps[k] = v;
      }
    }

    var payload = {
      t: 'ev',
      n: name,
      u: l.href.substring(0, 2048),
      p: l.pathname,
      ts: Date.now(),
      sid: sessionId
    };

    if (cleanProps) payload.pr = cleanProps;
    enqueue(payload);
  }

  /** Track page leave with engagement time and scroll depth */
  function trackPageLeave() {
    if (leaveSent) return;
    leaveSent = true;

    pauseEngagement();
    var et = getEngagementTime();

    // Don't track sub-second visits (likely bots or bounces with no interaction)
    if (et < 1) return;

    buffer.push({
      t: 'pl',
      p: l.pathname,
      et: et,
      sd: maxScrollDepth,
      ts: Date.now(),
      sid: sessionId
    });
    flush(); // Immediate flush — page may be closing
  }

  // ================================================================
  // SPA Support: History API interception
  // ================================================================

  var previousPath = l.pathname + (hashMode ? l.hash : '');

  function onNavigation() {
    var newPath = l.pathname + (hashMode ? l.hash : '');
    if (newPath === previousPath) return;

    // Send page leave for the previous page
    trackPageLeave();

    previousPath = newPath;
    utmParams = parseUTM();

    if (!manualMode) {
      trackPageview();
    }
  }

  // Monkey-patch pushState and replaceState
  function patchHistory(method) {
    var original = history[method];
    if (!original) return;

    history[method] = function () {
      var result = original.apply(this, arguments);
      setTimeout(onNavigation, 0);
      return result;
    };
  }

  patchHistory('pushState');
  patchHistory('replaceState');

  // Back/forward navigation
  w.addEventListener('popstate', function () {
    setTimeout(onNavigation, 0);
  });

  // Hash-based routing support
  if (hashMode) {
    w.addEventListener('hashchange', function () {
      setTimeout(onNavigation, 0);
    });
  }

  // ================================================================
  // Visibility & Focus (engagement tracking + page leave)
  // ================================================================

  d.addEventListener('visibilitychange', function () {
    if (d.visibilityState === 'hidden') {
      trackPageLeave();
    } else {
      // Tab came back — allow a new page leave to fire
      leaveSent = false;
      startEngagement();
    }
  });

  w.addEventListener('focus', startEngagement);
  w.addEventListener('blur', pauseEngagement);

  // pagehide covers tab close and navigation away (bfcache safe)
  w.addEventListener('pagehide', trackPageLeave);

  // ================================================================
  // Public API
  // ================================================================

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

  // ================================================================
  // Initialization
  // ================================================================

  function init() {
    if (d.visibilityState === 'hidden') {
      // Page opened in background — wait until visible
      var onVisible = function () {
        if (d.visibilityState === 'visible') {
          d.removeEventListener('visibilitychange', onVisible);
          startEngagement();
          if (!manualMode) trackPageview();
        }
      };
      d.addEventListener('visibilitychange', onVisible);
      return;
    }

    startEngagement();
    if (!manualMode) trackPageview();
  }

  // Use requestIdleCallback for non-blocking init
  if (w.requestIdleCallback) {
    w.requestIdleCallback(init, { timeout: 1000 });
  } else {
    init();
  }
})();
