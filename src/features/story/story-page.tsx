import { useRouter } from "next/router";
import { useMediaQuery } from "usehooks-ts";
import React, { useEffect, useState } from "react";
import { WebStory } from "@/components/ui/story-book/constants";
import api from "@/api";
import Navbar from "@/features/story/components/Navbar";
import Book from "@/components/ui/story-book";

const StoryBookPage = ({ storyData }: { storyData: WebStory | null }) => {
	const router = useRouter();
	const { genre, id } = router.query;
	const isDesktop = useMediaQuery("(min-width: 1280px)");

	const [story, setStory] = useState<WebStory | null>(storyData || null);

	useEffect(() => {
		const fetchStory = async () => {
			if (!genre || !id) {
				return;
			}

			const storyResponse = await api.storybook.getStory({
				topLevelCategory: genre as string,
				slug: id as string,
			});

			if (storyResponse) {
				setStory(storyResponse);
			}
		};

		const intervalId = setInterval(async () => {
			if (story && !story.storyDone) {
			await fetchStory();
		}else {
				clearInterval(intervalId);
			}
		}, 2000);

		void fetchStory();
	return () => clearInterval(intervalId);
	}, [genre, id]);

	return (
		<div className="bg-reverse items-center overflow-y-scroll md:overflow-hidden h-[calc(100vh-20px)]">
			<Navbar WebstoryData={story} />
			<div className="flex justify-center items-center h-full">
				{story && <Book story={story} />}
			</div>
		</div>
	);
};

export default StoryBookPage;
