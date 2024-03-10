import { cn } from "@/utils";
import React from "react";
import { VIDEO_ORIENTATIONS } from "@/constants/feed-constants";
import { Skeleton } from "@/components/ui/skeleton";
import { GalleryData, VideoOrientation } from "@/types";

function GalleryComponentLoader({
	galleryDetails,
}: {
	galleryDetails: GalleryData[VideoOrientation];
}) {
	return (
		<div
			className={cn(
				"flex flex-col items-start rounded-[8px] border border-[#1f29371f] bg-white cursor-pointer overflow-hidden",
				"row-span-1 col-span-1"
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
			>
				<Skeleton className="w-full h-full animate-[pulse_1s_ease-in-out_infinite]">
					<div className="bg-gray-200 h-full w-full"></div>
				</Skeleton>
			</div>
		</div>
	);
}

export default GalleryComponentLoader;
