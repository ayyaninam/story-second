import { useMediaQuery } from "usehooks-ts";
import DesktopBook from "./desktop/desktop-book";
import MobileBook from "./mobile/mobile-book";
import { WebStory } from "./constants";

interface BookProps {
	story: WebStory;
}

const Book = ({ story }: BookProps) => {
	const isMobile = useMediaQuery("(max-width: 768px)");
	return isMobile ? (
		<MobileBook story={story} />
	) : (
		<DesktopBook story={story} />
	);
};

export default Book;
