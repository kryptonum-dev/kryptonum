import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'NetworkedShowcase';
const title = 'Networked Showcase';
const icon = () => '🌐';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    // --- Tags configuration: plain text OR linked items ---
    defineField({
      name: 'tagsAsLinks',
      type: 'boolean',
      title: 'Tags as Links',
      description: 'If enabled, tags will be clickable links to internal pages. If disabled, tags are plain text labels.',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Tags',
      description: 'Plain text labels displayed in the animated slider.',
      hidden: ({ parent }) => parent?.tagsAsLinks === true,
      validation: Rule => Rule.custom((value, context) => {
        const tagsAsLinks = (context.parent as { tagsAsLinks?: boolean })?.tagsAsLinks;
        if (tagsAsLinks) return true;
        if (!value || value.length < 3) return 'Add at least 3 tags';
        return true;
      }),
    }),
    defineField({
      name: 'linkedTags',
      type: 'array',
      title: 'Tags',
      description: 'Tags displayed in the animated slider. Each tag can optionally link to an internal page.',
      hidden: ({ parent }) => parent?.tagsAsLinks !== true,
      validation: Rule => Rule.custom((value, context) => {
        const tagsAsLinks = (context.parent as { tagsAsLinks?: boolean })?.tagsAsLinks;
        if (!tagsAsLinks) return true;
        if (!value || value.length < 3) return 'Add at least 3 tags';
        return true;
      }),
      of: [
        {
          type: 'object',
          name: 'linkedTagItem',
          title: 'Tag',
          fields: [
            defineField({
              name: 'name',
              type: 'string',
              title: 'Label',
              description: 'Display text for the tag',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'page',
              type: 'reference',
              title: 'Link to Page (optional)',
              description: 'If set, the tag will be a clickable link. If empty, the tag is plain text.',
              to: [
                { type: 'Location_Collection' },
                { type: 'Service_Collection' },
                { type: 'LandingPage_Collection' },
              ],
              options: {
                disableNew: true,
                filter: ({ document }) => {
                  const language = (document as { language?: string })?.language;
                  return {
                    filter: 'defined(slug.current) && language == $lang',
                    params: { lang: language }
                  }
                }
              },
            }),
          ],
          preview: {
            select: {
              title: 'name',
              slug: 'page.slug.current',
            },
            prepare: ({ title, slug }) => ({
              title: title || 'Unnamed Tag',
              subtitle: slug || '',
              icon: () => '🌃',
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'status',
      type: 'string',
      title: 'Status (optional)',
    }),
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Heading',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'paragraph',
      type: 'PortableText',
      title: 'Paragraph',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'ctas',
      type: 'array',
      title: 'CTAs',
      description: 'Up to 2 CTAs',
      of: [{ type: 'cta' }],
      validation: Rule => Rule.required().max(2),
    }),
    defineField({
      name: 'showRating',
      type: 'boolean',
      title: 'Show rating?',
      description: <>
        If you will set that to true, the data will be fetched from <a href='/structure/global#googleData.rating' target='_blank' rel='noopener'>global settings</a>.
      </>,
      initialValue: true,
    }),
    defineField({
      name: 'scrollToSectionId',
      type: 'string',
      title: 'Scroll to section ID (optional)',
      description: 'If you will do not set that, the link will be to the Google rating page. If you will set that, the link will scroll to the section with that ID.',
      hidden: ({ parent }) => !parent?.showRating,
      validation: Rule => Rule.custom((value, context) => {
        const showRating = (context.parent as { showRating?: boolean })?.showRating;
        if (showRating && value && !value?.startsWith('#')) {
          return 'Scroll to section ID must start with "#" symbol';
        }
        return true;
      }),
    }),
    // --- Right column: Video OR Services toggle ---
    defineField({
      name: 'showVideo',
      type: 'boolean',
      title: 'Show Video instead of Services',
      description: 'If enabled, displays a vertical video. If disabled, displays the networked services cards.',
      initialValue: false,
    }),
    defineField({
      name: 'pages',
      type: 'array',
      title: '4 linked services pages',
      description: 'Select 4 service pages to display as networked cards.',
      of: [
        defineField({
          name: 'page',
          type: 'reference',
          to: [{ type: 'Service_Collection' }],
          options: {
            disableNew: true,
            filter: ({ parent, document }) => {
              const language = (document as { language?: string })?.language;
              const selectedIds = (parent as { _ref?: string }[])?.filter(item => item._ref).map(item => item._ref) || [];
              return {
                filter: '!(_id in $selectedIds) && !(_id in path("drafts.**")) && language == $lang',
                params: { selectedIds, lang: language }
              }
            }
          }
        }),
      ],
      hidden: ({ parent }) => parent?.showVideo === true,
      validation: Rule => Rule.custom((value, context) => {
        const showVideo = (context.parent as { showVideo?: boolean })?.showVideo;
        if (showVideo) return true;
        if (!value || value.length < 4) return 'Select exactly 4 service pages';
        if (value.length > 4) return 'Maximum 4 service pages allowed';
        return true;
      }),
    }),
    defineField({
      name: 'video',
      type: 'object',
      title: 'Hero Video',
      description: 'Vertical video displayed on the right side of the hero section',
      hidden: ({ parent }) => !parent?.showVideo,
      fields: [
        defineField({
          name: 'asset',
          type: 'mux.video',
          title: 'Full Video',
          description: 'The full video that plays when clicked (9:16 aspect ratio recommended)',
        }),
        defineField({
          name: 'useVideoThumbnail',
          type: 'boolean',
          title: 'Use Video as Thumbnail',
          description: 'If enabled, shows a looping video preview. If disabled, shows a static image.',
          initialValue: false,
        }),
        defineField({
          name: 'thumbnailVideo',
          type: 'mux.video',
          title: 'Thumbnail Video (Loop)',
          description: 'A short looping video (3-7 seconds) shown as preview. Should loop seamlessly.',
          hidden: ({ parent }) => !parent?.useVideoThumbnail,
        }),
        defineField({
          name: 'poster',
          type: 'image',
          title: 'Poster Image',
          description: 'Static thumbnail image. Used when video thumbnail is disabled.',
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.useVideoThumbnail === true,
        }),
      ],
      validation: Rule => Rule.custom((value, context) => {
        const showVideo = (context.parent as { showVideo?: boolean })?.showVideo;
        if (showVideo && !value?.asset) {
          return 'Video asset is required when video mode is enabled';
        }
        return true;
      }),
    }),
    ...sectionId,
  ],
  preview: {
    select: {
      heading: 'heading',
    },
    prepare: ({ heading }) => ({
      title: title,
      subtitle: toPlainText(heading),
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
});
