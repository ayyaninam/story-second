import React from "react";
import { VIDEO_ORIENTATIONS } from "../constants";
import { cn } from "@/utils";
import { GalleryData, VideoOrientation, VideoThumbnail } from "@/types";
import { Button } from "@/components/ui/button";
import Routes from "@/routes";
import { useRouter } from "next/router";

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
				console.log("story", story);
				router.push(
					Routes.ToAuthPage(
						Routes.ViewStory(
							story.storyType,
							story.topLevelCategory as string,
							story.slug as string
						)
					)
				);
			}}
		>
			<div
				className={cn(
					"w-full min-h-[100%] relative bg-gray-100 relative overflow-hidden",
					galleryDetails.orientation === VIDEO_ORIENTATIONS.WIDE.id
						? "aspect-[16/9]"
						: "aspect-[9/16]"
				)}
				style={{
					backgroundImage: `url(${story.thumbnail})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
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
						<div className="min-h-full px-4 text-white text-xs font-normal w-fit bg-[#ffffff1f] flex py-0.5 rounded  items-center gap-1 justify-center">
							Category
						</div>
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
						<span className="line-clamp-1 text-white overflow-hidden text-ellipsis font-semibold leading-6 text-sm">
							{story.title}
						</span>
						<p className="line-clamp-2 overflow-hidden text-ellipsis font-normal text-sm text-[#ffffffab]">
							{story.description}
						</p>
					</div>
					<div className="flex gap-2 w-full">
						<Button className="flex grow gap-1 bg-purple-600 hover:bg-purple-800 text-white text-sm font-normal py-1.5 px-2 h-fit">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="17"
								viewBox="0 0 18 17"
								fill="none"
							>
								<path
									d="M4.06055 2.38214L13.6561 8.55068L4.06055 14.7192V2.38214Z"
									stroke="currentColor"
									stroke-width="1.02809"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Play
						</Button>
						<Button className="flex grow gap-1 bg-indigo-600 hover:bg-indigo-800 text-white text-sm font-normal py-1.5 px-2 h-fit">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="17"
								height="17"
								viewBox="0 0 17 17"
								fill="none"
							>
								<path
									d="M2.92383 8.55067V14.0338C2.92383 14.3974 3.06825 14.746 3.32532 15.0031C3.58239 15.2602 3.93106 15.4046 4.29461 15.4046H12.5193C12.8829 15.4046 13.2316 15.2602 13.4886 15.0031C13.7457 14.746 13.8901 14.3974 13.8901 14.0338V8.55067"
									stroke="currentColor"
									stroke-width="1.02809"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M11.1511 4.43833L8.40954 1.69676L5.66797 4.43833"
									stroke="currentColor"
									stroke-width="1.02809"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M8.4082 1.69676V10.6069"
									stroke="currentColor"
									stroke-width="1.02809"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Share
						</Button>
						<Button className="bg-[#ffffff1a] hover:bg-[#ffffff2b] p-2 h-8">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="17"
								height="17"
								viewBox="0 0 17 17"
								fill="none"
							>
								<g opacity="0.5">
									<rect
										width="16.4494"
										height="16.4494"
										transform="translate(0.326172 0.325958)"
										fill="white"
										fill-opacity="0.01"
									/>
									<path
										d="M3.78735 8.55066C3.78735 8.94812 3.46515 9.27033 3.06769 9.27033C2.67023 9.27033 2.34803 8.94812 2.34803 8.55066C2.34803 8.1532 2.67023 7.831 3.06769 7.831C3.46515 7.831 3.78735 8.1532 3.78735 8.55066ZM9.2705 8.55066C9.2705 8.94812 8.9483 9.27033 8.55084 9.27033C8.15338 9.27033 7.83117 8.94812 7.83117 8.55066C7.83117 8.1532 8.15338 7.831 8.55084 7.831C8.9483 7.831 9.2705 8.15321 9.2705 8.55066ZM14.7536 8.55066C14.7536 8.94812 14.4314 9.27033 14.034 9.27033C13.6365 9.27033 13.3143 8.94812 13.3143 8.55066C13.3143 8.15321 13.6365 7.831 14.034 7.831C14.4314 7.831 14.7536 8.15321 14.7536 8.55066Z"
										fill="#F8FAFC"
										stroke="#F8FAFC"
										stroke-width="1.02809"
									/>
								</g>
							</svg>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default GalleryImage;
