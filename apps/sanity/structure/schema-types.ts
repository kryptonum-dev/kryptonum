// Single Types
import global from '../schema/singleTypes/global';
import analytics from '../schema/singleTypes/analytics';
import redirects from '../schema/singleTypes/redirects';
import Links_Page from '../schema/singleTypes/Links_Page';
import Index_Page from '../schema/singleTypes/Index_Page';
import Blog_Page from '../schema/singleTypes/Blog_Page';
import Contact_Page from '../schema/singleTypes/Contact_Page';
import Portfolio_Page from '../schema/singleTypes/Portfolio_Page';
import Team_Page from '../schema/singleTypes/Team_Page';
import PrivacyPolicy_Page from '../schema/singleTypes/Legal/PrivacyPolicy_Page';
import TermsAndConditions_Page from '../schema/singleTypes/Legal/TermsAndConditions_Page';
import NotFound_Page from '../schema/singleTypes/NotFound_Page';
import Shop_Page from '../schema/singleTypes/Shop_Page';
import ShopThankYou_Page from '../schema/singleTypes/ShopThankYou_Page';
import Services_Page from '../schema/singleTypes/Services_Page';
import navbar from '../schema/singleTypes/navbar';
import footer from '../schema/singleTypes/footer';

const singleTypes = [
  global,
  analytics,
  redirects,
  Links_Page,
  Index_Page,
  Blog_Page,
  Contact_Page,
  Portfolio_Page,
  Team_Page,
  PrivacyPolicy_Page,
  TermsAndConditions_Page,
  NotFound_Page,
  Shop_Page,
  ShopThankYou_Page,
  Services_Page,
  navbar,
  footer,
];

// Collections Types
import Service_Collection from '../schema/collectionTypes/Service_Collection';
import Location_Collection from '../schema/collectionTypes/Location_Collection';
import BlogPost_Collection from '../schema/collectionTypes/BlogPost_Collection';
import BlogCategory_Collection from '../schema/collectionTypes/BlogCategory_Collection';
import TeamMember_Collection from '../schema/collectionTypes/TeamMember_Collection';
import Review_Collection from '../schema/collectionTypes/Review_Collection';
import CaseStudy_Collection from '../schema/collectionTypes/CaseStudy_Collection';
import CaseStudyCategory_Collection from '../schema/collectionTypes/CaseStudyCategory_Collection';
import Faq_Collection from '../schema/collectionTypes/Faq_Collection';
import ShopProduct_Collection from '../schema/collectionTypes/ShopProduct_Collection';
import LandingPage_Collection from '../schema/collectionTypes/LandingPage_Collection';

const collectionTypes = [
  Service_Collection,
  Location_Collection,
  BlogPost_Collection,
  BlogCategory_Collection,
  TeamMember_Collection,
  Review_Collection,
  CaseStudy_Collection,
  CaseStudyCategory_Collection,
  Faq_Collection,
  ShopProduct_Collection,
  LandingPage_Collection,
];

// Components
import Components from '../schema/Components';

const components = [
  Components,
];

// UI Components
import cta from '../schema/ui/cta';
import seo from '../schema/ui/seo';
import PortableText from '../schema/ui/portable-text';
import Heading from '../schema/ui/portable-text/Heading';

const ui = [
  cta,
  seo,
  PortableText,
  Heading,
];

export const schemaTypes = [...singleTypes, ...collectionTypes, ...components, ...ui];

export const i18nTypes = [...singleTypes, ...collectionTypes]
  .map(type => type.name)
  .filter(name => !['redirects', 'analytics'].includes(name))

export const singletonActions = new Set(["publish", "discardChanges", "restore"]);
export const singletonTypes = new Set(singleTypes.map(type => type.name as string));
