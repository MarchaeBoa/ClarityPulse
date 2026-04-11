/**
 * ClarityPulse Tracking Script v3
 * Privacy-first, cookie-free, lightweight analytics
 *
 * Features:
 * - Event batching (reduces network calls by up to 10x)
 * - Engagement time tracking (real time on page)
 * - Scroll depth measurement
 * - SPA-compatible (History API + hash routing)
 * - No cookies, no PII collection
 * - Do Not Track respected
 * - Pre-load command queue
 *
 * Installation:
 *   <script defer data-site="YOUR_TOKEN" src="https://cdn.claritypulse.io/cp.js"></script>
 *
 * Custom events:
 *   claritypulse.track('signup_button_click');
 *   claritypulse.track('purchase', { plan: 'pro', value: 49 });
 *
 * Manual pageview (when data-manual is set):
 *   claritypulse.pageview();
 *
 * Pre-load queue (call before script loads):
 *   <script>
 *     window.claritypulse = window.claritypulse || [];
 *     claritypulse.push(['track', 'early_click']);
 *   </script>
 *
 * Attributes:
 *   data-site    - Required. Your site public token.
 *   data-api     - API endpoint (default: origin of this script + /api/collect)
 *   data-manual  - Disable automatic pageview tracking
 *   data-hash    - Enable hash-based routing support
 *
 * Size target: < 4kb gzipped
 */
(function () {
  'use strict';

  var w = window;
  var d = document;
  var n = navigator;
  var l = location;

  // ================================================================
  // Early exit conditions
  // ================================================================

  if (d.visibilityState === 'prerender') return;
  if (n.doNotTrack === '1' || w.doNotTrack === '1') return;
  if (n.webdriver) return;

  // ================================================================
  // Script configuration from data attributes
  // ================================================================

  var scriptEl = d.currentScript || d.querySelector('script[data-site]');
  if (!scriptEl) return;

  var siteToken = scriptEl.getAttribute('data-site');
  if (!siteToken) return;

  // Resolve API URL: explicit data-api, or derive from script src origin
  var apiUrl = scriptEl.getAttribute('data-api');
  if (!apiUrl) {
    var src = scriptEl.getAttribute('src');
    if (src) {
      try {
        var origin = new URL(src, l.href).origin;
        apiUrl = origin + '/api/collect';
      } catch (e) {
        apiUrl = '/api/collect';
      }
    } else {
      apiUrl = '/api/collect';
    }
  }

  var manualMode = scriptEl.hasAttribute('data-manual');
  var hashMode = scriptEl.hasAttribute('data-hash');

  // ================================================================
  // Hostname filter - don't track local/test environments
  // ================================================================

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

  if (l.search.indexOf('claritypulse_ignore=true') !== -1) return;

  // ================================================================
  // Sensitive query params to strip from tracked URLs
  // ================================================================

  var SENSITIVE = [
    'email', 'token', 'password', 'secret', 'key', 'auth',
    'access_token', 'refresh_token', 'api_key', 'apikey',
    'session_id', 'sessionid', 'credential', 'ssn', 'credit_card'
  ];

  // ================================================================
  // Utilities
  // ================================================================

  /** FNV-1a 32-bit hash - fast, non-cryptographic */
  function fnv1a(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 0x01000193) >>> 0;
    }
    return h.toString(16);
  }

  /** Strip sensitive parameters from query string */
  function sanitizeQuery(search) {
    if (!search || search.length < 2) return '';
    try {
      var pairs = search.substring(1).split('&');
      var clean = [];
      for (var i = 0; i < pairs.length; i++) {
        var k = pairs[i].split('=')[0].toLowerCase();
        var blocked = false;
        for (var j = 0; j < SENSITIVE.length; j++) {
          if (k === SENSITIVE[j]) { blocked = true; break; }
        }
        if (!blocked) clean.push(pairs[i]);
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
      var pairs = l.search.substring(1).split('&');
      var map = {
        utm_source: 'us', utm_medium: 'um', utm_campaign: 'uc',
        utm_content: 'un', utm_term: 'ut'
      };
      for (var i = 0; i < pairs.length; i++) {
        var kv = pairs[i].split('=');
        var key = decodeURIComponent(kv[0]);
        if (map[key] && kv[1]) {
          utm[map[key]] = decodeURIComponent(kv[1]);
        }
      }
    } catch (e) { /* silent */ }
    return utm;
  }

  /** Extract hostname from a URL string */
  function extractDomain(url) {
    if (!url) return '';
    try {
      return new URL(url).hostname;
    } catch (e) {
      return '';
    }
  }

  // ================================================================
  // Session (cookie-free, day-scoped)
  // ================================================================

  var today = new Date().toISOString().substring(0, 10);
  var sessionId = fnv1a([
    screen.width, screen.height, screen.colorDepth,
    n.language || '', new Date().getTimezoneOffset(), today
  ].join('|') + Math.random());
  var isFirstPageview = true;

  // ================================================================
  // Event buffer and batching
  // ================================================================

  var buffer = [];
  var FLUSH_MS = 2000;
  var MAX_BATCH = 10;
  var flushTimer = null;

  function flush() {
    if (!buffer.length) return;
    sendBatch(buffer.splice(0, buffer.length));
  }

  function enqueue(payload) {
    buffer.push(payload);
    if (buffer.length >= MAX_BATCH) {
      if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
      flush();
    } else if (!flushTimer) {
      flushTimer = setTimeout(function () {
        flushTimer = null;
        flush();
      }, FLUSH_MS);
    }
  }

  /**
   * Send a batch of events to the API.
   * Fallback chain: sendBeacon -> fetch(keepalive) -> XMLHttpRequest
   */
  function sendBatch(events) {
    var data = JSON.stringify({ e: events, tk: siteToken });

    // 1. sendBeacon - survives page unload
    try {
      if (n.sendBeacon) {
        var blob = new Blob([data], { type: 'application/json' });
        if (n.sendBeacon(apiUrl, blob)) return;
      }
    } catch (e) { /* fall through */ }

    // 2. fetch with keepalive
    if (typeof fetch === 'function') {
      try {
        fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: data,
          keepalive: true,
          mode: 'cors',
          credentials: 'omit'
        }).catch(function () {});
        return;
      } catch (e) { /* fall through */ }
    }

    // 3. XMLHttpRequest - final fallback
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', apiUrl, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(data);
    } catch (e) { /* silent */ }
  }

  // ================================================================
  // Engagement time tracking
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

  function getEngagementSec() {
    var t = totalEngagement;
    if (isEngaged) t += Date.now() - engagementStart;
    return Math.round(t / 1000);
  }

  function resetEngagement() {
    totalEngagement = 0;
    engagementStart = Date.now();
    isEngaged = d.visibilityState !== 'hidden' && d.hasFocus();
  }

  // ================================================================
  // Scroll depth tracking
  // ================================================================

  var maxScrollDepth = 0;
  var scrollThrottle = null;

  function updateScrollDepth() {
    var docH = Math.max(
      d.body ? d.body.scrollHeight : 0,
      d.documentElement ? d.documentElement.scrollHeight : 0
    );
    var vpH = w.innerHeight || 0;
    var scrollable = docH - vpH;
    if (scrollable <= 0) { maxScrollDepth = 100; return; }
    var top = w.pageYOffset || (d.documentElement ? d.documentElement.scrollTop : 0) || 0;
    var depth = Math.round((top / scrollable) * 100);
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
  // Deduplication
  // ================================================================

  var lastPvPath = '';
  var lastPvTime = 0;
  var DEDUP_MS = 500;

  // ================================================================
  // UTM cache
  // ================================================================

  var utmParams = parseUTM();

  // ================================================================
  // Core: pageview tracking
  // ================================================================

  var leaveSent = false;

  function trackPageview() {
    var now = Date.now();
    var path = l.pathname;

    // Dedup same path within 500ms
    if (path === lastPvPath && now - lastPvTime < DEDUP_MS) return;

    // Only track visible pages
    if (d.visibilityState === 'hidden') return;

    lastPvPath = path;
    lastPvTime = now;

    // Reset engagement and scroll for new page
    leaveSent = false;
    resetEngagement();
    maxScrollDepth = 0;

    var referrer = d.referrer;
    var refDomain = extractDomain(referrer);

    // Don't count same-site navigation as referrer
    if (refDomain === hostname) {
      referrer = '';
      refDomain = '';
    }

    var payload = {
      t: 'pv',
      u: l.href.substring(0, 2048),
      p: path,
      q: sanitizeQuery(l.search),
      vw: w.innerWidth || 0,
      vh: w.innerHeight || 0,
      ts: now,
      sid: sessionId,
      uniq: isFirstPageview ? 1 : 0
    };

    // Add referrer on first pageview
    if (referrer && isFirstPageview) {
      payload.r = referrer.substring(0, 2048);
      payload.rd = refDomain;
    }

    // Add UTM params when present
    if (utmParams.us) payload.us = utmParams.us;
    if (utmParams.um) payload.um = utmParams.um;
    if (utmParams.uc) payload.uc = utmParams.uc;
    if (utmParams.un) payload.un = utmParams.un;
    if (utmParams.ut) payload.ut = utmParams.ut;

    isFirstPageview = false;
    enqueue(payload);
  }

  // ================================================================
  // Core: custom event tracking
  // ================================================================

  function trackEvent(name, properties) {
    if (!name || typeof name !== 'string') return;

    // Sanitize name: max 128 chars, alphanumeric + _ - .
    var cleanName = name.substring(0, 128).replace(/[^a-zA-Z0-9_\-\.]/g, '_');

    // Sanitize properties: max 10 keys, strings capped at 256 chars
    var cleanProps = null;
    if (properties && typeof properties === 'object' && !Array.isArray(properties)) {
      cleanProps = {};
      var keys = Object.keys(properties);
      var count = Math.min(keys.length, 10);
      for (var i = 0; i < count; i++) {
        var k = keys[i].substring(0, 64);
        var v = properties[keys[i]];
        if (typeof v === 'string') cleanProps[k] = v.substring(0, 256);
        else if (typeof v === 'number' || typeof v === 'boolean') cleanProps[k] = v;
      }
      if (!Object.keys(cleanProps).length) cleanProps = null;
    }

    var payload = {
      t: 'ev',
      n: cleanName,
      u: l.href.substring(0, 2048),
      p: l.pathname,
      ts: Date.now(),
      sid: sessionId
    };

    if (cleanProps) payload.pr = cleanProps;
    enqueue(payload);
  }

  // ================================================================
  // Core: page leave tracking
  // ================================================================

  function trackPageLeave() {
    if (leaveSent) return;
    leaveSent = true;

    pauseEngagement();
    var et = getEngagementSec();

    // Skip sub-second visits (bots or bounces with no interaction)
    if (et < 1) return;

    buffer.push({
      t: 'pl',
      p: l.pathname,
      et: et,
      sd: maxScrollDepth,
      ts: Date.now(),
      sid: sessionId
    });
    flush(); // Immediate - page may be closing
  }

  // ================================================================
  // SPA support: History API interception
  // ================================================================

  var previousPath = l.pathname + (hashMode ? l.hash : '');

  function onNavigation() {
    var newPath = l.pathname + (hashMode ? l.hash : '');
    if (newPath === previousPath) return;

    trackPageLeave();
    previousPath = newPath;
    utmParams = parseUTM();

    if (!manualMode) trackPageview();
  }

  // Patch pushState and replaceState
  var methods = ['pushState', 'replaceState'];
  for (var m = 0; m < methods.length; m++) {
    (function (method) {
      var original = history[method];
      if (!original) return;
      history[method] = function () {
        var result = original.apply(this, arguments);
        setTimeout(onNavigation, 0);
        return result;
      };
    })(methods[m]);
  }

  // Back/forward button
  w.addEventListener('popstate', function () {
    setTimeout(onNavigation, 0);
  });

  // Hash routing
  if (hashMode) {
    w.addEventListener('hashchange', function () {
      setTimeout(onNavigation, 0);
    });
  }

  // ================================================================
  // Visibility and focus (engagement + page leave)
  // ================================================================

  d.addEventListener('visibilitychange', function () {
    if (d.visibilityState === 'hidden') {
      trackPageLeave();
    } else {
      leaveSent = false;
      startEngagement();
    }
  });

  w.addEventListener('focus', startEngagement);
  w.addEventListener('blur', pauseEngagement);
  w.addEventListener('pagehide', trackPageLeave);

  // ================================================================
  // Public API
  // ================================================================

  // Save pre-load queue before overwriting
  var preQueue = w.claritypulse;

  w.claritypulse = {
    /** Track a custom event */
    track: function (name, props) {
      trackEvent(name, props);
    },
    /** Manually track a pageview */
    pageview: function () {
      trackPageview();
    },
    /** Flush pending events immediately */
    flush: function () {
      flush();
    }
  };

  // Drain pre-load queue
  // Usage before script loads:
  //   window.claritypulse = window.claritypulse || [];
  //   claritypulse.push(['track', 'early_click', { source: 'hero' }]);
  if (preQueue && preQueue.length) {
    for (var qi = 0; qi < preQueue.length; qi++) {
      var cmd = preQueue[qi];
      if (Array.isArray(cmd) && cmd[0] && w.claritypulse[cmd[0]]) {
        w.claritypulse[cmd[0]](cmd[1], cmd[2]);
      }
    }
  }

  // ================================================================
  // Initialization
  // ================================================================

  if (d.visibilityState === 'hidden') {
    var onVisible = function () {
      if (d.visibilityState === 'visible') {
        d.removeEventListener('visibilitychange', onVisible);
        startEngagement();
        if (!manualMode) trackPageview();
      }
    };
    d.addEventListener('visibilitychange', onVisible);
  } else {
    startEngagement();
    if (!manualMode) trackPageview();
  }

})();
