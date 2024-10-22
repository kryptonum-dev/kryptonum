import { defineType } from "sanity";
import SimpleCtaSection from "./components/SimpleCtaSection";
import Faq from "./components/Faq";
import TagsSection from "./components/TagsSection";
import MarqueePillSection from "./components/MarqueePillSection";
import HeaderGridIcons from "./components/HeaderGridIcons";
import SimpleHeaderWithImage from "./components/SimpleHeaderWithImage";
import SplitScreenCtaSection from "./components/SplitScreenCtaSection";
import OverlappingCircles from "./components/OverlappingCircles";
import PillCtaSection from "./components/PillCtaSection";
import StackImagesWithCtaAndAvatars from "./components/StackImagesWithCtaAndAvatars";
import ImageAndNumberedList from "./components/ImageAndNumberedList";
import SkillsAndLinks from "./components/SkillsAndLinks";
import ContactInfo from "./components/ContactInfo";
import SimpleTextSection from "./components/SimpleTextSection";
import AvailabilityStatus from "./components/AvailabilityStatus";

export default defineType({
  name: 'components',
  type: 'array',
  title: 'Components',
  of: [
    SimpleCtaSection,
    Faq,
    TagsSection,
    MarqueePillSection,
    HeaderGridIcons,
    SimpleHeaderWithImage,
    SplitScreenCtaSection,
    OverlappingCircles,
    PillCtaSection,
    StackImagesWithCtaAndAvatars,
    ImageAndNumberedList,
    SkillsAndLinks,
    ContactInfo,
    SimpleTextSection,
    AvailabilityStatus,
  ],
  options: {
    insertMenu: {
      filter: true,
      showIcons: true,
      views: [
        { name: 'grid', previewImageUrl: (schemaTypeName) => `/static/${schemaTypeName}.webp` },
        { name: 'list' },
      ]
    }
  }
});
