export type TrackingPayload = Record<string, string | number | boolean>;

export function trackEvent(event: string, payload: TrackingPayload = {}) {
  if (typeof window === "undefined") return;

  const target = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  };

  target.dataLayer = target.dataLayer ?? [];
  target.dataLayer.push({ event, ...payload });
  target.gtag?.("event", event, payload);
  target.fbq?.("trackCustom", event, payload);
}

export function trackGoogleAdsConversion(sendTo: string, payload: TrackingPayload = {}) {
  if (typeof window === "undefined") return;

  const target = window as Window & {
    gtag?: (...args: unknown[]) => void;
  };

  target.gtag?.("event", "conversion", {
    send_to: sendTo,
    ...payload,
  });
}
