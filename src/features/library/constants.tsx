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
	wide: {
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
	vertical: {
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
	book: {
		title: "Book",
		orientation: "book",
		icon: <BookOrientationIcon />,
		aspectRatio: "9:16",
		header: {
			title: "Your Most Recent TikTok Videos",
			subtitle: "Upload yourself & generate",
			buttonText: "See all your TikTok videos",
		},
	},
};
