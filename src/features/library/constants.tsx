import AllOrientationIcon from "@/components/icons/all-orientation";
import BookOrientationIcon from "@/components/icons/book-orientation";
import VerticalOrientationIcon from "@/components/icons/vertical-orientation";
import WideOrientationIcon from "@/components/icons/wide-orientation";
import { GalleryData } from "@/types";

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

export const GENRES = {
	ALL: {
		value: "All",
		id: "all",
	},
	ANIMATED: {
		value: "Animated",
		id: "animated",
	},
	REALISTIC: {
		value: "Realistic",
		id: "realistic",
	},
	PROMO: {
		value: "Promo",
		id: "promo",
	},
	NONFICTION: {
		value: "Non-fiction",
		id: "non-fiction",
	},
};

export const LIBRARY_HOME_GALLERY_DATA: GalleryData = {
	[VIDEO_ORIENTATIONS.WIDE.id]: {
		title: "Wide",
		orientation: "wide",
		header: {
			title: "Your Most Recent Widescreen Videos",
			subtitle: "Desktop 16:9 Aspect Ratio",
			buttonText: "See all your wide videos",
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
			title: "Your Most Recent Portrait-Mode Videos",
			subtitle: "Mobile 9:16 Aspect Ratio",
			buttonText: "See all your portrait videos",
		},
	},
	[VIDEO_ORIENTATIONS.BOOK.id]: {
		title: "Book",
		orientation: "book",
		icon: <BookOrientationIcon />,
		aspectRatio: "1:1",
		header: {
			title: "Your Most Recent Story Books",
			subtitle: "Upload yourself & generate",
			buttonText: "See all your Story Books",
		},
	},
	[VIDEO_ORIENTATIONS.TIK_TOK.id]: {
		title: "TikTok",
		orientation: "tik-tok",
		icon: <BookOrientationIcon />,
		aspectRatio: "9:16",
		header: {
			title: "Your Most Recent TikTok Videos",
			subtitle: "Upload yourself & generate",
			buttonText: "See all your TikTok videos",
		},
	},
};

export const SORTING_OPTIONS = {
	DESCENDING: {
		value: "desc",
		label: "Newest First",
	},
	ASCENDING: {
		value: "asc",
		label: "Oldest First",
	},
};
