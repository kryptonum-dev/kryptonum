import { defineField, defineType } from "sanity";
import { languageLabel } from "../../utils/language-label";
import { PanelTop } from "lucide-react";

export default defineType({
  name: "navbar",
  type: "document",
  title: "Navigation",
  icon: PanelTop,
  fields: [
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "annotation",
      type: "object",
      title: "Annotation",
      fields: [
        defineField({
          name: "icon",
          type: "image",
          title: "Icon (optional)",
          description: "Only SVG files are supported.",
          options: {
            accept: ".svg",
          },
        }),
        defineField({
          name: "text",
          type: "string",
          title: "Text",
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: "link",
          type: "object",
          title: "Link (optional)",
          fields: [
            defineField({
              name: "text",
              type: "string",
              title: "Text",
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: "url",
              type: "url",
              title: "URL",
              validation: Rule => Rule.required().uri({ scheme: ["https"] }),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "cta",
      type: "cta",
      title: "Call to Action",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "caseStudies",
      type: "array",
      title: "Case Studies",
      description: "If empty, we display latest 8 case studies from portfolio.",
      of: [{
        type: "reference",
        to: [{ type: "CaseStudy_Collection" }],
        options: {
          disableNew: true,
          filter: ({ parent }) => {
            const selectedIds = (parent as { _ref?: string }[])?.filter(item => item._ref).map(item => item._ref) || [];
            if (selectedIds.length > 0) {
              return {
                filter: "!(_id in $selectedIds) && !(_id in path(\"drafts.**\"))",
                params: { selectedIds },
              };
            }
            return {};
          },
        },
      }],
      validation: Rule => [
        Rule.max(8).warning("We recommend max 8 case studies in navigation."),
        Rule.unique(),
      ],
    }),
    defineField({
      name: "pillars",
      type: "array",
      title: "Pillar Services (Dropdown)",
      description: "Select 1-4 pillar services to show in header services dropdown.",
      of: [{
        type: "reference",
        to: [{ type: "Service_Collection" }],
        options: {
          disableNew: true,
          filter: ({ document, parent }) => {
            const language = (document as { language?: string })?.language;
            const selectedIds = (parent as { _ref?: string }[])?.filter(item => item._ref).map(item => item._ref) || [];
            if (selectedIds.length > 0) {
              return {
                filter: "language == $lang && coalesce(isArchived, false) != true && !(_id in $selectedIds) && !(_id in path(\"drafts.**\"))",
                params: { lang: language, selectedIds },
              };
            }
            return {
              filter: "language == $lang && coalesce(isArchived, false) != true && !(_id in path(\"drafts.**\"))",
              params: { lang: language },
            };
          },
        },
      }],
      validation: Rule => [
        Rule.required(),
        Rule.min(1).max(4).error("You must select between 1 and 4 pillar services."),
        Rule.unique(),
      ],
    }),
    defineField({
      name: "servicesHubCta",
      type: "cta",
      title: "Services Hub CTA",
      description: "Button shown in services dropdown preview panel (typically links to /uslugi hub).",
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      language: "language",
    },
    prepare: ({ language }) => ({
      title: "Navigation",
      subtitle: languageLabel(language),
    }),
  },
});
