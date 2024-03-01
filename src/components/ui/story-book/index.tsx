import { useMediaQuery } from "usehooks-ts";
import DesktopBook from "./desktop/desktop-book";
import MobileBook from "./mobile/mobile-book";
import { WebStory } from "./constants";

interface BookProps {
	story: WebStory;
}

const Book = ({ story }: BookProps) => {
	const isDesktop = useMediaQuery("(min-width: 1280px)");

	if (isDesktop) {
		return <DesktopBook story={story} />;
	}
	return <MobileBook story={story} />;
};

export default Book;
