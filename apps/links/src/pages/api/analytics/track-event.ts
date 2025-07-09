import type { Props as MetaConversionProps } from './meta-conversion'

function getCookie(name: string) {
  const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.substring(name.length + 1)) : null;
}

type Props = {
  user_data?: {
    email?: string;
  };
  meta?: {
    event_name: string;
    content_name?: string;
    params?: Record<string, any>;
  };
  ga?: {
    event_name: string;
    params: Record<string, any>;
  };
}

/**
 * Tracks analytics events for Meta and Google Analytics platforms
 *
 * This function handles client-side tracking for Meta (fbq) and Google Analytics (gtag)
 * as well as server-side conversion API tracking for Meta. It generates a unique event ID
 * and handles user data appropriately for each platform.
 *
 * @param {Object} params - The tracking parameters
 * @param {Object} [params.user_data] - Optional user data for personalized tracking
 * @param {string} [params.user_data.email] - User's email address
 * @param {Object} [params.meta] - Meta (Facebook) tracking configuration
 * @param {string} params.meta.event_name - Name of the event to track in Meta
 * @param {string} [params.meta.content_name] - Optional name of the content associated with the event
 * @param {Object} [params.meta.params] - Additional parameters for Meta events (e.g. currency, value for Purchase events)
 * @param {Object} [params.ga] - Google Analytics tracking configuration
 * @param {string} params.ga.event_name - Name of the event to track in GA
 * @param {Object} params.ga.params - Parameters to pass directly to gtag
 */
export async function trackEvent({
  user_data,
  meta,
  ga
}: Props) {
  const event_time = {
    milliseconds: Date.now(),
    seconds: Math.floor(Date.now() / 1000)
  };
  const event_id = `${event_time.milliseconds}${Math.random().toString(36).substring(2, 15)}`;
  const url = window.location.href;

  // Check for cookie consent before tracking
  if (!getCookie('cookie-consent')) {
    document.addEventListener('cookie_consent_updated', function consentHandler() {
      document.removeEventListener('cookie_consent_updated', consentHandler);
      trackEvent({ user_data, meta, ga });
    });
    return;
  }

  if (meta) {
    try {
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', meta.event_name, {
          ...(meta?.content_name && { content_name: meta.content_name }),
          ...(meta?.params || {}),
        }, { eventID: event_id });
      }
    } catch {
      console.warn('Failed to track client-side fbq function');
    }

    try {
      const payload: MetaConversionProps = {
        event_name: meta.event_name,
        ...(meta?.content_name && { content_name: meta.content_name }),
        url,
        event_id,
        event_time: event_time.seconds,
        email: user_data?.email,
        ...(meta?.params && { custom_event_params: meta.params })
      };

      const response = await fetch('/api/analytics/meta-conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) console.warn('Meta conversion event failed: Unable to process conversion event');
    } catch {
      console.warn('Failed to send Meta conversion event');
    }
  }

  if (ga && typeof window.gtag !== 'undefined') {
    try {
      window.gtag('event', ga.event_name, ga.params || {});
    } catch {
      console.warn(`Failed to track GA4 event "${ga.event_name}"`);
    }
  }
}

if (typeof window !== 'undefined') {
  window.trackEvent = trackEvent;
}

declare global {
  interface Window {
    fbq: (method: string, ...args: any[]) => void;
    gtag: (command: string, ...args: any[]) => void;
    trackEvent: typeof trackEvent;
  }
}
