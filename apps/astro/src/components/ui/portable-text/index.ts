export { default, type PortableTextValue } from './index.astro';

export const PortableTextQuery = (name: string) => `
  ${name}[] {
    ...,
    markDefs[] {
      _type == "link" => {
        _type,
        _key,
        linkType,
        "href": select(linkType == "internal" => internal -> slug.current, linkType == "external" => external, "#"),
      },
    },
  },
`
