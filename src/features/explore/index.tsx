import React, { useState } from "react";
import { ExploreHeader } from "./components/header";
import { VIDEO_ORIENTATIONS } from "./constants";
import ExploreHomePage from "./components/home-page";
import ExploreGalleryPage from "./components/gallery-page";
import { VideoOrientation } from "@/types";
import { useRouter } from "next/router";

function ExplorePage() {
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
		<div className="h-full overflow-y-scroll bg-background rounded-lg mr-2 flex-grow">
			<ExploreHeader
				selectedOrientationTab={selectedOrientationTab}
				setSelectedOrientationTab={setSelectedOrientationTab}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
			/>
			{selectedOrientationTab === VIDEO_ORIENTATIONS.ALL.id ? (
				<ExploreHomePage
					setSelectedOrientationTab={setSelectedOrientationTab}
					searchTerm={searchTerm}
				/>
			) : (
				<ExploreGalleryPage
					key={selectedOrientationTab}
					orientation={selectedOrientationTab as VideoOrientation}
					searchTerm={searchTerm}
				/>
			)}
		</div>
	);
}

export default ExplorePage;
