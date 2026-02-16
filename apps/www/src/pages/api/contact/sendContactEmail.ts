import { DOMAIN } from "@repo/shared/constants"

export type Props = {
  email: string
  message: string
  legal: boolean
}

export async function sendContactEmail({ email, message, legal }: Props): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${DOMAIN}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, message, legal }),
    });
    
    if (!response.ok) {
      return { success: false };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Contact form submission error:', error);
    return { success: false };
  }
}
