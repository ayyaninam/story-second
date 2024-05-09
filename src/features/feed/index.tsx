import React, { useMemo } from "react";
import { FeedHeader } from "./components/header";
import { VIDEO_ORIENTATIONS } from "@/constants/feed-constants";
import FeedHomePage from "./components/home-page";
import FeedGalleryPage from "./components/gallery-page";
import { FeedPageVideoQueryOptions, VideoOrientation } from "@/types";
import { useRouter } from "next/router";
import { useDebounce } from "usehooks-ts";

function FeedPage() {
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

	const selectedSort = (router.query.sort as string) || "desc";
	const setSelectedSort = (sort: string) => {
		router.push(
			{
				query: { ...router.query, sort, page: 1 },
			},
			undefined,
			{ shallow: true }
		);
	};

	const filterOptions = useDebounce(
		useMemo<FeedPageVideoQueryOptions>(() => {
			const page = (router.query.page as string) || "1";
			const sort = (router.query.sort as string) || "desc";
			const searchTerm = (router.query.searchTerm as string) || "";
			return {
				CurrentPage: parseInt(page, 10),
				topLevelCategory: (router.query.genre as string) || "all",
				isDescending: sort === "desc",
				searchTerm,
			};
		}, [router.query]),
		500
	);

	return (
		<div className="h-full overflow-y-scroll bg-background lg:rounded-lg flex-grow">
			<FeedHeader
				selectedOrientationTab={selectedOrientationTab}
				setSelectedOrientationTab={setSelectedOrientationTab}
				selectedGenre={selectedGenre}
				setSelectedGenre={setSelectedGenre}
				selectedSort={selectedSort}
				setSelectedSort={setSelectedSort}
			/>
			{selectedOrientationTab === VIDEO_ORIENTATIONS.ALL.id ? (
				<FeedHomePage
					setSelectedOrientationTab={setSelectedOrientationTab}
					filterOptions={filterOptions}
				/>
			) : (
				<FeedGalleryPage
					key={selectedOrientationTab}
					orientation={selectedOrientationTab as VideoOrientation}
					filterOptions={filterOptions}
				/>
			)}
		</div>
	);
}

export default FeedPage;
