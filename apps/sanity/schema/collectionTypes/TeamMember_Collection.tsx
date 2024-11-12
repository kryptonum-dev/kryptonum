import { defineField, defineType } from "sanity";
import { defineSlugForDocument } from "../../utils/define-slug-for-document";

const name = 'TeamMember_Collection';
const title = 'Team Member Collection';
const icon = () => <img src="https://emoji.slack-edge.com/T02CFF835B5/krypto-dzik/71c712017db908f1.png" alt="KryptoDzik" style={{
  width: '80%',
  height: '80%',
  margin: '10%',
}} />

export default defineType({
  name: name,
  type: 'document',
  title,
  icon,
  options: { documentPreview: true },
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: Rule => Rule.required(),
    }),
    ...defineSlugForDocument({ source: 'name', prefix: '/pl/zespol/' }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'headline',
      type: 'string',
      title: 'Headline',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'formalHeadline',
      type: 'string',
      title: 'Formal Headline',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email address',
      validation: Rule => Rule.required().email(),
    }),
    defineField({
      name: 'tel',
      type: 'string',
      title: 'Phone number (optional)',
    }),
    defineField({
      name: 'components',
      type: 'components',
      title: 'Page Components',
      description: 'Those components will be displayed after the content of the blog post.',
      validation: Rule => Rule.required(),
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
      name: 'name',
      slug: 'slug.current',
      img: 'img',
    },
    prepare: ({ name, slug, img, }) => ({
      title: name,
      subtitle: slug,
      media: img,
      icon,
    }),
  },
});
