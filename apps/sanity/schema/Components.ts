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
import GroupedElements from "./components/GroupedElements";
import SimpleCtaColumnWithMedia from "./components/SimpleCtaColumnWithMedia";
import TeamSpotlight from "./components/TeamSpotlight";
import PerformanceHighlights from "./components/PerformanceHighlights";
import RichListAndCtaBox from "./components/RichListAndCtaBox";
import NarrowHeaderAndMedia from "./components/NarrowHeaderAndMedia";
import ProcessItemsGraph from "./components/ProcessItemsGraph";
import Reviews from "./components/Reviews";
import SingleReview from "./components/SingleReview";
import LatestBlogPosts from "./components/LatestBlogPosts";
import TrustedCompanies from "./components/TrustedCompanies";
import ContactForm from "./components/ContactForm";
import PersonIntroduction from "./components/PersonIntroduction";
import PersonEmojisIntroduction from "./components/PersonEmojisIntroduction";
import StatsHighlight from "./components/StatsHighlight";
import TeamIntroduction from "./components/TeamIntroduction";
import CenteredMediaTextSection from "./components/CenteredMediaTextSection";
import DetailedInfoAndStats from "./components/DetailedInfoAndStats";
import CaseStudyShowcase from "./components/CaseStudyShowcase";
import MediaShowcase from "./components/MediaShowcase";
import CompareTable from "./components/CompareTable";
import Timeline from "./components/Timeline";
import NetworkedShowcase from "./components/NetworkedShowcase";
import Newsletter from "./components/Newsletter";
import ChartWithSimpleText from "./components/ChartWithSimpleText";
import TabsText from "./components/TabsText";
import DecryptTabs from "./components/DecryptTabs";
import TagsLine from "./components/TagsLine";
import StagesAccordion from "./components/StagesAccordion";
import Pricing from "./components/Pricing";
import PricingRange from "./components/PricingRange";
import ShowcaseProjectsExpand from "./components/ShowcaseProjectsExpand";

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
    GroupedElements,
    SimpleCtaColumnWithMedia,
    TeamSpotlight,
    PerformanceHighlights,
    RichListAndCtaBox,
    NarrowHeaderAndMedia,
    ProcessItemsGraph,
    Reviews,
    SingleReview,
    LatestBlogPosts,
    TrustedCompanies,
    ContactForm,
    PersonIntroduction,
    PersonEmojisIntroduction,
    StatsHighlight,
    TeamIntroduction,
    CenteredMediaTextSection,
    DetailedInfoAndStats,
    CaseStudyShowcase,
    MediaShowcase,
    CompareTable,
    Timeline,
    NetworkedShowcase,
    Newsletter,
    ChartWithSimpleText,
    TabsText,
    DecryptTabs,
    TagsLine,
    StagesAccordion,
    Pricing,
    PricingRange,
    ShowcaseProjectsExpand,
  ],
  options: {
    insertMenu: {
      filter: true,
      showIcons: true,
      views: [
        { name: 'grid', previewImageUrl: (schemaTypeName) => `/static/components/${schemaTypeName}.webp` },
        { name: 'list' },
      ]
    }
  }
});
