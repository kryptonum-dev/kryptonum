import type { SlugIsUniqueValidator } from "sanity";

export const isUniqueSlug: SlugIsUniqueValidator = async (slug, { document, getClient }) => {
  const client = getClient({ apiVersion: '2024-09-09' });
  const id = document?._id.replace(/^drafts\./, '');
  const query = `!defined(*[!(_id in [$draft, $published]) && slug.current == $slug][0]._id)`;
  const params = { draft: `drafts.${id}`, published: id, slug };
  const result = await client.fetch<boolean>(query, params);
  return result;
};
