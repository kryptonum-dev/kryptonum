import { client } from './sanity.fetch'

export type FormIntegrationConfig = {
  recipientEmail?: string
  recipientBcc?: string[]
  notionDatabaseId?: string
  slackWebhookUrl?: string
}

const configCache = new Map<string, { data: FormIntegrationConfig; ts: number }>()
const CACHE_TTL_MS = 60_000

export async function getFormIntegrationConfig(formId: string): Promise<FormIntegrationConfig> {
  const cached = configCache.get(formId)
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.data

  const result = await client.fetch<FormIntegrationConfig | null>(
    `*[count(components[_type == "ContactForm" && _key == $formId]) > 0][0]
      .components[_type == "ContactForm" && _key == $formId][0]{
        recipientEmail,
        recipientBcc,
        notionDatabaseId,
        slackWebhookUrl
      }`,
    { formId },
  )

  console.log(`[FormConfig] formId=${formId}, result:`, JSON.stringify(result))

  const config = result ?? {}
  configCache.set(formId, { data: config, ts: Date.now() })
  return config
}
