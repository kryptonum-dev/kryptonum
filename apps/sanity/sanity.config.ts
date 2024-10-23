import { defineConfig } from 'sanity'
import { structure } from './structure'
import { schemaTypes, singletonActions, singletonTypes } from './structure/schema-types'
import { structureTool } from 'sanity/structure'
import { media } from 'sanity-plugin-media'
import { visionTool } from '@sanity/vision'
import { muxInput } from 'sanity-plugin-mux-input'
import { showProductionUrl } from './utils/show-production-url'

export default defineConfig({
  name: 'default',
  title: 'kryptonum-eu',

  projectId: 'k3p1raj0',
  dataset: 'production',

  plugins: [
    structureTool({ structure }),
    media(),
    visionTool(),
    muxInput(),
    showProductionUrl(),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
