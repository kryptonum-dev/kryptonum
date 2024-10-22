import { defineField, defineType } from "sanity";
import { defineSlugForDocument } from "../ui/define-slug-for-document";

const title = 'Team Members Collection';
const icon = () => <img src="https://emoji.slack-edge.com/T02CFF835B5/krypto-dzik/71c712017db908f1.png" alt="KryptoDzik" style={{
  width: '80%',
  height: '80%',
  margin: '10%',
}} />

export default defineType({
  name: 'TeamMember_Collection',
  type: 'document',
  title,
  icon,
  fields: [
    ...defineSlugForDocument({ prefix: '/pl/zespol/' }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
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
  ],
  preview: {
    select: {
      name: 'name',
      img: 'img',
    },
    prepare: ({ name, img }) => ({
      title: name,
      media: img,
      icon,
    }),
  },
});
