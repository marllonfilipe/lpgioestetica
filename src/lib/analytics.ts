export type TrackingPayload = Record<string, string | number | boolean>;

export function trackEvent(event: string, payload: TrackingPayload = {}) {
  if (typeof window === "undefined") return;

  const target = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
  };

  target.dataLayer = target.dataLayer ?? [];
  target.dataLayer.push({ event, ...payload });
}
