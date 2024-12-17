export { default, type PortableTextValue } from './index.astro';
export { default as Mark } from './Mark.astro';
export { default as Block } from './Block.astro';

/**
 * GROQ query helper for Portable Text fields that ensures proper handling of text formatting
 * and link references. The coalesce() wrapper is crucial here because:
 *
 * 1. When duplicating Sanity documents with formatted text (bold, italic etc.),
 *    the markDefs array sometimes doesn't get properly initialized
 * 2. This causes Astro's Portable Text renderer to throw "Cannot read properties
 *    of null (reading 'find')" error when processing marks like 'strong'
 * 3. By using coalesce(), we ensure markDefs is always an array (falling back
 *    to empty [] if null), preventing the runtime error
 *
 * @param name - The field name in your Sanity schema to query
 * @returns A GROQ query string that safely handles Portable Text fields
 */
export const PortableTextQuery = (name: string) => `
  ${name}[] {
    ...,
    "markDefs": coalesce(markDefs[] {
      ...,
      _type == "link" => {
        _type,
        _key,
        linkType,
        "href": select(linkType == "internal" => internal -> slug.current, linkType == "external" => external, "#"),
      },
    }, []),
  },
`
