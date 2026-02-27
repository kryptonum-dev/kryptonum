import type { StructureBuilder, StructureResolverContext } from "sanity/structure";
import { schemaTypes } from "../structure/schema-types";
import { Preview } from "./preview";
import { LANGUAGES } from "../structure/languages";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import type { LucideIcon } from "lucide-react";
import { Eye, Pencil } from "lucide-react";

type CollectionOptions = {
  title?: string;
  icon?: LucideIcon;
};

export const createCollection = (
  S: StructureBuilder,
  name: string,
  context?: StructureResolverContext,
  options?: CollectionOptions
) => {
  const { title, icon, options: schemaOptions, fields = [] } = schemaTypes.find(item => item.name === name) as {
    title: string,
    icon?: React.ComponentType,
    options: { documentPreview?: boolean },
    fields?: Array<{ name: string, type: string }>
  };
  const documentPreview = schemaOptions?.documentPreview ?? false
  const isInternationalized = fields.some(field => field.name === 'language')
  const isOrderable = name === 'CaseStudy_Collection' && context

  const views = [
    S.view.form().title('Editor').icon(Pencil),
    ...(documentPreview ? [
      S.view
        .component(Preview)
        .title('Preview')
        .icon(Eye)
    ] : [])
  ]

  return S.listItem()
    .id(name)
    .title(options?.title ?? title)
    .icon(options?.icon ?? icon)
    .child(
      isInternationalized && isOrderable
        ? S.list()
          .title(title)
          .items(
            LANGUAGES.map(lang =>
              orderableDocumentListDeskItem({
                type: name,
                title: `${title} (${lang.title})`,
                filter: `_type == "${name}" && language == "${lang.id}"`,
                params: { lang: lang.id },
                id: `orderable-${name}-${lang.id}`,
                S,
                context
              })
            ))
        : isInternationalized
          ? S.list()
            .title(title)
            .items(
              LANGUAGES.map(lang =>
                S.listItem()
                  .title(`${title} (${lang.title})`)
                  .icon(options?.icon ?? icon)
                  .child(
                    S.documentTypeList(name)
                      .title(`${title} (${lang.title})`)
                      .filter('_type == $type && language == $lang')
                      .params({ type: name, lang: lang.id })
                      .apiVersion('2024-12-31')
                      .child(documentId =>
                        S.document()
                          .documentId(documentId)
                          .schemaType(name)
                          .views(views)
                      )
                      .initialValueTemplates([
                        S.initialValueTemplateItem(`${name}-${lang.id}`)
                      ])
                  )
              ))
          : S.documentTypeList(name)
            .defaultLayout('detail')
            .title(title)
            .child(documentId =>
              S.document()
                .documentId(documentId)
                .schemaType(name)
                .views(views)
            )
    );
};
