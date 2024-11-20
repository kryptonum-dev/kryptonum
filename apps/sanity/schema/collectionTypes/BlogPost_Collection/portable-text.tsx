import { defineField } from "sanity";
import { InternalLinkableTypes } from "../../../structure/internal-linkable-types";
import { isValidUrl } from "../../../utils/is-valid-url";
import Image from "./Image";
import Video from "./Video";
import Author from "./Author";
import Quote from "./Quote";
import ProsAndCons from "./ProsAndCons";
import DoAndDonts from "./DoAndDonts";
import SimpleCenteredCtaSection from "./SimpleCenteredCtaSection";
import LargeAdvantagesCta from "./LargeAdvantagesCta";
import ImageCta from "./ImageCta";
import ListWithIcon from "./ListWithIcon";
import NumberedStepsList from "./NumberedStepsList";
import Faq from "../../components/Faq";

export default defineField({
  name: 'content',
  type: 'array',
  title: 'Content',
  of: [
    defineField({
      type: 'block',
      name: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        {
          title: 'Heading 2',
          value: 'h2',
          component: ({ children }) => <h2 style={{ fontSize: '1.875rem', fontWeight: 400, margin: 0 }}>{children}</h2>
        },
        {
          title: 'Heading 3',
          value: 'h3',
          component: ({ children }) => <h3 style={{ fontSize: '1.5rem', fontWeight: 400, margin: 0 }}>{children}</h3>
        },
        {
          title: 'Heading 4',
          value: 'h4',
          component: ({ children }) => <h3 style={{ fontSize: '1.375rem', fontWeight: 400, margin: 0 }}>{children}</h3>
        }
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' }
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong', component: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong> },
          { title: 'Emphasis', value: 'em' }
        ],
        annotations: [
          defineField({
            name: 'link',
            type: 'object',
            title: 'Link',
            icon: () => '🔗',
            fields: [
              defineField({
                name: 'linkType',
                type: 'string',
                title: 'Type',
                description: 'Choose "External" for links to websites outside your domain, or "Internal" for links to pages within your site.',
                options: {
                  list: ['external', 'internal'],
                  layout: 'radio',
                  direction: 'horizontal',
                },
                initialValue: 'external',
              }),
              defineField({
                name: 'external',
                type: 'string',
                title: 'URL',
                description: 'Specify the full URL. Ensure it starts with "https://", "mailto:" or "tel:" protocol.',
                hidden: ({ parent }) => parent?.linkType !== 'external',
                validation: (Rule) => [
                  Rule.custom((value, { parent }) => {
                    const linkType = (parent as { linkType?: string })?.linkType;
                    if (linkType === 'external') {
                      if (!value) return "URL is required";
                      if (!value.startsWith('https://') && !value.startsWith('mailto:') && !value.startsWith('tel:')) {
                        return 'External link must start with the "https://", "mailto:" or "tel:" protocol';
                      }
                      if (!isValidUrl(value)) return 'Invalid URL';
                    }
                    return true;
                  }),
                ],
              }),
              defineField({
                name: 'internal',
                type: 'reference',
                title: 'Internal reference to page',
                description: 'Select an internal page to link to.',
                to: InternalLinkableTypes,
                options: {
                  disableNew: true,
                  filter: 'defined(slug.current)',
                },
                hidden: ({ parent }) => parent?.linkType !== 'internal',
                validation: (rule) => [
                  rule.custom((value, { parent }) => {
                    const linkType = (parent as { linkType?: string })?.linkType;
                    if (linkType === 'internal' && !value?._ref) return "You have to choose internal page to link to.";
                    return true;
                  }),
                ],
              }),
            ]
          }),
        ]
      }
    }),
    Image,
    Video,
    Author,
    Quote,
    ProsAndCons,
    DoAndDonts,
    SimpleCenteredCtaSection,
    LargeAdvantagesCta,
    ImageCta,
    ListWithIcon,
    NumberedStepsList,

    // From the main page builder sections
    Faq,
  ],
  validation: Rule => Rule.required(),
});
