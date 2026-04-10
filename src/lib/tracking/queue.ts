// ============================================================
// ClarityPulse — Server-side Event Queue
//
// Buffers enriched events and flushes them in batches to the
// database. This reduces INSERT overhead and prepares the
// architecture for a Kafka/Redpanda-based pipeline.
//
// MVP: In-memory buffer → batch INSERT to PostgreSQL
// Production: Kafka producer → Worker → ClickHouse COPY
// ============================================================

import type { EnrichedEvent } from './types';

interface QueuedEvent {
  siteId: string;
  event: EnrichedEvent;
  receivedAt: number;
}

type FlushHandler = (events: QueuedEvent[]) => Promise<void>;

// --- Event Queue ---

const buffer: QueuedEvent[] = [];
const MAX_BUFFER_SIZE = 500;
const FLUSH_INTERVAL_MS = 5_000; // 5 seconds
let flushTimer: ReturnType<typeof setInterval> | null = null;
let flushHandler: FlushHandler | null = null;
let isFlushing = false;

/**
 * Initialize the event queue with a flush handler.
 * The handler receives a batch of events and should persist them.
 *
 * MVP example:
 * ```ts
 * initQueue(async (events) => {
 *   await supabase.from('pageviews').insert(
 *     events
 *       .filter(e => e.event.event_type === 'pageview')
 *       .map(e => e.event)
 *   );
 * });
 * ```
 *
 * Production example (Kafka):
 * ```ts
 * initQueue(async (events) => {
 *   await producer.send({
 *     topic: 'analytics-events',
 *     messages: events.map(e => ({
 *       key: e.siteId,
 *       value: JSON.stringify(e.event),
 *     })),
 *   });
 * });
 * ```
 */
export function initQueue(handler: FlushHandler): void {
  flushHandler = handler;

  // Start periodic flush timer
  if (flushTimer) clearInterval(flushTimer);
  flushTimer = setInterval(() => {
    flush().catch(err => {
      if (process.env.NODE_ENV === 'development') {
        console.error('[ClarityPulse Queue] Periodic flush error:', err);
      }
    });
  }, FLUSH_INTERVAL_MS);
}

/**
 * Push an enriched event into the queue.
 * Triggers an immediate flush if the buffer is full.
 */
export function pushEvent(siteId: string, event: EnrichedEvent): void {
  buffer.push({
    siteId,
    event,
    receivedAt: Date.now(),
  });

  if (buffer.length >= MAX_BUFFER_SIZE) {
    flush().catch(err => {
      if (process.env.NODE_ENV === 'development') {
        console.error('[ClarityPulse Queue] Overflow flush error:', err);
      }
    });
  }
}

/**
 * Flush all buffered events to the persistence layer.
 * Safe to call concurrently — uses a lock to prevent double-flush.
 */
export async function flush(): Promise<void> {
  if (isFlushing || buffer.length === 0 || !flushHandler) return;

  isFlushing = true;
  const batch = buffer.splice(0, buffer.length);

  try {
    await flushHandler(batch);
  } catch (error) {
    // Re-queue failed events (with cap to prevent infinite growth)
    if (buffer.length + batch.length <= MAX_BUFFER_SIZE * 2) {
      buffer.unshift(...batch);
    } else if (process.env.NODE_ENV === 'development') {
      console.error(
        `[ClarityPulse Queue] Dropped ${batch.length} events — buffer overflow after flush failure`
      );
    }
  } finally {
    isFlushing = false;
  }
}

/**
 * Destroy the queue: flush remaining events and stop the timer.
 * Call this during graceful shutdown.
 */
export async function destroyQueue(): Promise<void> {
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }

  // Final flush
  if (buffer.length > 0 && flushHandler) {
    isFlushing = false; // Reset lock for final flush
    await flush();
  }

  flushHandler = null;
}

/**
 * Get current queue statistics (for monitoring)
 */
export function getQueueStats(): {
  buffered: number;
  maxSize: number;
  isFlushing: boolean;
} {
  return {
    buffered: buffer.length,
    maxSize: MAX_BUFFER_SIZE,
    isFlushing,
  };
}
