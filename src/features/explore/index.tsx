import React from "react";
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
	const setSelectedOrientationTab = (orientation: string) => {
		router.push(
			{
				query: { ...router.query, orientation, page: 1 },
			},
			undefined,
			{ shallow: true }
		);
	};

	const selectedGenre = router.query.genre as string || "all";
	const setSelectedGenre = (genre: string) => {
		router.push(
			{
				query: { ...router.query, genre, page: 1 },
			},
			undefined,
			{ shallow: true }
		);
	};

	return (
		<div className="h-full overflow-y-scroll bg-background lg:rounded-lg flex-grow">
			<ExploreHeader
				selectedOrientationTab={selectedOrientationTab}
				setSelectedOrientationTab={setSelectedOrientationTab}
				selectedGenre={selectedGenre}
				setSelectedGenre={setSelectedGenre}
			/>
			{selectedOrientationTab === VIDEO_ORIENTATIONS.ALL.id ? (
				<ExploreHomePage
					setSelectedOrientationTab={setSelectedOrientationTab}
				/>
			) : (
				<ExploreGalleryPage
					key={selectedOrientationTab}
					orientation={selectedOrientationTab as VideoOrientation}
				/>
			)}
		</div>
	);
}

export default ExplorePage;
