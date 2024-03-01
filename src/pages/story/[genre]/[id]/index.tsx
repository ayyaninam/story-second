import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import api from "@/api";
import Book from "@/components/ui/story-book/book";
import { ModeToggle } from "@/features/edit-story/components/mode-toggle";
import { WebStory } from "@/components/ui/story-book/constants";
import Link from "next/link";

const StoryBookPage = () => {
	const router = useRouter();
	const { genre, id } = router.query;

	const [story, setStory] = useState<WebStory | null>(null);

	useEffect(() => {
		const fetchStory = async () => {
			if (!genre || !id) {
				return;
			}

			const story = await api.storybook.getStory({
				topLevelCategory: genre as string,
				slug: id as string,
			});

			if (story) {
				setStory(story);
			}
		};

		void fetchStory();
	}, [genre, id]);

	const handleBack = () => {
		router.back();
	};

	return (
		<div className="flex flex-col w-full items-center">
			<div className="w-full flex flex-col items-center">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center">
					<div className="w-full lg:w-auto mx-auto max-w-4xl lg:text-center">
						<h1 className="text-black dark:text-white text-4xl font-semibold max-w-xs sm:max-w-none md:text-6xl !leading-tight">
							Book
						</h1>
					</div>

					<div>
						<span onClick={() => handleBack()}>Go Back</span>
					</div>

					<div className="mt-40">
						<div className="min-h-[610px] flex flex-col gap-5 w-[1000px]">
							{story && <Book story={story} />}
						</div>
					</div>

					<ModeToggle />
				</div>
			</div>
		</div>
	);
};

export default StoryBookPage;
