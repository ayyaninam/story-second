import AllOrientationIcon from "@/components/icons/all-orientation";
import BookOrientationIcon from "@/components/icons/book-orientation";
import VerticalOrientationIcon from "@/components/icons/vertical-orientation";
import WideOrientationIcon from "@/components/icons/wide-orientation";
import {GalleryData} from "@/types";

export const SORTING_OPTIONS = {
  DESCENDING: {
    id: "desc",
    value: "Newest First",
  },
  ASCENDING: {
    id: "asc",
    value: "Oldest First",
  },
};

export const VIDEO_ORIENTATIONS = {
  ALL: {
    value: "All",
    id: "all",
    icon: <AllOrientationIcon />,
  },
  WIDE: {
    value: "Wide",
    id: "wide",
    icon: <WideOrientationIcon />,
  },
  VERTICAL: {
    value: "Vertical",
    id: "vertical",
    icon: <VerticalOrientationIcon />,
  },
  BOOK: {
    value: "Book",
    id: "book",
    icon: <BookOrientationIcon />,
  },
  TIK_TOK: {
    value: "TikTok",
    id: "tik-tok",
    icon: <VerticalOrientationIcon />,
  },
};


export const EXPLORE_HOME_GALLERY_DATA: GalleryData = {
  [VIDEO_ORIENTATIONS.WIDE.id]: {
    title: "Wide",
    orientation: "wide",
    header: {
      title: "Most Recent Widescreen Videos",
      subtitle: "Desktop 16:9 Aspect Ratio",
      buttonText: "See all wide videos",
    },
    icon: <WideOrientationIcon />,
    aspectRatio: "16:9",
  },
  [VIDEO_ORIENTATIONS.VERTICAL.id]: {
    title: "Vertical",
    orientation: "vertical",
    icon: <VerticalOrientationIcon />,
    aspectRatio: "9:16",
    header: {
      title: "Most Recent Portrait-Mode Videos",
      subtitle: "Mobile 9:16 Aspect Ratio",
      buttonText: "See all portrait videos",
    },
  },
  [VIDEO_ORIENTATIONS.BOOK.id]: {
    title: "Book",
    orientation: "book",
    icon: <BookOrientationIcon />,
    aspectRatio: "1:1",
    header: {
      title: "Most Recent Story Books",
      subtitle: "Upload yourself & generate",
      buttonText: "See all Story Books",
    },
  },
  [VIDEO_ORIENTATIONS.TIK_TOK.id]: {
    title: "TikTok",
    orientation: "tik-tok",
    icon: <BookOrientationIcon />,
    aspectRatio: "9:16",
    header: {
      title: "Most Recent TikTok Videos",
      subtitle: "Upload yourself & generate",
      buttonText: "See all TikTok videos",
    },
  },
};


export const genreOptions = [
  { id: 'all', value: 'All Categories' },
  { id: 'adventure', value: 'Adventure' },
  { id: 'fantasy', value: 'Fantasy' },
  { id: 'science-fiction', value: 'Science Fiction' },
  { id: 'children-stories', value: 'Children Stories' },
  { id: 'drama', value: 'Drama' },
  { id: 'mystery-and-thriller', value: 'Mystery And Thriller' },
  { id: 'self-help-and-wellness', value: 'Self Help And Wellness' },
  { id: 'technology-and-innovation', value: 'Technology And Innovation'},
  { id: 'business-and-entrepreneurship', value: 'Business And Entrepreneurship'},
  { id: 'historical', value: 'Historical' },
  { id: 'comedy', value: 'Comedy' },
  { id: 'romance', value: 'Romance' },
  { id: 'non-fiction', value: 'Non Fiction' },
  { id: 'sports-and-recreation', value: 'Sports And Recreation' },
  { id: 'horror', value: 'Horror' },
  { id: 'travel-and-adventure', value: 'Travel And Adventure' },
  { id: 'education', value: 'Education' },
  { id: 'nature-and-environment', value: 'Nature And Environment' },
  { id: 'music-and-audio', value: 'Music And Audio' },
  { id: 'art-and-photography', value: 'Art And Photography' },
  { id: 'creative-non-fiction', value: 'Creative Non Fiction' },
  { id: 'parenting-and-family', value: 'Parenting And Family' },
  { id: 'food-and-beverage', value: 'Food And Beverage' },
  { id: 'home-and-garden', value: 'Home And Garden' },
  { id: 'performance', value: 'Performance' },
  { id: 'philosophy-and-religion', value: 'Philosophy And Religion' },
  { id: 'automotive', value: 'Automotive' },
  { id: 'culture-and-society', value: 'Culture And Society' },
  { id: 'fan-fiction', value: 'Fan Fiction' },
  { id: 'hobbies-and-crafts', value: 'Hobbies And Crafts' },
  { id: 'other', value: 'Other' }
];