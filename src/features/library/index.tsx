import React, { useState } from "react";
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
	const setSelectedOrientationTab = (orientation: string) => {
		router.push(
			{
				query: { ...router.query, orientation, page: 1 },
			},
			undefined,
			{ shallow: true }
		);
	};

	const selectedGenre = (router.query.genre as string) || "all";
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
			<LibraryHeader
				selectedOrientationTab={selectedOrientationTab}
				setSelectedOrientationTab={setSelectedOrientationTab}
				selectedGenre={selectedGenre}
				setSelectedGenre={setSelectedGenre}
			/>
			{selectedOrientationTab === VIDEO_ORIENTATIONS.ALL.id ? (
				<LibraryHomePage
					setSelectedOrientationTab={setSelectedOrientationTab}
				/>
			) : (
				<LibraryGalleryPage
					key={selectedOrientationTab}
					orientation={selectedOrientationTab as VideoOrientation}
				/>
			)}
		</div>
	);
}

export default LibraryPage;
