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
    `*[defined(components[_type == "ContactForm" && _key == $formId])]{
      "cfg": components[_type == "ContactForm" && _key == $formId][0]{
        recipientEmail,
        recipientBcc,
        notionDatabaseId,
        slackWebhookUrl
      }
    }.cfg[0]`,
    { formId },
  )

  const config = result ?? {}
  configCache.set(formId, { data: config, ts: Date.now() })
  return config
}
