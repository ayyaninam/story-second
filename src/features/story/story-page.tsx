import { useRouter } from "next/router";
import React from "react";
import { WebStory } from "@/components/ui/story-book/constants";
import api from "@/api";
import Navbar from "@/features/story/components/Navbar";
import Book from "@/components/ui/story-book";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";

const StoryBookPage = ({ storyData }: { storyData: WebStory | null }) => {
	const router = useRouter();
	const { genre, id } = router.query;

	const Webstory = useQuery({
		queryFn: () =>
			api.storybook.getStory({
				topLevelCategory: genre as string,
				slug: id as string,
			}),
		queryKey: [QueryKeys.STORY, genre, id],
		initialData: storyData,
		refetchInterval: (data) => {
			if (data?.state?.data?.storyDone) {
				return false;
			}
			return 2000;
		},
		enabled: !!genre && !!id,
	});

	const story = Webstory.data;

	return (
		<div className="bg-reverse flex flex-col h-[calc(100vh-75px)] lg:h-[calc(100vh-20px)]">
			<Navbar WebstoryData={story} />
			<div className="flex justify-center items-center flex-grow px-2">
				{story && <Book story={story} />}
			</div>
		</div>
	);
};

export default StoryBookPage;
