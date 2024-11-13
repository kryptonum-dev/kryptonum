import type { StructureResolver } from 'sanity/structure'
import { createSingleton } from '../utils/create-singleton'
import { createCollection } from '../utils/create-collection';

export const structure: StructureResolver = (S) =>
  S.list()
    .id('root')
    .title('Zawartość')
    .items([
      createSingleton(S, "global"),
      createSingleton(S, "redirects"),
      S.divider(),
      createSingleton(S, "Index_Page"),
      createSingleton(S, "Blog_Page"),
      createSingleton(S, "Contact_Page"),
      S.divider(),
      createCollection(S, "Service_Collection"),
      createCollection(S, "Location_Collection"),
      createCollection(S, "CaseStudy_Collection"),
      createCollection(S, "TeamMember_Collection"),
      S.divider(),
      createCollection(S, "BlogPost_Collection"),
      createCollection(S, "BlogCategory_Collection"),
      S.divider(),
      createCollection(S, "Review_Collection"),
      createCollection(S, "Faq_Collection"),
    ])
