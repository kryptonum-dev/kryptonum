import { DOMAIN } from "@repo/shared/constants"

export type Props = {
  email: string
  name: string
  groupId: string
  legal: boolean
}

export async function subscribeToNewsletter({ email, name, groupId, legal }: Props): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${DOMAIN}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, groupId, legal }),
    });
    
    if (!response.ok) {
      return { success: false };
    }
    
    return await response.json();
  } catch (error) {
    // Catch network errors, CORS errors, and JSON parsing errors
    console.error('Newsletter subscription error:', error);
    return { success: false };
  }
}
