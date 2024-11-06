import { ImageDataQuery } from '../image';
export { default } from './Button.astro';
export { type Props as ButtonDataProps } from './Button';

export const ButtonDataQuery = (name: string) => `
  ${name} {
    text,
    theme,
    linkType,
    "href": select(linkType == "internal" => internal -> slug.current, linkType == "external" => external, "#"),
    ${ImageDataQuery('img')}
  },
`
