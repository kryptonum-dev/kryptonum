import type { StructureBuilder } from "sanity/structure";
import { schemaTypes } from "./schema-types";
import { Preview } from "./preview";
import { TYPES_TO_EXCLUDE_PREVIEWS } from ".";

export const createCollection = (S: StructureBuilder, name: string) => {
  const { title, icon } = schemaTypes.find(item => item.name === name) as { title: string, icon: React.ReactNode };
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
              ...(!TYPES_TO_EXCLUDE_PREVIEWS.includes(name) ? [
                S.view
                  .component(Preview)
                  .title('Preview')
                  .icon(() => '👀')
              ] : []),
            ])
        )
    );
};
