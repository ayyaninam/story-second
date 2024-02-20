import React from "react";
import LibraryGalleryComponent from "./gallery-component";
import { VideoOrientation } from "@/types";
import { LIBRARY_HOME_GALLERY_DATA } from "../constants";

function LibraryGalleryPage({
	orientation = "wide",
}: {
	orientation: VideoOrientation;
}) {
	const galleryDetails = LIBRARY_HOME_GALLERY_DATA[orientation] || {};
	return (
		<div className="flex flex-col gap-4 max-w-[1440px] mx-auto px-6 pt-10">
			<LibraryGalleryComponent
				galleryDetails={galleryDetails}
				isIndependentGalleryPage
			/>
		</div>
	);
}

export default LibraryGalleryPage;
