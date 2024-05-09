import api from "@/api";
import Routes from "@/routes";
import { cn } from "@/utils";
import Format from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { Img } from "remotion";
import { Skeleton } from "../ui/skeleton";

type SuggestedStoriesProps = {
	id: string;
	story?: boolean;
};

export default function SuggestedStories({ id, story }: SuggestedStoriesProps) {
	const suggestedStories = useQuery({
		queryKey: [id, story],
		queryFn: () =>
			(story
				? api.storybook.getSuggestedStories
				: api.video.getSuggestedVideos)({
				id,
				searchParams: { PageSize: 10, CurrentPage: 1 },
			}),
	});

	return (
		<div
			className={
				"w-[306px] bg-slate-200 right-2 top-2  p-4 pt-6 overflow-auto h-full"
			}
		>
			<div className="flex gap-2 items-center">
				<div className="h-10 w-10 rounded-md shadow bg-white" />
				<div>
					<h1 className="font-bold text-base text-slate-950">More Videos</h1>
					<p className="text-sm text-muted-foreground">Made with Story.com</p>
				</div>
			</div>
			<div className="mt-2 flex flex-col gap-2">
				{
					/* Show skeleton loader if data is not loaded */
					suggestedStories.isLoading
						? Array.from({ length: 4 }).map((_, index) => (
								<Skeleton key={index} className="rounded-lg w-full h-[150px]" />
							))
						: null
				}
				{suggestedStories?.data?.data?.map((story, index) => (
					<Link
						href={Routes.ViewStory(
							story.storyType,
							story.topLevelCategory?.replace(/ /g, "-").toLowerCase() || "all",
							story.slug as string
						)}
						key={index}
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
				))}
			</div>
		</div>
	);
}
