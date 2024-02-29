"use client";
import api from "@/api";
import React, { useState, useEffect } from "react";
import { ModeToggle } from "@/features/edit-story/components/mode-toggle";
import Book from "@/components/ui/story-book/book";
import { mainSchema } from "@/api/schema";

type WebStory = mainSchema["ReturnWebStoryDTO"];

export default function PricingPage() {
	const [story, setStory] = useState<WebStory | null>(null);

	useEffect(() => {
		const fetchStory = async () => {
			const story = await api.storybook.getStory({
				topLevelCategory: "drama",
				slug: "the-farmers-fortune",
			});

			if (story) {
				setStory(story);
			}
		};

		void fetchStory();
	}, []);

	return (
		<div className="flex flex-col w-full items-center">
			<div className="w-full flex flex-col items-center">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center">
					<div className="w-full lg:w-auto mx-auto max-w-4xl lg:text-center">
						<h1 className="text-black dark:text-white text-4xl font-semibold max-w-xs sm:max-w-none md:text-6xl !leading-tight">
							Book
						</h1>
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
}
