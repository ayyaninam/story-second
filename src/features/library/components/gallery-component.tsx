import React from "react";
import { GalleryData, VideoOrientation } from "@/types";
import { Button } from "@/components/ui/button";
import GalleryImage from "./gallery-image";

const navigationButtonStyles = {
	border: "0.5px solid var(--border)",
	background: "linear-gradient(180deg, #FFF 0%, #F8FAFC 100%)",
	boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 1px #A1A1AA",
};

function LibraryGalleryComponent({
	galleryDetails,
	isIndependentGalleryPage = false,
	setSelectedOrientationTab,
}: {
	galleryDetails: GalleryData[VideoOrientation];
	isIndependentGalleryPage?: boolean;
	setSelectedOrientationTab?: React.Dispatch<React.SetStateAction<string>>;
}) {
	return (
		<>
			<div className="flex justify-between self-stretch min-w-100">
				<div className="flex gap-2 h-[44px] items-center">
					<div
						className="w-[40px] h-[40px] bg-white rounded-lg"
						style={{
							boxShadow:
								"0px 1px 2px 0px rgba(9, 25, 72, 0.13), 0px 3px 8px 0px rgba(9, 25, 72, 0.05)",
						}}
					></div>
					<div>
						<div className="font-bold text-base text-slate-950">
							{galleryDetails.header.title}
						</div>
						<div className="text-sm text-muted-foreground font-normal">
							{galleryDetails.header.subtitle}
						</div>
					</div>
				</div>
				<Button
					type="button"
					className={"flex py-2 px-4 gap-1 justify-center gap-1 rounded-[52px]"}
					style={navigationButtonStyles}
					onClick={() => {
						if (!isIndependentGalleryPage && setSelectedOrientationTab) {
							setSelectedOrientationTab(galleryDetails.orientation);
						}
					}}
				>
					{isIndependentGalleryPage ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
						>
							<path
								d="M8 3.33337V12.6667"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M3.33301 8H12.6663"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					) : null}
					{isIndependentGalleryPage
						? "Create a new collection"
						: galleryDetails.header.buttonText}
				</Button>
			</div>
			<div className={"grid grid-cols-5 gap-4 grid-flow-row"}>
				{galleryDetails.thumbnails.map((thumbnail) => (
					<GalleryImage
						key={thumbnail.id}
						thumbnail={thumbnail}
						galleryDetails={galleryDetails}
					/>
				))}
			</div>
		</>
	);
}

export default LibraryGalleryComponent;
