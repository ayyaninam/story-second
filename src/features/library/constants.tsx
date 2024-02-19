import AllOrientationIcon from "@/components/icons/all-orientation";
import BookOrientationIcon from "@/components/icons/book-orientation";
import VerticalOrientationIcon from "@/components/icons/vertical-orientation";
import WideOrientationIcon from "@/components/icons/wide-orientation";

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
