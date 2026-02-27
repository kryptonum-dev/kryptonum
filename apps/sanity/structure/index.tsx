import type { StructureResolver } from 'sanity/structure'
import { createSingleton } from '../utils/create-singleton'
import { createCollection } from '../utils/create-collection';
import {
  BarChart3,
  BriefcaseBusiness,
  CircleHelp,
  FolderKanban,
  Home,
  Link2,
  MapPinned,
  MessageSquareQuote,
  Newspaper,
  PanelBottom,
  PanelTop,
  Scale,
  Settings,
  ShieldCheck,
  Users,
  UserRound,
  WalletCards,
  FileSearch,
  GalleryHorizontalEnd,
  PackageSearch,
  Archive,
  ShoppingBag,
  Settings2,
  Waypoints,
} from "lucide-react";

export const structure: StructureResolver = (S, context) =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      createSingleton(S, "Index_Page", { icon: Home }),
      createSingleton(S, "Contact_Page", { title: "Contact Page", icon: MessageSquareQuote }),
      S.divider(),
      S.listItem()
        .id("services-folder")
        .title("Services")
        .icon(FolderKanban)
        .child(
          S.list()
            .id("services-list")
            .title("Services")
            .items([
              createSingleton(S, "Services_Page", { title: "Services Hub", icon: FolderKanban }),
              createCollection(S, "Service_Collection", context, {
                title: "Service Pages",
                icon: BriefcaseBusiness,
                languageFilter: "coalesce(isArchived, false) != true",
              }),
            ])
        ),
      S.listItem()
        .id("locations-folder")
        .title("Locations")
        .icon(MapPinned)
        .child(
          S.list()
            .id("locations-list")
            .title("Locations")
            .items([
              createCollection(S, "Location_Collection", context, {
                title: "Location Pages",
                icon: MapPinned,
                languageFilter: "coalesce(isArchived, false) != true",
              }),
            ])
        ),
      S.divider(),
      S.listItem()
        .id("portfolio-folder")
        .title("Portfolio")
        .icon(GalleryHorizontalEnd)
        .child(
          S.list()
            .id("portfolio-list")
            .title("Portfolio")
            .items([
              createSingleton(S, "Portfolio_Page", { icon: GalleryHorizontalEnd }),
              createCollection(S, "CaseStudy_Collection", context, { title: "Case Studies", icon: WalletCards }),
              createCollection(S, "CaseStudyCategory_Collection", context, { title: "Case Study Categories", icon: FileSearch }),
            ])
        ),
      S.listItem()
        .id("blog-folder")
        .title("Blog")
        .icon(Newspaper)
        .child(
          S.list()
            .id("blog-list")
            .title("Blog")
            .items([
              createSingleton(S, "Blog_Page", { icon: Newspaper }),
              createCollection(S, "BlogPost_Collection", context, { title: "Posts", icon: Newspaper }),
              createCollection(S, "BlogCategory_Collection", context, { title: "Categories", icon: FileSearch }),
            ])
        ),
      S.listItem()
        .id("team-folder")
        .title("Team")
        .icon(Users)
        .child(
          S.list()
            .id("team-list")
            .title("Team")
            .items([
              createSingleton(S, "Team_Page", { icon: Users }),
              createCollection(S, "TeamMember_Collection", context, { title: "Team Members", icon: UserRound }),
            ])
        ),
      S.listItem()
        .id("shop-folder")
        .title("Shop")
        .icon(ShoppingBag)
        .child(
          S.list()
            .id("shop-list")
            .title("Shop")
            .items([
              createSingleton(S, "Shop_Page", { title: "Shop Page", icon: ShoppingBag }),
              createCollection(S, "ShopProduct_Collection", context, { title: "Products", icon: PackageSearch }),
              createSingleton(S, "ShopThankYou_Page", { title: "Shop Thank You Page", icon: CircleHelp }),
            ])
        ),
      createCollection(S, "LandingPage_Collection", context, { title: "Landing Pages", icon: Newspaper }),
      S.divider(),
      createCollection(S, "Review_Collection", context, { title: "Reviews", icon: MessageSquareQuote }),
      createCollection(S, "Faq_Collection", context, { title: "FAQ", icon: CircleHelp }),
      S.divider(),
      S.listItem()
        .id("site-config-folder")
        .title("Site Configuration")
        .icon(Settings2)
        .child(
          S.list()
            .id("site-config-list")
            .title("Site Configuration")
            .items([
              createSingleton(S, "navbar", { title: "Navigation", icon: PanelTop }),
              createSingleton(S, "footer", { title: "Footer", icon: PanelBottom }),
              createSingleton(S, "global", { title: "Global Settings", icon: Settings }),
              createSingleton(S, "analytics", { icon: BarChart3 }),
              createSingleton(S, "NotFound_Page", { title: "404 Page", icon: CircleHelp }),
              createSingleton(S, "PrivacyPolicy_Page", { title: "Privacy Policy", icon: ShieldCheck }),
              createSingleton(S, "TermsAndConditions_Page", { title: "Terms and Conditions", icon: Scale }),
              createSingleton(S, "redirects", { title: "Redirects", icon: Link2 }),
              createSingleton(S, "Links_Page", { title: "Links Page", icon: Waypoints }),
              S.listItem()
                .id("archive-folder")
                .title("Archive")
                .icon(Archive)
                .child(
                  S.list()
                    .id("archive-list")
                    .title("Archive")
                    .items([
                      createCollection(S, "Service_Collection", context, {
                        title: "Archived Service Pages",
                        icon: BriefcaseBusiness,
                        languageFilter: "coalesce(isArchived, false) == true",
                      }),
                      createCollection(S, "Location_Collection", context, {
                        title: "Archived Location Pages",
                        icon: MapPinned,
                        languageFilter: "coalesce(isArchived, false) == true",
                      }),
                    ])
                ),
            ])
        ),
    ])
