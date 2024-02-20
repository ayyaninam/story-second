import React from "react";
import LibraryHeroSection from "./hero-section";
import LibraryGalleryComponent from "./gallery-component";
import { VideoOrientation } from "@/types";
import { LIBRARY_HOME_GALLERY_DATA, VIDEO_ORIENTATIONS } from "../constants";

function LibraryHomePage({
	setSelectedOrientationTab,
}: {
	setSelectedOrientationTab: React.Dispatch<React.SetStateAction<string>>;
}) {
	return (
		<div className="flex p-4 flex-col gap-2 grow items-center justify-center">
			<LibraryHeroSection />
			<div className="flex max-w-[1440px] w-full flex-col gap-4">
				{Object.values(VIDEO_ORIENTATIONS).map((orientation) =>
					orientation.id === VIDEO_ORIENTATIONS.ALL.id ? null : (
						<LibraryGalleryComponent
							setSelectedOrientationTab={setSelectedOrientationTab}
							key={orientation.id}
							galleryDetails={
								LIBRARY_HOME_GALLERY_DATA[orientation.id as VideoOrientation]
							}
						/>
					)
				)}
			</div>
		</div>
	);
}

export default LibraryHomePage;
