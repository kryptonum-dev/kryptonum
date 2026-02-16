import { DOMAIN } from "@repo/shared/constants"
import { getUtmForSheet } from "@repo/shared/analytics/utm-storage"

export type Props = {
  email: string
  message: string
  legal: boolean
  turnstileToken?: string
}

export async function sendContactEmail({ email, message, legal, turnstileToken }: Props): Promise<{ success: boolean }> {
  try {
    // Get UTM data from cookie storage (client-side only)
    const utm = typeof window !== 'undefined' ? getUtmForSheet() : ''

    const response = await fetch(`${DOMAIN}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, message, legal, turnstileToken, utm }),
    });
    
    if (!response.ok) {
      return { success: false };
    }
    
    return await response.json();
  } catch (error) {
    // Catch network errors, CORS errors, and JSON parsing errors
    console.error('Contact form submission error:', error);
    return { success: false };
  }
}
