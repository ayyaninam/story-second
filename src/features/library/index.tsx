import React, { CSSProperties, useState } from "react";
import { LibraryHeader } from "./components/header";
import { VIDEO_ORIENTATIONS } from "./constants";
import LibraryHomePage from "./components/home-page";
import LibraryGalleryPage from "./components/gallery-page";
import { VideoOrientation } from "@/types";

const container: CSSProperties = {
	backgroundColor: "#ffffff",
};

function LibraryPage() {
	const [selectedOrientationTab, setSelectedOrientationTab] = useState(
		VIDEO_ORIENTATIONS.ALL.id
	);
	return (
		<div className="min-h-[100vh]" style={container}>
			<LibraryHeader
				selectedOrientationTab={selectedOrientationTab}
				setSelectedOrientationTab={setSelectedOrientationTab}
			/>
			{selectedOrientationTab === VIDEO_ORIENTATIONS.ALL.id ? (
				<LibraryHomePage
					setSelectedOrientationTab={setSelectedOrientationTab}
				/>
			) : (
				<LibraryGalleryPage
					orientation={selectedOrientationTab as VideoOrientation}
				/>
			)}
		</div>
	);
}

export default LibraryPage;
