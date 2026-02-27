import type { StructureBuilder } from 'sanity/structure'
import { schemaTypes } from "../structure/schema-types";
import { Preview } from './preview';
import type { LucideIcon } from "lucide-react";
import { EditIcon, EyeOpenIcon } from "@sanity/icons";

type SingletonOptions = {
  title?: string;
  icon?: LucideIcon;
};

export const createSingleton = (S: StructureBuilder, name: string, config?: SingletonOptions) => {
  const { title, icon, options: schemaOptions, fields = [] } = schemaTypes.find(item => item.name === name) as {
    title: string,
    icon?: React.ComponentType,
    options: { documentPreview?: boolean },
    fields?: Array<{ name: string, type: string }>
  };
  const documentPreview = schemaOptions?.documentPreview ?? false
  const isInternationalized = fields.some(field => field.name === 'language')

  const views = [
    S.view.form().title('Editor').icon(EditIcon),
    ...(documentPreview ? [
      S.view
        .component(Preview)
        .title('Preview')
        .icon(EyeOpenIcon)
    ] : [])
  ]

  return S.listItem()
    .id(name)
    .title(config?.title ?? title)
    .icon(config?.icon ?? icon)
    .child(
      isInternationalized
        ? S.documentTypeList(name)
          .defaultLayout('detail')
          .id(name)
          .title(title)
          .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
          .filter('_type == $type')
          .params({ type: name })
          .child(documentId =>
            S.document()
              .documentId(documentId)
              .schemaType(name)
              .views(views)
          )
        : S.document()
          .documentId(name)
          .schemaType(name)
          .views(views)
    )
};
