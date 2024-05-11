import api from "@/api";
import Routes from "@/routes";
import { cn } from "@/utils";
import Format from "@/utils/format";
import {
	UseInfiniteQueryResult,
	useInfiniteQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { Img } from "remotion";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { ChevronsRight } from "lucide-react";
import { StoryOutputTypes } from "@/utils/enums";

type SuggestedStoriesProps = {
	id: string;
	storyType: StoryOutputTypes;
	visible: boolean;
	setVisible: (visible: boolean) => void;
	hovering?: boolean;
	resolution: number;
};

export default function SuggestedStories({
	id,
	storyType,
	visible,
	hovering,
	setVisible,
	resolution: DisplayResolution,
}: SuggestedStoriesProps) {
	const suggestedStory = useRef<HTMLDivElement>(null);
	const suggestedStoryRef = useRef<UseInfiniteQueryResult>();

	const suggestedStories = useInfiniteQuery({
		queryKey: [id, storyType, DisplayResolution],
		queryFn: ({ pageParam }) =>
			(storyType === StoryOutputTypes.Story
				? api.storybook.getSuggestedStories
				: api.video.getSuggestedVideos)({
				id,
				storyType,
				DisplayResolution,
				searchParams: {
					PageSize: 10,
					CurrentPage: pageParam,
				},
			}),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			if (!lastPage?.data) {
				return undefined;
			}
			return lastPage?.data?.totalPages > lastPage?.data?.currentPage
				? lastPage?.data?.currentPage + 1
				: undefined;
		},
	});

	useEffect(() => {
		suggestedStoryRef.current = suggestedStories;
	}, [suggestedStories]);

	const fetchMore = () => {
		if (
			suggestedStory.current &&
			suggestedStory.current?.scrollHeight -
				(suggestedStory.current?.scrollTop +
					suggestedStory.current?.clientHeight) <
				100 &&
			!suggestedStoryRef?.current?.isFetching &&
			!suggestedStoryRef?.current?.isFetchingNextPage &&
			suggestedStoryRef?.current?.hasNextPage
		) {
			suggestedStories.fetchNextPage();
		}
	};
	useEffect(() => {
		suggestedStory.current?.addEventListener("scroll", fetchMore);
		return () => {
			suggestedStory.current?.removeEventListener("scroll", fetchMore);
		};
	}, []);

	return (
		<div
			ref={suggestedStory}
			className={cn(
				"w-[306px] right-2 top-2 translate-x-0  p-4 pt-6 bg-slate-200 overflow-auto h-full transition-all duration-300 ease-in-out max-w-[306px] opacity-100 suggested-videos",
				!visible && "translate-x-[200%] opacity-0 fixed top-20",
				hovering && "translate-x-0 opacity-100"
			)}
		>
			<div className="flex items-center gap-4">
				<Button
					className={`h-10 w-10 p-0 rounded-md shadow bg-white hover:shadow-lg`}
					variant="outline"
					onClick={() => setVisible(!visible)}
				>
					<ChevronsRight
						size={20}
						className={cn(
							"transition-all duration-75 ",
							!visible && "rotate-180"
						)}
					/>
				</Button>
				<div className="flex gap-2 items-center">
					{/* <div className="h-10 w-10 rounded-md shadow bg-white" /> */}
					<div>
						<h1 className="font-bold text-base text-slate-950">
							Suggested Stories
						</h1>
						<p className="text-sm text-muted-foreground">Made with Story.com</p>
					</div>
				</div>
			</div>
			<div className="mt-2 flex flex-col gap-2">
				{
					/* Show skeleton loader if data is not loaded */
					suggestedStories.isLoading
						? Array.from({ length: 4 }).map((_, index) => (
								<div key={index}>
									<Skeleton className="rounded-lg w-full h-[150px]" />
									<Skeleton className="rounded-lg w-full h-6 mt-1" />
								</div>
							))
						: null
				}
				{suggestedStories?.data?.pages?.map((page, index) => {
					return page?.data?.items?.map((story, index) => (
						<div key={index}>
							<Link
								href={Routes.ViewStory(
									story.storyType,
									story.topLevelCategory?.replace(/ /g, "-").toLowerCase() ||
										"all",
									story.slug as string
								)}
								className={cn(
									"rounded-lg overflow-hidden",
									story?.id === id &&
										"outline-accent-600 border border-white outline outline-1"
								)}
							>
								<Img
									src={Format.GetImageUrl(story?.coverImage ?? "")}
									alt={story?.storyTitle ?? "Story"}
								/>
							</Link>
							<span
								className={
									"line-clamp-1 overflow-hidden text-ellipsis font-semibold my-1"
								}
							>
								{story.storyTitle}
							</span>
						</div>
					));
				})}
			</div>
		</div>
	);
}
