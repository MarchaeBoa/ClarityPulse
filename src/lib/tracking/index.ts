// ClarityPulse Tracking — Public API
export { init, trackPageview, trackEvent, destroy } from './sdk';
export type {
  ClarityPulseConfig,
  PageviewPayload,
  CustomEventPayload,
  EventPayload,
  EnrichedEvent,
} from './types';
