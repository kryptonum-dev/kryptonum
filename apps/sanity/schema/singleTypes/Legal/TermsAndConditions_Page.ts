import { defineField, defineType } from "sanity"
import { defineSlugForDocument } from "../../../utils/define-slug-for-document";
import SimpleHeaderWithImage from "../../components/SimpleHeaderWithImage";
import HeaderGridIcons from "../../components/HeaderGridIcons";
import PortableText from "./portable-text";

const name = 'TermsAndConditions_Page';
const title = 'Terms and Conditions';
const slug = '/pl/regulamin';
const icon = () => '📑'

export default defineType({
  name: name,
  type: 'document',
  title: title,
  icon: icon,
  options: { documentPreview: true },
  fields: [
    ...defineSlugForDocument({ slug: slug }),
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
    prepare: () => ({
      title: title,
      subtitle: slug
    })
  }
});
