import React from "react";
import { Heart } from "lucide-react";
import { VIDEO_ORIENTATIONS } from "@/constants/feed-constants";
import { cn } from "@/utils";
import { GalleryData, VideoOrientation, VideoThumbnail } from "@/types";
import Routes from "@/routes";
import { useRouter } from "next/router";
import Link from "next/link";

function GalleryImage({
	story,
	galleryDetails,
}: {
	story: VideoThumbnail;
	galleryDetails: GalleryData[VideoOrientation];
}) {
	return (
		<Link
			href={Routes.ViewStory(
				story.storyType,
				story.topLevelCategory?.replace(/ /g, "-").toLowerCase() || "all",
				story.slug as string
			)}
			key={story.id}
			className={cn(
				"flex flex-col items-start rounded-[8px] border border-[#1f29371f] bg-white cursor-pointer hover:transform hover:scale-105 transition-transform duration-200 ease-in-out",
				story.expand ? "row-span-2 col-span-2" : "row-span-1 col-span-1"
			)}
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
						"absolute transition-all w-full p-3 top-0",
						galleryDetails.orientation === VIDEO_ORIENTATIONS.WIDE.id
							? "h-20"
							: "h-40"
					)}
					style={{
						background:
							"linear-gradient(180deg, rgba(0, 0, 0, 0.3) 20%, rgba(0, 0, 0, 0.00) 100%)",
					}}
				>
					<div className="flex flex-row justify-between items-center gap-2">
						{story.topLevelCategory && (
							<div className="min-h-full px-2 md:px-4 text-white text-xs font-normal w-fit bg-[#ffffff1f] flex py-0.5 rounded  items-center gap-1 justify-left">
								{story.topLevelCategory}
							</div>
						)}
						<div className="min-h-full px-2 md:px-4 text-white text-xs font-normal w-fit bg-[#ffffff1f] flex py-0.5 rounded  items-center gap-1">
							<Heart className="mr-1 h-4 w-4" />
							<span>{story.storyLikes}</span>
						</div>
					</div>
				</div>
				<div
					className={cn(
						"absolute transition-all w-full p-3 flex flex-col gap-1 bottom-0"
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
				</div>
			</div>
		</Link>
	);
}

export default GalleryImage;
