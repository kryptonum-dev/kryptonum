/**
 * Array of objects defining the types of documents that can be linked internally.
 * Each object contains a 'type' property specifying the document type.
 *
 * @type {{type: string}[]}
 */
export const InternalLinkableTypes: { type: string }[] = [
  { type: 'Index_Page' },
  { type: 'Contact_Page' },
  { type: 'Portfolio_Page' },
  { type: 'Team_Page' },
  { type: 'Blog_Page' },
  { type: 'PrivacyPolicy_Page' },
  { type: 'TermsAndConditions_Page' },
  { type: 'Shop_Page' },
  { type: 'TeamMember_Collection' },
  { type: 'CaseStudy_Collection' },
  { type: 'Service_Collection' },
  { type: 'Location_Collection' },
  { type: 'BlogPost_Collection' },
];
