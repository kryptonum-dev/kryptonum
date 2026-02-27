import { defineConfig } from 'sanity'
import { visionTool } from '@sanity/vision'
import { assist } from '@sanity/assist'
import { documentInternationalization } from '@sanity/document-internationalization'
import { structureTool } from 'sanity/structure'
import { media } from 'sanity-plugin-media-i18n'
import { muxInput } from 'sanity-plugin-mux-input'
import { structure } from './structure'
import { i18nTypes, schemaTypes, singletonActions, singletonTypes } from './structure/schema-types'
import { LANGUAGES } from './structure/languages'
import { Logo } from './components/logo'

const isStaging = process.env.SANITY_STUDIO_HOST === 'kryptonum-staging';

export default defineConfig({
  name: isStaging ? 'staging' : 'default',
  title: isStaging ? 'Kryptonum (Staging)' : 'Kryptonum',
  icon: Logo,

  projectId: 'k3p1raj0',
  dataset: 'production',

  plugins: [
    structureTool({ structure }),
    media({
      locales: LANGUAGES.map(({ id, title }) => ({ id: id, name: title })),
    }),
    visionTool(),
    muxInput(),
    documentInternationalization({
      supportedLanguages: LANGUAGES,
      schemaTypes: i18nTypes,
    }),
    assist({
      translate: {
        document: {
          languageField: 'language',
        }
      }
    }),
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
