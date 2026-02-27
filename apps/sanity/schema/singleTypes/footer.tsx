import { defineField, defineType } from "sanity";
import { languageLabel } from "../../utils/language-label";
import { PanelBottom } from "lucide-react";

export default defineType({
  name: "footer",
  type: "document",
  title: "Footer",
  icon: PanelBottom,
  fields: [
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "pillars",
      type: "array",
      title: "Pillar Services",
      description: "Select 1-4 pillar services to show in footer.",
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
      name: "links",
      type: "array",
      title: "Company Links",
      description: "Select 2-4 hub pages for footer middle column (e.g., Portfolio, Team, Blog).",
      of: [{
        type: "object",
        fields: [
          defineField({
            name: "name",
            type: "string",
            title: "Link Name",
            validation: Rule => Rule.required(),
          }),
          defineField({
            name: "page",
            type: "reference",
            title: "Internal Page",
            to: [
              { type: "Index_Page" },
              { type: "Team_Page" },
              { type: "Blog_Page" },
              { type: "Portfolio_Page" },
              { type: "Contact_Page" },
              { type: "Shop_Page" },
              { type: "Links_Page" },
              { type: "Services_Page" },
            ],
            validation: Rule => Rule.required(),
          }),
        ],
        preview: {
          select: {
            title: "name",
            subtitle: "page.title",
          },
          prepare({ title, subtitle }) {
            return {
              title,
              subtitle,
              media: () => "🔗",
            };
          },
        },
      }],
      validation: Rule => [
        Rule.required(),
        Rule.min(2).max(4).error("You must select between 2 and 4 links."),
      ],
    }),
    defineField({
      name: "servicesCta",
      type: "cta",
      title: "Services CTA",
      description: "Button shown below pillar services in footer (typically links to /uslugi hub).",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "caseStudies",
      type: "array",
      title: "Case Studies (Legacy)",
      description: "Deprecated - no longer displayed in new footer design.",
      hidden: true,
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
        Rule.max(4).warning("We recommend max 4 case studies in footer."),
        Rule.unique(),
      ],
    }),
  ],
  preview: {
    select: {
      language: "language",
    },
    prepare: ({ language }) => ({
      title: "Footer",
      subtitle: languageLabel(language),
    }),
  },
});
