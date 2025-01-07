export { default } from './index.astro';

export type ImageDataProps = {
  asset: {
    url: string
    altText: string
    extension: string
    metadata: {
      dimensions: {
        width: number
        height: number
      }
      lqip: string
    }
  }
}

export const ImageDataQuery = (name: string) => `
  ${name} {
    asset -> {
      url,
      "altText": select(
        $language == "pl" => altTexts.pl,
        $language == "en" => altTexts.en,
        altTexts.pl
      ),
      extension,
      metadata {
        lqip,
        dimensions {
          width,
          height,
        },
      },
    },
  },
`
