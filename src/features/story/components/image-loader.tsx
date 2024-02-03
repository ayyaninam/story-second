import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { cn } from "@/utils";
import Format from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import CustomImageSuspense from "./custom-image-suspense";
import { components } from "@/api/types";

export default function ImageLoader({
	imageData = [],
	imageLoadingDurationMs = 2000,
	displayLoaderAfterFirstShow = false,
}: {
	imageData: (components["schemas"]["ReturnStorySegmentDTO"] & {
		src: string;
	})[];
	imageLoadingDurationMs?: number;
	displayLoaderAfterFirstShow?: boolean;
}) {
	// State
	const router = useRouter();
	const [seenIndices, setSeenIndices] = useState([]);
	const [index, setIndex] = useState(0);
	console.log(seenIndices);
	// Mutations

	// Hooks

	// Effects
	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % imageData.length);
		}, 5000);
		return () => clearInterval(interval);
	});

	// Handlers

	// Short cuts
	const currentImage = imageData[index]!;

	return (
		<CustomImageSuspense
			imageSrc={currentImage.src}
			isLoaded={true}
			onComplete={() => setSeenIndices((prev) => [...prev, index])}
			showAnimation={seenIndices.includes(index)}
			loadingDuration={imageLoadingDurationMs}
			width={16}
			height={9}
			Container={({ children, style, className }) => (
				<div className={`relative w-full h-full ${className}`} style={style}>
					<div className="absolute flex h-full w-full justify-center items-center z-[100]">
						<div
							className="px-4 py-1 text-white border-[0.5px] rounded-md max-w-[80%]"
							style={{
								background: `linear-gradient(180deg, rgba(3, 25, 38, 0.7) 0%, rgba(3, 25, 38, 0.8) 100%)`,
								borderColor: "rgba(0, 0, 0, 0.29)",
							}}
						>
							<p className="font-medium text-lg">Working on your story...</p>
						</div>
					</div>
					{children}
				</div>
			)}
		/>
	);
}

// while videoKeys are loading show images with the loading component
// fallback order is: video, image, text
// we know that the video is loading if the videoKey is not present
// we want to show a random/different image every 5 seconds
