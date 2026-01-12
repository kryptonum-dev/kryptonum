import { DOMAIN } from "@repo/shared/constants"

export type Props = {
  email: string
  message: string
  legal: boolean
  turnstileToken?: string
}

export async function sendContactEmail({ email, message, legal, turnstileToken }: Props): Promise<{ success: boolean }> {
  const response = await fetch(`${DOMAIN}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, message, legal, turnstileToken }),
  });
  return await response.json();
}
