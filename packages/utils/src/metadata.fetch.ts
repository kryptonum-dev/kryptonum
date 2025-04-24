import sanityFetch from "./sanity.fetch";
import type { Language } from "@repo/shared/languages";

type MetadataProps = ({ path: string; url?: never } | { url: string; path?: never }) & {
  title: string
  description: string
  openGraphImage?: string
  alternates?: Array<{ lang: Language; url: string }>
}

export default async function metadataFetch(slug: string) {
  const seo = await sanityFetch<MetadataProps>({
    query: /* groq */ `
      *[slug.current == $slug][0] {
        "path": slug.current,
        "title": seo.title,
        "description": seo.description,
        "openGraphImage": seo.img.asset -> url + "?w=1200",
        "alternates": select(
          _type == 'NotFound_Page' => [],
          coalesce(
            *[_type == 'translation.metadata' && references(^._id)][0] {
              "urls": translations[] {
                "lang": _key,
                "url": *[_id == ^.value._ref][0].slug.current
              }
            }.urls,
            []
          )
        ),
      }
    `,
    params: { slug: slug }
  })
  if (!seo?.path) throw new Error(`Missing required field \`path\` for slug \`${slug}\``);
  if (!seo?.title) throw new Error(`Missing required field \`title\` for slug \`${slug}\``);
  if (!seo?.description) throw new Error(`Missing required field \`description\` for slug \`${slug}\``);
  return seo;
}
