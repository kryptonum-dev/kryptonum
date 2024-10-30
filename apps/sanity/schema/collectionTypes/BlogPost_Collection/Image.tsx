import { defineField } from "sanity";

const name = 'Image'
const title = 'Image'
const icon = () => '🖼️'

export default defineField({
  name: name,
  type: 'image',
  title: title,
  icon: icon,
  validation: Rule => Rule.required(),
});
