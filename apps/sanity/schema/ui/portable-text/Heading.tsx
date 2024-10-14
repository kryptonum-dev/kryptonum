import { defineArrayMember, defineType } from "sanity";
import { CustomInput } from "./CustomInput";

export default defineType({
  name: 'Heading',
  type: 'array',
  title: 'Heading',
  components: {
    // @ts-ignore
    input: CustomInput
  },
  of: [defineArrayMember({
    type: 'block',
    styles: [{ title: 'Normal', value: 'normal' }],
    lists: [],
    marks: {
      annotations: [],
      decorators: [
        { title: 'Strong', value: 'strong' },
      ],
    }
  })],
});
