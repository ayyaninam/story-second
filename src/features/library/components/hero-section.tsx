import { Button } from "@/components/ui/button";
import React, { CSSProperties } from "react";
import AiStar from "@/components/gallery-components/svgs/ai-star";
import RightArrow from "@/components/gallery-components/svgs/right-arrow";
import { cn } from "@/utils";
import Router from "next/router";
import Routes from "@/routes";
import Link from "next/link";
import { VideoThumbnail } from "@/types";

const heroSectionContainer: CSSProperties = {
	borderRadius: "var(--radius-3xl, 24px)",
	border: "1px solid var(--border-base-alpha, rgba(10, 15, 41, 0.08))",
	background: "var(--background-surface-default, #FFF)",
	boxShadow: "0px 1px 2px 0px rgba(20, 21, 26, 0.05)",
};

function LibraryHeroSection({
	randomStory,
}: {
	randomStory?: VideoThumbnail | null;
}) {
	return (
		<div className="w-full flex items-center justify-center gap-2 pb-6">
			<div
				className="flex w-full max-w-[1440px] justify-center items-center overflow-hidden"
				style={heroSectionContainer}
			>
				<div className="pt-8 pb-16 flex p-10 gap-8 flex-col items-start w-full">
					<span className="flex py-1 px-2 bg-accent-50 rounded-[350px] text-accent-600 font-normal tracking-tighter text-sm">
						Hi There
					</span>
					<div className="flex flex-col gap-4 items-start">
						<h1 className="text-[#14151A] text-5xl font-normal tracking-[-1.44px]">
							This is Where Your Videos Live
						</h1>
						<p className="text-base font-normal text-accent-700">
							Within your personal Authorly library, you’ll find every one of
							your videos, both finished and draft.{" "}
							<span className="text-[#0F132499]">
								We can’t wait to see what awesome videos you add next.
							</span>
						</p>
					</div>
					<div className="flex gap-4 flex-col sm:flex-row w-full">
						<Button
							variant="secondary"
							size="sm"
							className="bg-accent-600 hover:bg-accent-700 flex gap-1.5 py-1.5 px-2.5 text-sm font-medium items-center h-fit border border-accent-700 text-background"
							onClick={() => {
								Router.push(Routes.Generate());
							}}
						>
							<AiStar />
							Generate a new script to edit
							<RightArrow fill="white" fill_opacity="1" />
						</Button>
						{/*<Button*/}
						{/*	size="sm"*/}
						{/*	className="bg-white hover:bg-gray-100 flex gap-1.5 py-1.5 px-2.5 text-sm font-medium items-center h-fit border border-[#DEE0E3] text-primary"*/}
						{/*	onClick={() => {*/}
						{/*		// TODO: Integrate this with prompt box*/}
						{/*		toast.success("Coming soon!")*/}
						{/*	}}*/}
						{/*>*/}
						{/*	<BookScroll />*/}
						{/*	New, blank script*/}
						{/*	<RightArrow fill="#0F1324" fill_opacity="0.6" />*/}
						{/*</Button>*/}
					</div>
				</div>
				<Link
					href={`${Routes.ViewStory(
						randomStory?.storyType || 0,
						randomStory?.topLevelCategory?.replace(/ /g, "-").toLowerCase() ||
							"all",
						randomStory?.slug || ""
					)}`}
					className="hidden lg:block w-full min-h-full bg-accent-700 self-stretch"
				>
					{/* # TODO: make this responsive*/}
					{randomStory && (
						<div
							className={cn(
								"w-full h-full relative bg-gray-100 overflow-hidden aspect-[16/9]"
							)}
							style={{
								backgroundImage: `url(${randomStory.thumbnail})`,
								backgroundSize: "cover",
								backgroundPosition: "center",
								borderRadius: "8px",
							}}
						></div>
					)}
				</Link>
			</div>
		</div>
	);
}

export default LibraryHeroSection;
