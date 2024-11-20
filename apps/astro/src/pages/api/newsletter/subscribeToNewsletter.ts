export type Props = {
  email: string
  name: string
  groupId: string
  legal: boolean
}

export async function subscribeToNewsletter({ email, name, groupId, legal }: Props): Promise<{ success: boolean }> {
  const response = await fetch('/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, groupId, legal }),
  });
  return await response.json();
}
