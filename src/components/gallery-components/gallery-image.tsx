import React from "react";
import { VIDEO_ORIENTATIONS } from "@/constants/feed-constants";
import { cn } from "@/utils";
import { GalleryData, VideoOrientation, VideoThumbnail } from "@/types";
import { Button } from "@/components/ui/button";
import Routes from "@/routes";
import { useRouter } from "next/router";
import ShareIcon from "./svgs/share-icon";
import PlayIcon from "./svgs/play-icon";

function GalleryImage({
	story,
	galleryDetails,
}: {
	story: VideoThumbnail;
	galleryDetails: GalleryData[VideoOrientation];
}) {
	const [isHovered, setIsHovered] = React.useState(false);
	const router = useRouter();
	return (
		<div
			key={story.id}
			className={cn(
				"flex flex-col items-start rounded-[8px] border border-[#1f29371f] bg-white cursor-pointer",
				story.expand ? "row-span-2 col-span-2" : "row-span-1 col-span-1"
			)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={() => {
				const categoryId =
					story.topLevelCategory?.replace(/ /g, "-").toLowerCase() || "all";
				router.push(
					Routes.ViewStory(story.storyType, categoryId, story.slug as string)
				);
			}}
		>
			<div
				className={cn(
					"w-full min-h-[100%] relative bg-gray-100 overflow-hidden",
					galleryDetails.orientation === VIDEO_ORIENTATIONS.WIDE.id
						? "aspect-[16/9]"
						: galleryDetails.orientation === VIDEO_ORIENTATIONS.BOOK.id
							? "aspect-[1/1]"
							: "aspect-[9/16]"
				)}
				style={{
					backgroundImage: `url(${story.thumbnail})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					borderRadius: "8px",
				}}
			>
				<div
					className={cn(
						"absolute transition-all w-full p-3",
						isHovered ? "opacity-100 top-0" : "opacity-0 top-[-20px]",
						galleryDetails.orientation === VIDEO_ORIENTATIONS.WIDE.id
							? "h-20"
							: "h-40"
					)}
					style={{
						background:
							"linear-gradient(180deg, rgba(0, 0, 0, 0.3) 20%, rgba(0, 0, 0, 0.00) 100%)",
					}}
				>
					<div className="flex gap-1 items-center">
						<div className="min-h-full px-4 text-white text-xs font-normal w-fit bg-[#ffffff1f] flex py-0.5 rounded  items-center gap-1">
							{galleryDetails.icon} {galleryDetails.aspectRatio}
						</div>
						{story.topLevelCategory && (
							<div className="min-h-full px-4 text-white text-xs font-normal w-fit bg-[#ffffff1f] flex py-0.5 rounded  items-center gap-1 justify-center">
								{story.topLevelCategory}
							</div>
						)}
					</div>
				</div>
				<div
					className={cn(
						"absolute transition-all w-full p-3 flex flex-col gap-1",
						isHovered ? "opacity-100 bottom-0" : "opacity-0 bottom-[-20px]"
					)}
					style={{
						background:
							"linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%)",
					}}
				>
					<div className="flex flex-col gap-[-4px]">
						<span
							className={cn(
								"line-clamp-1 text-white overflow-hidden text-ellipsis font-semibold leading-6 ",
								story.expand ? "text-lg" : "text-sm"
							)}
						>
							{story.title}
						</span>
						<p
							className={cn(
								"overflow-hidden text-ellipsis font-normal text-[#ffffffab]",
								story.expand ? "text-md line-clamp-2" : "text-xs line-clamp-1"
							)}
						>
							{story.description}
						</p>
					</div>
					<div className="flex gap-2 w-full">
						<Button className="flex grow gap-1 bg-purple-600 hover:bg-purple-800 text-white text-sm font-normal py-1.5 px-2 h-fit">
							<PlayIcon />
							Play
						</Button>
						<Button
							className="flex grow gap-1 bg-accent-600 hover:bg-accent-800 text-white text-sm font-normal py-1.5 px-2 h-fit"
							onClick={(e) => {
								e.stopPropagation();
								const categoryId =
									story.topLevelCategory?.replace(/ /g, "-").toLowerCase() ||
									"all";
								router.push(
									`${Routes.ViewStory(story.storyType, categoryId, story.slug as string)}`
								);
							}}
						>
							<ShareIcon />
							Share
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default GalleryImage;
