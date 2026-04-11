// ============================================================
// ClarityPulse — Tracking Database Persistence
//
// Flush handler for the event queue. Receives batched events
// and inserts them into the pageviews and custom_events tables
// via the Supabase service_role client (bypasses RLS).
//
// Architecture:
//   pushEvent() -> queue buffer -> flush() -> this handler -> PostgreSQL
// ============================================================

import { getAdminClient } from '@/lib/supabase/admin';
import { initQueue } from './queue';
import type { EnrichedEvent } from './types';

interface QueuedEvent {
  siteId: string;
  event: EnrichedEvent;
  receivedAt: number;
}

/** Row shape for the `pageviews` table */
interface PageviewRow {
  site_id: string;
  session_hash: number;
  page_url: string;
  page_path: string;
  page_query: string | null;
  referrer: string | null;
  referrer_domain: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  country_code: string | null;
  region: string | null;
  city: string | null;
  device_type: string | null;
  os: string | null;
  os_version: string | null;
  browser: string | null;
  browser_version: string | null;
  viewport_width: number | null;
  viewport_height: number | null;
  duration_sec: number | null;
  is_entry: boolean;
  is_exit: boolean | null;
  is_bounce: boolean | null;
  occurred_at: string;
}

/** Row shape for the `custom_events` table */
interface CustomEventRow {
  site_id: string;
  session_hash: number;
  event_name: string;
  page_url: string;
  page_path: string;
  properties: Record<string, string | number | boolean> | null;
  country_code: string | null;
  device_type: string | null;
  occurred_at: string;
}

/** Row shape for the `page_leaves` table */
interface PageLeaveRow {
  site_id: string;
  session_hash: number;
  page_path: string;
  engagement_time: number;
  scroll_depth: number;
  country_code: string | null;
  device_type: string | null;
  occurred_at: string;
}

/**
 * Convert an EnrichedEvent into a pageview row
 */
function toPageviewRow(event: EnrichedEvent): PageviewRow {
  return {
    site_id: event.site_id,
    session_hash: event.session_hash,
    page_url: event.page_url,
    page_path: event.page_path,
    page_query: event.page_query ?? null,
    referrer: event.referrer ?? null,
    referrer_domain: event.referrer_domain ?? null,
    utm_source: event.utm_source ?? null,
    utm_medium: event.utm_medium ?? null,
    utm_campaign: event.utm_campaign ?? null,
    utm_content: event.utm_content ?? null,
    utm_term: event.utm_term ?? null,
    country_code: event.country_code ?? null,
    region: event.region ?? null,
    city: event.city ?? null,
    device_type: event.device_type ?? null,
    os: event.os ?? null,
    os_version: event.os_version ?? null,
    browser: event.browser ?? null,
    browser_version: event.browser_version ?? null,
    viewport_width: event.viewport_width ?? null,
    viewport_height: event.viewport_height ?? null,
    duration_sec: event.engagement_time ?? null,
    is_entry: event.is_entry,
    is_exit: null,
    is_bounce: null,
    occurred_at: event.occurred_at,
  };
}

/**
 * Convert an EnrichedEvent into a custom_events row
 */
function toCustomEventRow(event: EnrichedEvent): CustomEventRow {
  return {
    site_id: event.site_id,
    session_hash: event.session_hash,
    event_name: event.event_name ?? 'unknown',
    page_url: event.page_url,
    page_path: event.page_path,
    properties: event.properties ?? null,
    country_code: event.country_code ?? null,
    device_type: event.device_type ?? null,
    occurred_at: event.occurred_at,
  };
}

/**
 * Convert an EnrichedEvent (page_leave) into a page_leaves row
 */
function toPageLeaveRow(event: EnrichedEvent): PageLeaveRow {
  return {
    site_id: event.site_id,
    session_hash: event.session_hash,
    page_path: event.page_path,
    engagement_time: event.engagement_time ?? 0,
    scroll_depth: event.scroll_depth ?? 0,
    country_code: event.country_code ?? null,
    device_type: event.device_type ?? null,
    occurred_at: event.occurred_at,
  };
}

/**
 * Flush handler — persists a batch of events to the database.
 * Separates events by type and does batch INSERTs into their
 * respective partitioned tables.
 */
async function flushToDatabase(events: QueuedEvent[]): Promise<void> {
  const supabase = getAdminClient();

  const pageviewRows: PageviewRow[] = [];
  const customEventRows: CustomEventRow[] = [];
  const pageLeaveRows: PageLeaveRow[] = [];

  for (const { event } of events) {
    switch (event.event_type) {
      case 'pageview':
        pageviewRows.push(toPageviewRow(event));
        break;
      case 'custom_event':
        customEventRows.push(toCustomEventRow(event));
        break;
      case 'page_leave':
        pageLeaveRows.push(toPageLeaveRow(event));
        break;
    }
  }

  const errors: string[] = [];

  // Batch insert pageviews
  if (pageviewRows.length > 0) {
    const { error } = await supabase.from('pageviews').insert(pageviewRows);
    if (error) {
      errors.push(`pageviews: ${error.message}`);
    }
  }

  // Batch insert custom events
  if (customEventRows.length > 0) {
    const { error } = await supabase.from('custom_events').insert(customEventRows);
    if (error) {
      errors.push(`custom_events: ${error.message}`);
    }
  }

  // Batch insert page leaves
  if (pageLeaveRows.length > 0) {
    const { error } = await supabase.from('page_leaves').insert(pageLeaveRows);
    if (error) {
      errors.push(`page_leaves: ${error.message}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`[ClarityPulse DB] Flush errors: ${errors.join('; ')}`);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(
      `[ClarityPulse DB] Flushed ${pageviewRows.length} pageviews, ` +
      `${customEventRows.length} custom_events, ${pageLeaveRows.length} page_leaves`
    );
  }
}

// --- Initialization flag ---
let initialized = false;

/**
 * Initialize the tracking database persistence layer.
 * Registers the flush handler with the event queue.
 * Safe to call multiple times — only initializes once.
 */
export function initTrackingDB(): void {
  if (initialized) return;
  initialized = true;
  initQueue(flushToDatabase);

  if (process.env.NODE_ENV === 'development') {
    console.log('[ClarityPulse DB] Tracking persistence initialized');
  }
}
