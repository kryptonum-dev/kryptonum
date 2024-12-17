export type Props = {
  email: string
  message: string
  legal: boolean
}

export async function sendContactEmail({ email, message, legal }: Props): Promise<{ success: boolean }> {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, message, legal }),
  });
  return await response.json();
}
