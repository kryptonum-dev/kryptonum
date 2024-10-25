import type { StructureBuilder } from "sanity/structure";
import { schemaTypes } from "../structure/schema-types";
import { Preview } from "./preview";

export const createCollection = (S: StructureBuilder, name: string) => {
  const { title, icon, options } = schemaTypes.find(item => item.name === name) as { title: string, icon: React.ReactNode, options: { documentPreview?: boolean } };
  const documentPreview = options?.documentPreview ?? false

  return S.listItem()
    .id(name)
    .title(title)
    .icon(icon)
    .child(
      S.documentTypeList(name)
        .title(title)
        .child(documentId =>
          S.document()
            .documentId(documentId)
            .schemaType(name)
            .views([
              S.view.form().title('Editor').icon(() => '🖋️'),
              ...(documentPreview ? [
                S.view
                  .component(Preview)
                  .title('Preview')
                  .icon(() => '👀')
              ] : []),
            ])
        )
    );
};
