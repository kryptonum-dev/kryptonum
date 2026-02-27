import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})
const redirectsPath = path.resolve(process.cwd(), '../../redirects.json')

function normalizePath(value) {
  if (!value) return ''
  let v = String(value).trim()
  if (!v.startsWith('/')) {
    try {
      v = new URL(v).pathname
    } catch {
      return ''
    }
  }
  v = v.replace(/\/+$/, '')
  return v || '/'
}

function toRedirectArray(items) {
  if (!Array.isArray(items)) return []
  return items
    .map((item) => {
      const source = normalizePath(item?.source)
      const destination = normalizePath(item?.destination)
      if (!source || !destination || source === destination) return null
      return {
        _key: crypto.randomUUID(),
        source: {current: source},
        destination: {current: destination},
        isPermanent: item?.isPermanent !== false,
      }
    })
    .filter(Boolean)
}

async function run() {
  const raw = fs.readFileSync(redirectsPath, 'utf8')
  const parsed = JSON.parse(raw)

  const mainRedirects = toRedirectArray(parsed.mainRedirects)
  const learnRedirects = toRedirectArray(parsed.learnRedirects)

  await client.createIfNotExists({_id: 'redirects', _type: 'redirects'})
  await client
    .patch('redirects')
    .set({mainRedirects, learnRedirects})
    .commit({autoGenerateArrayKeys: false})

  await client.createIfNotExists({_id: 'drafts.redirects', _type: 'redirects'})
  await client
    .patch('drafts.redirects')
    .set({mainRedirects, learnRedirects})
    .commit({autoGenerateArrayKeys: false})

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        updated: ['redirects', 'drafts.redirects'],
        counts: {
          mainRedirects: mainRedirects.length,
          learnRedirects: learnRedirects.length,
        },
      },
      null,
      2,
    ),
  )
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error)
  process.exit(1)
})
