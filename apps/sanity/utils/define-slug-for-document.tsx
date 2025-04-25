import { defineField, type SlugDefinition, type SlugOptions } from "sanity";
import { slugify } from "@repo/utils/slugify";
import { isUniqueSlug } from "./is-unique-slug";
import { LANGUAGES } from "../structure/languages";

const isProduction = process.env.NODE_ENV === 'production';

/** Language codes to string values mapping */
type LanguageValues = {
  [key in typeof LANGUAGES[number]['id']]: string
}

type DefineSlugConfig = {
  sourceField?: string;
  description?: React.ReactNode;
} & (
    | { prefixes: LanguageValues; predefinedSlugs?: never; slugify?: never; validate?: never }
    | { predefinedSlugs: LanguageValues; prefixes?: never; slugify?: never; validate?: never }
    | {
      slugify: SlugOptions['slugify'];
      validate?: SlugDefinition['validation'];
      prefixes?: never;
      predefinedSlugs?: never
    }
  )

export const defineSlugForDocument = ({
  sourceField,
  prefixes,
  predefinedSlugs,
  slugify: customSlugify,
  validate: customValidate,
  description,
}: DefineSlugConfig) => [
    ...(sourceField ? [] : [
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
          {(isProduction && predefinedSlugs) && <> <strong><em>That slug can&apos;t be changed.</em></strong></>}
          {description}
        </>
      ),
      readOnly: (isProduction && !!predefinedSlugs),
      options: {
        source: sourceField || 'name',
        slugify: customSlugify
          || ((slug, _, context) => {
            const language = (context.parent as { language: typeof LANGUAGES[number]['id'] })?.language ?? 'pl';
            if (predefinedSlugs) return predefinedSlugs[language];
            const currentPrefix = prefixes?.[language] ?? '';
            return `${currentPrefix}${slugify(slug)}`;
          }),
        isUnique: isUniqueSlug,
      },
      validation: customValidate
        || (Rule =>
          Rule.custom(async (value, context) => {
            const language = (context.parent as { language: typeof LANGUAGES[number]['id'] })?.language ?? 'pl';

            if (predefinedSlugs) {
              if (value?.current !== predefinedSlugs[language]) {
                return `Slug must be exactly "${predefinedSlugs[language]}"`;
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
