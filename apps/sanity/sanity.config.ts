import { defineConfig } from 'sanity'
import { structure } from './structure'
import { i18nTypes, schemaTypes, singletonActions, singletonTypes } from './structure/schema-types'
import { structureTool } from 'sanity/structure'
import { media } from 'sanity-plugin-media'
import { visionTool } from '@sanity/vision'
import { muxInput } from 'sanity-plugin-mux-input'
import { documentInternationalization } from '@sanity/document-internationalization'
import { LANGUAGES } from './structure/languages'

export default defineConfig({
  name: 'default',
  title: 'Kryptonum',

  projectId: 'k3p1raj0',
  dataset: 'production',

  plugins: [
    structureTool({ structure }),
    media(),
    visionTool(),
    muxInput(),
    documentInternationalization({
      supportedLanguages: LANGUAGES,
      schemaTypes: i18nTypes,
    })
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
