import type { StructureBuilder, StructureResolverContext } from "sanity/structure";
import { schemaTypes } from "../structure/schema-types";
import { Preview } from "./preview";
import { LANGUAGES } from "../structure/languages";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

export const createCollection = (S: StructureBuilder, name: string, context?: StructureResolverContext) => {
  const { title, icon, options, fields = [] } = schemaTypes.find(item => item.name === name) as {
    title: string,
    icon: React.ReactNode,
    options: { documentPreview?: boolean },
    fields?: Array<{ name: string, type: string }>
  };
  const documentPreview = options?.documentPreview ?? false
  const isInternationalized = fields.some(field => field.name === 'language')
  const isOrderable = name === 'CaseStudy_Collection' && context

  const views = [
    S.view.form().title('Editor').icon(() => '🖋️'),
    ...(documentPreview ? [
      S.view
        .component(Preview)
        .title('Preview')
        .icon(() => '👀')
    ] : [])
  ]

  return S.listItem()
    .id(name)
    .title(title)
    .icon(icon)
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
                  .icon(icon)
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
