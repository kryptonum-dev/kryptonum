import { ImageDataQuery } from '../image';
export { default } from './index.astro';
export { type Props as ButtonDataProps } from './button';

export const ButtonDataQuery = (name: string) => `
  ${name} {
    text,
    theme,
    linkType,
    "href": select(linkType == "internal" => internal -> slug.current, linkType == "external" => external, "#"),
    ${ImageDataQuery('img')}
  },
`
