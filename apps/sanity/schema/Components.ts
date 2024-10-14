import { defineType } from "sanity";

export default defineType({
  name: 'components',
  type: 'array',
  title: 'Components',
  of: [

  ],
  options: {
    insertMenu: {
      filter: true,
      showIcons: true,
      views: [
        { name: 'grid', previewImageUrl: (schemaTypeName) => `/static/${schemaTypeName}.webp` },
        { name: 'list' },
      ]
    }
  }
});
