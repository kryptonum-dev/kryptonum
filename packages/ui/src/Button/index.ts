import { ImageDataQuery } from '@repo/ui/Image';
export type { Props as ButtonDataProps } from './Button.tsx';
export { default } from './Button.astro';

export const ButtonDataQuery = (name: string) => `
  ${name} {
    text,
    theme,
    linkType,
    "documentType": internal -> _type,
    "href": select(
      linkType == "internal" => internal -> slug.current,
      linkType == "external" => external,
      linkType == "anchor" => anchor,
      "#"
    ),
    ${ImageDataQuery('img')}
  },
`
