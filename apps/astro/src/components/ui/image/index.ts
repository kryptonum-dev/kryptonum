export { default, type ImageDataProps } from './index.astro';

export const ImageDataQuery = (name: string) => `
  ${name} {
    asset -> {
      url,
      altText,
      extension,
      metadata {
        dimensions {
          width,
          height,
        },
        lqip,
      },
    },
  },
`
