import api from "@/api";
import Routes from "@/routes";
import { cn } from "@/utils";
import Format from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { Img } from "remotion";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { ChevronsRight } from "lucide-react";

type SuggestedStoriesProps = {
	id: string;
	story?: boolean;
	visible: boolean;
	setVisible: (visible: boolean) => void;
	hovering?: boolean;
};

export default function SuggestedStories({
	id,
	story,
	visible,
	hovering,
	setVisible,
}: SuggestedStoriesProps) {
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
			className={cn(
				"w-[306px] right-2 top-2 translate-x-0  p-4 pt-6 bg-slate-200 overflow-auto h-full transition-all duration-300 ease-in-out max-w-[306px] opacity-100 suggested-videos",
				!visible && "translate-x-[200%] opacity-0 fixed top-20",
				hovering && "translate-x-0 opacity-100",
			)}
		>
			<div className="flex items-center gap-4">
				<Button
					className={`h-10 w-10 p-0 rounded-md shadow bg-white hover:shadow-lg`}
					variant="outline"
					onClick={() => setVisible(!visible)}
				>
					<ChevronsRight size={20} />
				</Button>
				<div className="flex gap-2 items-center">
					{/* <div className="h-10 w-10 rounded-md shadow bg-white" /> */}
					<div>
						<h1 className="font-bold text-base text-slate-950">More Videos</h1>
						<p className="text-sm text-muted-foreground">Made with Story.com</p>
					</div>
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
