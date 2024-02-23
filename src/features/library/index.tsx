import React, { CSSProperties, useState } from "react";
import { LibraryHeader } from "./components/header";
import { VIDEO_ORIENTATIONS } from "./constants";
import LibraryHomePage from "./components/home-page";
import LibraryGalleryPage from "./components/gallery-page";
import { VideoOrientation } from "@/types";
import { useRouter } from "next/router";

function LibraryPage() {
	const router = useRouter();
	const selectedOrientationTab =
		(router.query.orientation as string) || VIDEO_ORIENTATIONS.ALL.id;
	const [searchTerm, setSearchTerm] = useState("");
	const setSelectedOrientationTab = (orientation: string) => {
		router.push(
			{
				query: { ...router.query, orientation, page: 1 },
			},
			undefined,
			{ shallow: true }
		);
	};

	return (
		<div className="h-full overflow-scroll bg-background rounded-lg mr-2 flex-grow">
			<LibraryHeader
				selectedOrientationTab={selectedOrientationTab}
				setSelectedOrientationTab={setSelectedOrientationTab}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
			/>
			{selectedOrientationTab === VIDEO_ORIENTATIONS.ALL.id ? (
				<LibraryHomePage
					setSelectedOrientationTab={setSelectedOrientationTab}
					searchTerm={searchTerm}
				/>
			) : (
				<LibraryGalleryPage
					key={selectedOrientationTab}
					orientation={selectedOrientationTab as VideoOrientation}
					searchTerm={searchTerm}
				/>
			)}
		</div>
	);
}

export default LibraryPage;
