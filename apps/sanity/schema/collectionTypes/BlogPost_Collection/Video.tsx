import { defineField } from "sanity";

const name = 'Video'
const title = 'Video'
const icon = () => '🎥'

export default defineField({
  name: name,
  type: 'mux.video',
  title: title,
  icon: icon,
  validation: Rule => Rule.required(),
});
