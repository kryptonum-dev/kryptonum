import { defineField, type SlugDefinition, type SlugOptions } from "sanity";
import { slugify } from "@repo/utils/slugify";
import { isUniqueSlug } from "./is-unique-slug";
import { LANGUAGES } from "../structure/languages";

const isProduction = process.env.NODE_ENV === 'production';

type LanguageValues = {
  [key in typeof LANGUAGES[number]['id']]: string
}

type DefineSlugConfig = {
  source?: string;
} & (
    | { prefixes: LanguageValues; slugs?: never; slugify?: never; validate?: never }
    | { slugs: LanguageValues; prefixes?: never; slugify?: never; validate?: never }
    | {
      slugify: SlugOptions['slugify'];
      validate?: SlugDefinition['validation'];
      prefixes?: never;
      slugs?: never
    }
  )

export const defineSlugForDocument = ({
  source,
  prefixes,
  slugs,
  slugify: customSlugify,
  validate: customValidate
}: DefineSlugConfig) => [
    ...(source ? [] : [
      defineField({
        name: 'name',
        type: 'string',
        title: 'Name',
        description: 'The name of the document, used for display in the Breadcrumbs.',
        validation: Rule => Rule.required(),
      }),
    ]),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: (
        <>
          Slug is a unique identifier for the document, used for SEO and links.
          {(isProduction && slugs) && <> <strong><em>That slug can&apos;t be changed.</em></strong></>}
        </>
      ),
      readOnly: (isProduction && !!slugs),
      options: {
        source: source || 'name',
        slugify: customSlugify || ((slug, _, context) => {
          const language = (context.parent as { language: typeof LANGUAGES[number]['id'] })?.language ?? 'pl';
          if (slugs) return slugs[language];
          const currentPrefix = prefixes?.[language] ?? '';
          return `${currentPrefix}${slugify(slug)}`;
        }),
        isUnique: isUniqueSlug,
      },
      validation: customValidate || (Rule =>
        Rule.custom(async (value, context) => {
          const language = (context.parent as { language: typeof LANGUAGES[number]['id'] })?.language ?? 'pl';

          if (slugs) {
            if (value?.current !== slugs[language]) {
              return `Slug must be exactly "${slugs[language]}"`;
            }
            return true;
          }

          const currentPrefix = prefixes?.[language] ?? '';
          if (currentPrefix && value?.current && !value.current.startsWith(currentPrefix)) {
            return `Slug should start with ${currentPrefix}`;
          }
          if (value?.current && value.current.replace(currentPrefix, '') !== slugify(value.current.replace(currentPrefix, ''))) {
            return 'There is a typo in the slug. Remember that slug can contain only lowercase letters, numbers and dashes.';
          }
          return true;
        }).required()
      )
    }),
  ]
