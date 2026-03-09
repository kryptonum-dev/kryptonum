import { DOMAIN } from "@repo/shared/constants"

export type Props = {
  email: string
  message?: string
  legal: boolean
  phone?: string
  dropdown?: string
  fullName?: string
  totalFollowers?: string
  socialMediaLinks?: string
  publishedVideos?: string
  exampleVideo?: string
  formId?: string
}

export async function sendContactEmail(data: Props): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${DOMAIN}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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
