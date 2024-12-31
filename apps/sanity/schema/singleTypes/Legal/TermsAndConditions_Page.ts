import { defineField, defineType } from "sanity"
import { defineSlugForDocument } from "../../../utils/define-slug-for-document";
import SimpleHeaderWithImage from "../../components/SimpleHeaderWithImage";
import HeaderGridIcons from "../../components/HeaderGridIcons";
import PortableText from "./portable-text";
import { languageLabel } from "../../../utils/language-label";

const name = 'TermsAndConditions_Page';
const title = 'Terms and Conditions';
const icon = () => '📑'

export default defineType({
  name: name,
  type: 'document',
  title: title,
  icon: icon,
  options: { documentPreview: true },
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    ...defineSlugForDocument({
      slugs: {
        pl: '/pl/regulamin',
        en: '/en/terms'
      }
    }),
    SimpleHeaderWithImage,
    HeaderGridIcons,
    PortableText,
    defineField({
      name: 'components',
      type: 'components',
      title: 'Page Components',
    }),
    defineField({
      name: 'seo',
      type: 'seo',
      title: 'SEO',
      group: 'seo',
    }),
  ],
  groups: [
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  preview: {
    select: {
      language: 'language',
    },
    prepare: ({ language }) => ({
      title: title,
      subtitle: languageLabel(language),
    })
  }
});
