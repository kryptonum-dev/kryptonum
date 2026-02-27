import { defineField, defineType } from "sanity";
import { defineSlugForDocument } from "../../utils/define-slug-for-document";
import { languageLabel } from "../../utils/language-label";
import { FolderKanban } from "lucide-react";

const name = "Services_Page";
const title = "Services Hub";

export default defineType({
  name,
  type: "document",
  title,
  icon: FolderKanban,
  options: { documentPreview: true },
  fields: [
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    ...defineSlugForDocument({
      predefinedSlugs: {
        pl: "/pl/uslugi",
        en: "/en/services",
      },
    }),
    defineField({
      name: "img",
      type: "image",
      title: "Featured Image",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "components",
      type: "components",
      title: "Page Components",
    }),
    defineField({
      name: "seo",
      type: "seo",
      title: "SEO",
      group: "seo",
    }),
  ],
  groups: [
    {
      name: "seo",
      title: "SEO",
    },
  ],
  preview: {
    select: {
      language: "language",
    },
    prepare: ({ language }) => ({
      title,
      subtitle: languageLabel(language),
    }),
  },
});
