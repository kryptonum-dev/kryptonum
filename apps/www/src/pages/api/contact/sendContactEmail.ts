import { DOMAIN } from "@repo/shared/constants"

export type Props = {
  email: string
  message: string
  legal: boolean
  turnstileToken?: string
}

export async function sendContactEmail({ email, message, legal, turnstileToken }: Props): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${DOMAIN}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, message, legal, turnstileToken }),
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
