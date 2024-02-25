import React from "react";
import { GalleryData, VideoOrientation, VideoThumbnail } from "@/types";
import { Button } from "@/components/ui/button";
import GalleryImage from "./gallery-image";
import GalleryComponentLoader from "./gallery-component-loader";

const navigationButtonStyles = {
	border: "0.5px solid var(--border)",
	background: "linear-gradient(180deg, #FFF 0%, #F8FAFC 100%)",
	boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 1px #A1A1AA",
};

function ExploreGalleryComponent({
	galleryDetails,
	isIndependentGalleryPage = false,
	setSelectedOrientationTab,
	thumbnails,
	areThumbnailsLoading,
}: {
	galleryDetails: GalleryData[VideoOrientation];
	isIndependentGalleryPage?: boolean;
	setSelectedOrientationTab?: (orientation: string) => void;
	thumbnails: VideoThumbnail[];
	areThumbnailsLoading: boolean;
}) {
	return (
		<>
			<div className="flex justify-between self-stretch min-w-100 items-center">
				<div className="flex gap-2 h-[44px] items-center">
					<div
						className="w-[40px] h-[40px] bg-white rounded-lg flex items-center justify-center"
						style={{
							boxShadow:
								"0px 1px 2px 0px rgba(9, 25, 72, 0.13), 0px 3px 8px 0px rgba(9, 25, 72, 0.05)",
						}}
					>
						{galleryDetails.icon}
					</div>
					<div>
						<div className="font-bold text-base text-slate-950">
							{galleryDetails.header.title}
						</div>
						<div className="text-sm text-muted-foreground font-normal">
							{galleryDetails.header.subtitle}
						</div>
					</div>
				</div>
				{!isIndependentGalleryPage && (
					<Button
						type="button"
						className={
							"flex py-2 px-4 gap-1 justify-center rounded-[52px] text-primary h-fit"
						}
						style={navigationButtonStyles}
						onClick={() => {
							if (!isIndependentGalleryPage && setSelectedOrientationTab) {
								setSelectedOrientationTab(galleryDetails.orientation);
							}
						}}
					>
						{galleryDetails.header.buttonText}
					</Button>
				)}

			</div>
			<div
				className={
					"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 grid-flow-row"
				}
			>
				{areThumbnailsLoading ? (
					Array.from({ length: isIndependentGalleryPage ? 20 : 5 }).map(
						(_, idx) => (
							<GalleryComponentLoader
								key={idx}
								galleryDetails={galleryDetails}
							/>
						)
					)
				) : (
					<>
						{thumbnails.map((story) => (
							<GalleryImage
								key={story.id}
								story={story}
								galleryDetails={galleryDetails}
							/>
						))}
					</>
				)}
			</div>
		</>
	);
}

export default ExploreGalleryComponent;
