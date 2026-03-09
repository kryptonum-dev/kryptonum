import type { ContactLeadData } from './notion'

type SlackBlock =
  | { type: 'header'; text: { type: 'plain_text'; text: string } }
  | { type: 'section'; text: { type: 'mrkdwn'; text: string } }
  | { type: 'divider' }

function buildSlackBlocks(data: ContactLeadData): SlackBlock[] {
  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: { type: 'plain_text', text: data.fullName ? `Nowe zgłoszenie: ${data.fullName}` : `Nowy lead: ${data.email}` },
    },
    { type: 'divider' },
  ]

  const fields: string[] = []
  if (data.fullName) fields.push(`*Imię i nazwisko:* ${data.fullName}`)
  fields.push(`*Email:* ${data.email}`)
  if (data.phone) fields.push(`*Telefon:* ${data.phone}`)
  if (data.totalFollowers) fields.push(`*Obserwujący:* ${data.totalFollowers}`)
  if (data.publishedVideos) fields.push(`*Opublikowane wideo:* ${data.publishedVideos}`)
  if (data.exampleVideo) fields.push(`*Przykładowy film:* <${data.exampleVideo}|Link>`)
  if (data.dropdown) fields.push(`*Branża:* ${data.dropdown}`)
  if (data.source) fields.push(`*Źródło:* ${data.source}`)

  blocks.push({
    type: 'section',
    text: { type: 'mrkdwn', text: fields.join('\n') },
  })

  if (data.socialMediaLinks) {
    blocks.push({ type: 'divider' })
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*Social media:*\n${data.socialMediaLinks}` },
    })
  }

  if (data.message) {
    blocks.push({ type: 'divider' })
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*Wiadomość:*\n${data.message}` },
    })
  }

  return blocks
}

export async function sendSlackNotification(webhookUrl: string, data: ContactLeadData): Promise<void> {
  const blocks = buildSlackBlocks(data)
  const fallbackText = data.fullName
    ? `Nowe zgłoszenie od ${data.fullName} (${data.email})`
    : `Nowy lead: ${data.email}`

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: fallbackText, blocks }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Slack webhook failed (${response.status}): ${errorText}`)
  }
}
