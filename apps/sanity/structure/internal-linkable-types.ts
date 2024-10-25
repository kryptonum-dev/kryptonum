/**
 * Array of objects defining the types of documents that can be linked internally.
 * Each object contains a 'type' property specifying the document type.
 *
 * @type {{type: string}[]}
 */
export const InternalLinkableTypes: { type: string }[] = [
  { type: 'Index_Page' },
  { type: 'BlogPost_Collection' },
  { type: 'BlogCategory_Collection' },
  { type: 'TeamMember_Collection' },
  { type: 'CaseStudy_Collection' },
];
