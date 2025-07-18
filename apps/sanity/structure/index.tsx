import type { StructureResolver } from 'sanity/structure'
import { createSingleton } from '../utils/create-singleton'
import { createCollection } from '../utils/create-collection';

export const structure: StructureResolver = (S) =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      createSingleton(S, "global"),
      createSingleton(S, "analytics"),
      createSingleton(S, "redirects"),
      S.divider(),
      createSingleton(S, "Index_Page"),
      createSingleton(S, "Contact_Page"),
      createSingleton(S, "PrivacyPolicy_Page"),
      createSingleton(S, "TermsAndConditions_Page"),
      createSingleton(S, "NotFound_Page"),
      S.divider(),
      createCollection(S, "Service_Collection"),
      createCollection(S, "Location_Collection"),
      S.divider(),
      createSingleton(S, "Portfolio_Page"),
      createCollection(S, "CaseStudy_Collection"),
      createCollection(S, "CaseStudyCategory_Collection"),
      S.divider(),
      createSingleton(S, "Team_Page"),
      createCollection(S, "TeamMember_Collection"),
      S.divider(),
      createSingleton(S, "Blog_Page"),
      createCollection(S, "BlogPost_Collection"),
      createCollection(S, "BlogCategory_Collection"),
      S.divider(),
      createSingleton(S, "Shop_Page"),
      createCollection(S, "ShopProduct_Collection"),
      createSingleton(S, "ShopThankYou_Page"),
      S.divider(),
      createCollection(S, "Review_Collection"),
      createCollection(S, "Faq_Collection"),
      S.divider(),
      createSingleton(S, "Links_Page"),
      createCollection(S, "LandingPage_Collection"),
    ])
