import React, { CSSProperties, useState } from "react";
import { LibraryHeader } from "./components/library-header";
import { VIDEO_ORIENTATIONS } from "./constants";
import LibraryHomePage from "./components/library-home-page";

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
			{selectedOrientationTab === VIDEO_ORIENTATIONS.ALL.id && (
				<LibraryHomePage />
			)}
			{/* {selectedOrientationTab === VIDEO_ORIENTATIONS.VERTICAL.id && (
                <VerticalOrientationLibraryPage />
            )}
            {selectedOrientationTab === VIDEO_ORIENTATIONS.WIDE.id && (
                <WideOrientationLibraryPage />
            )}
            {selectedOrientationTab === VIDEO_ORIENTATIONS.BOOK.id && (
                <BookOrientationLibraryPage />
            )} */}
		</div>
	);
}

export default LibraryPage;
