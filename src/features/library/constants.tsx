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
		thumbnails: [
			{
				id: "1",
				title: "The Title",
				description:
					"Join us on a breathtaking adventure through the Sierra Nevadas. Watch in awe as we paddle bright blue kayaks across crystal clear mountain waters filled with ice age remnants.",
				thumbnail: "/images/library/wideImage.png",
				expand: true,
			},
			{
				id: "2",
				title: "The Title",
				description:
					"Join us on a breathtaking adventure through the Sierra Nevadas. Watch in awe as we paddle bright blue kayaks across crystal clear mountain waters filled with ice age remnants.",
				thumbnail: "/images/library/wideImage.png",
			},
			{
				id: "3",
				title: "The Title",
				description:
					"Join us on a breathtaking adventure through the Sierra Nevadas. Watch in awe as we paddle bright blue kayaks across crystal clear mountain waters filled with ice age remnants.",
				thumbnail: "/images/library/wideImage.png",
			},
			{
				id: "4",
				title: "The Title",
				description:
					"Join us on a breathtaking adventure through the Sierra Nevadas. Watch in awe as we paddle bright blue kayaks across crystal clear mountain waters filled with ice age remnants.",
				thumbnail: "/images/library/wideImage.png",
			},
			{
				id: "5",
				title: "The Title",
				description:
					"Join us on a breathtaking adventure through the Sierra Nevadas. Watch in awe as we paddle bright blue kayaks across crystal clear mountain waters filled with ice age remnants.",
				thumbnail: "/images/library/wideImage.png",
			},
			{
				id: "6",
				title: "The Title",
				description:
					"Join us on a breathtaking adventure through the Sierra Nevadas. Watch in awe as we paddle bright blue kayaks across crystal clear mountain waters filled with ice age remnants.",
				thumbnail: "/images/library/wideImage.png",
			},
			{
				id: "7",
				title: "The Title",
				description:
					"Join us on a breathtaking adventure through the Sierra Nevadas. Watch in awe as we paddle bright blue kayaks across crystal clear mountain waters filled with ice age remnants.",
				thumbnail: "/images/library/wideImage.png",
			},
		],
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
		thumbnails: [
			{
				id: "1",
				title: "The Title",
				description:
					"Join us on a breathtaking adventure through the Sierra Nevadas. Watch in awe as we paddle bright blue kayaks across crystal clear mountain waters filled with ice age remnants.",
				thumbnail: "/images/library/verticalImage1.png",
			},
			{
				id: "2",
				title: "The Title",
				description:
					"Join us on a breathtaking adventure through the Sierra Nevadas. Watch in awe as we paddle bright blue kayaks across crystal clear mountain waters filled with ice age remnants.",
				thumbnail: "/images/library/verticalImage.png",
			},
			{
				id: "3",
				title: "The Title",
				description:
					"Join us on a breathtaking adventure through the Sierra Nevadas. Watch in awe as we paddle bright blue kayaks across crystal clear mountain waters filled with ice age remnants.",
				thumbnail: "/images/library/verticalImage.png",
			},
			{
				id: "4",
				title: "The Title",
				description:
					"Join us on a breathtaking adventure through the Sierra Nevadas. Watch in awe as we paddle bright blue kayaks across crystal clear mountain waters filled with ice age remnants.",
				thumbnail: "/images/library/verticalImage1.png",
			},
			{
				id: "5",
				title: "The Title",
				description:
					"Join us on a breathtaking adventure through the Sierra Nevadas. Watch in awe as we paddle bright blue kayaks across crystal clear mountain waters filled with ice age remnants.",
				thumbnail: "/images/library/verticalImage.png",
			},
		],
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
		thumbnails: [
			{
				id: "1",
				title: "The Title",
				description:
					"Join us on a breathtaking adventure through the Sierra Nevadas. Watch in awe as we paddle bright blue kayaks across crystal clear mountain waters filled with ice age remnants.",
				thumbnail: "/images/library/verticalImage.png",
			},
			{
				id: "2",
				title: "The Title",
				description:
					"Join us on a breathtaking adventure through the Sierra Nevadas. Watch in awe as we paddle bright blue kayaks across crystal clear mountain waters filled with ice age remnants.",
				thumbnail: "/images/library/verticalImage1.png",
			},
			{
				id: "3",
				title: "The Title",
				description:
					"Join us on a breathtaking adventure through the Sierra Nevadas. Watch in awe as we paddle bright blue kayaks across crystal clear mountain waters filled with ice age remnants.",
				thumbnail: "/images/library/verticalImage.png",
			},
			{
				id: "4",
				title: "The Title",
				description:
					"Join us on a breathtaking adventure through the Sierra Nevadas. Watch in awe as we paddle bright blue kayaks across crystal clear mountain waters filled with ice age remnants.",
				thumbnail: "/images/library/verticalImage.png",
			},
			{
				id: "5",
				title: "The Title",
				description:
					"Join us on a breathtaking adventure through the Sierra Nevadas. Watch in awe as we paddle bright blue kayaks across crystal clear mountain waters filled with ice age remnants.",
				thumbnail: "/images/library/verticalImage1.png",
			},
		],
	},
};
