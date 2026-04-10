// ============================================================
// ClarityPulse — Traffic Filters
// Server-side filtering to exclude bots, internal traffic, etc.
// ============================================================

import type { FilterContext, InternalTrafficConfig } from './types';

// Known bot User-Agent patterns
const BOT_PATTERNS = [
  /bot\b/i,
  /crawl/i,
  /spider/i,
  /slurp/i,
  /mediapartners/i,
  /lighthouse/i,
  /pagespeed/i,
  /headless/i,
  /phantom/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
  /prerender/i,
  /snapchat/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /discordbot/i,
  /slackbot/i,
  /pingdom/i,
  /uptimerobot/i,
  /statuspage/i,
  /datadog/i,
  /newrelic/i,
  /ahrefs/i,
  /semrush/i,
  /mj12bot/i,
  /dotbot/i,
  /petalbot/i,
  /bytespider/i,
  /gptbot/i,
  /claudebot/i,
  /anthropic/i,
  /ccbot/i,
];

// Hostnames that should never be tracked
const IGNORED_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
]);

const IGNORED_HOSTNAME_SUFFIXES = ['.local', '.test', '.example', '.internal'];

/**
 * Check if a User-Agent string belongs to a known bot
 */
export function isBot(userAgent: string): boolean {
  if (!userAgent) return true;
  for (const pattern of BOT_PATTERNS) {
    if (pattern.test(userAgent)) return true;
  }
  return false;
}

/**
 * Check if a hostname should be ignored (localhost, test domains, etc.)
 */
export function isIgnoredHostname(hostname: string): boolean {
  if (!hostname) return true;
  const lower = hostname.toLowerCase();
  if (IGNORED_HOSTNAMES.has(lower)) return true;
  for (const suffix of IGNORED_HOSTNAME_SUFFIXES) {
    if (lower.endsWith(suffix)) return true;
  }
  return false;
}

/**
 * Check if an IP matches a CIDR block
 * Supports IPv4 CIDR notation (e.g., "192.168.0.0/16")
 */
export function ipMatchesCIDR(ip: string, cidr: string): boolean {
  if (!ip || !cidr) return false;

  // Handle exact IP match
  if (!cidr.includes('/')) return ip === cidr;

  const [cidrIp, prefixStr] = cidr.split('/');
  const prefix = parseInt(prefixStr, 10);
  if (isNaN(prefix) || prefix < 0 || prefix > 32) return false;

  const ipNum = ipToNumber(ip);
  const cidrNum = ipToNumber(cidrIp);
  if (ipNum === null || cidrNum === null) return false;

  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  return (ipNum & mask) === (cidrNum & mask);
}

/**
 * Convert an IPv4 address to a 32-bit number
 */
function ipToNumber(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  let num = 0;
  for (const part of parts) {
    const octet = parseInt(part, 10);
    if (isNaN(octet) || octet < 0 || octet > 255) return null;
    num = (num << 8) + octet;
  }
  return num >>> 0;
}

/**
 * Check if an IP should be blocked based on a list of CIDR rules
 */
export function isBlockedIP(
  ip: string,
  blockedRules: string[]
): boolean {
  for (const rule of blockedRules) {
    if (ipMatchesCIDR(ip, rule)) return true;
  }
  return false;
}

/**
 * Truncate an IPv4 address to the first 2 octets for privacy
 * Example: "192.168.1.42" → "192.168.0.0"
 */
export function truncateIP(ip: string): string {
  const parts = ip.split('.');
  if (parts.length !== 4) return '0.0.0.0';
  return `${parts[0]}.${parts[1]}.0.0`;
}

/**
 * Check if a request is from internal traffic
 * Uses configurable CIDR ranges and header-based detection
 */
export function isInternalTraffic(
  ip: string,
  headers: { get(name: string): string | null },
  config: InternalTrafficConfig
): boolean {
  // Check CIDR ranges
  if (config.blockedCIDRs.length > 0 && isBlockedIP(ip, config.blockedCIDRs)) {
    return true;
  }

  // Check internal header (e.g., set by corporate VPN/proxy)
  if (config.internalHeader) {
    const headerValue = headers.get(config.internalHeader);
    if (headerValue) {
      // If a specific value is expected, match it; otherwise, any value means internal
      if (config.internalHeaderValue) {
        return headerValue === config.internalHeaderValue;
      }
      return true;
    }
  }

  return false;
}

/**
 * Run all traffic filters and return whether the request should be blocked
 */
export function shouldBlockRequest(ctx: FilterContext): {
  blocked: boolean;
  reason?: string;
} {
  // Bot detection
  if (isBot(ctx.userAgent)) {
    return { blocked: true, reason: 'bot' };
  }

  // Webdriver detection
  if (ctx.isWebdriver) {
    return { blocked: true, reason: 'webdriver' };
  }

  // Ignored hostname
  if (isIgnoredHostname(ctx.hostname)) {
    return { blocked: true, reason: 'ignored_hostname' };
  }

  // Zero viewport (headless/bot indicator)
  if (ctx.viewportWidth === 0 && ctx.viewportHeight === 0) {
    return { blocked: true, reason: 'zero_viewport' };
  }

  // Ignore param in URL
  if (ctx.url.includes('claritypulse_ignore=true')) {
    return { blocked: true, reason: 'ignore_param' };
  }

  return { blocked: false };
}

// --- User-Agent Parsing ---

interface DeviceInfo {
  device_type: 'mobile' | 'desktop' | 'tablet' | 'bot';
  os: string;
  os_version: string;
  browser: string;
  browser_version: string;
}

/**
 * Parse User-Agent string into device information
 * Lightweight parser — not a full UA library, covers 95%+ of real traffic
 */
export function parseUserAgent(ua: string): DeviceInfo {
  const result: DeviceInfo = {
    device_type: 'desktop',
    os: 'Unknown',
    os_version: '',
    browser: 'Unknown',
    browser_version: '',
  };

  if (!ua) return result;

  // Bot detection (return early)
  if (isBot(ua)) {
    result.device_type = 'bot';
    return result;
  }

  // --- OS Detection ---
  if (/iPad/.test(ua)) {
    result.device_type = 'tablet';
    result.os = 'iOS';
    const m = ua.match(/OS (\d+[_\.]\d+)/);
    if (m) result.os_version = m[1].replace(/_/g, '.');
  } else if (/iPhone|iPod/.test(ua)) {
    result.device_type = 'mobile';
    result.os = 'iOS';
    const m = ua.match(/OS (\d+[_\.]\d+)/);
    if (m) result.os_version = m[1].replace(/_/g, '.');
  } else if (/Android/.test(ua)) {
    result.os = 'Android';
    const m = ua.match(/Android (\d+[\.\d]*)/);
    if (m) result.os_version = m[1];
    result.device_type = /Mobile/.test(ua) ? 'mobile' : 'tablet';
  } else if (/Windows/.test(ua)) {
    result.os = 'Windows';
    const m = ua.match(/Windows NT (\d+\.\d+)/);
    if (m) {
      const ver = m[1];
      const winVersions: Record<string, string> = {
        '10.0': '10+',
        '6.3': '8.1',
        '6.2': '8',
        '6.1': '7',
      };
      result.os_version = winVersions[ver] || ver;
    }
  } else if (/Mac OS X/.test(ua)) {
    result.os = 'macOS';
    const m = ua.match(/Mac OS X (\d+[_\.]\d+)/);
    if (m) result.os_version = m[1].replace(/_/g, '.');
  } else if (/Linux/.test(ua)) {
    result.os = 'Linux';
  } else if (/CrOS/.test(ua)) {
    result.os = 'Chrome OS';
  }

  // --- Browser Detection (order matters: most specific first) ---
  if (/Edg\//.test(ua)) {
    result.browser = 'Edge';
    const m = ua.match(/Edg\/(\d+[\.\d]*)/);
    if (m) result.browser_version = m[1];
  } else if (/OPR\/|Opera\//.test(ua)) {
    result.browser = 'Opera';
    const m = ua.match(/OPR\/(\d+[\.\d]*)/);
    if (m) result.browser_version = m[1];
  } else if (/Brave/.test(ua)) {
    result.browser = 'Brave';
  } else if (/Vivaldi\//.test(ua)) {
    result.browser = 'Vivaldi';
    const m = ua.match(/Vivaldi\/(\d+[\.\d]*)/);
    if (m) result.browser_version = m[1];
  } else if (/Firefox\//.test(ua)) {
    result.browser = 'Firefox';
    const m = ua.match(/Firefox\/(\d+[\.\d]*)/);
    if (m) result.browser_version = m[1];
  } else if (/SamsungBrowser\//.test(ua)) {
    result.browser = 'Samsung Browser';
    const m = ua.match(/SamsungBrowser\/(\d+[\.\d]*)/);
    if (m) result.browser_version = m[1];
  } else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) {
    result.browser = 'Safari';
    const m = ua.match(/Version\/(\d+[\.\d]*)/);
    if (m) result.browser_version = m[1];
  } else if (/Chrome\//.test(ua)) {
    result.browser = 'Chrome';
    const m = ua.match(/Chrome\/(\d+[\.\d]*)/);
    if (m) result.browser_version = m[1];
  }

  return result;
}

// --- FNV-1a Hash (server-side session hash) ---

/**
 * FNV-1a 32-bit hash for generating session hashes server-side
 * Input: truncated_ip + user_agent + date_iso (e.g., "2025-01-15")
 * This creates a session-level identifier without storing any cookies
 */
export function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}
