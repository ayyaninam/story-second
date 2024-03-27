import React, { useMemo, useState } from "react";
import { LibraryHeader } from "./components/header";
import { VIDEO_ORIENTATIONS } from "@/constants/feed-constants";
import LibraryHomePage from "./components/home-page";
import LibraryGalleryPage from "./components/gallery-page";
import { FeedPageVideoQueryOptions, VideoOrientation } from "@/types";
import { useRouter } from "next/router";
import { useDebounce } from "usehooks-ts";
import DeletedSuceededDialog from "@/features/library/components/deleted-suceeded-dialog";

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
			return {
				CurrentPage: parseInt(page, 10),
				topLevelCategory: (router.query.genre as string) || "all",
				isDescending: sort === "desc",
			};
		}, [router.query]),
		500
	);

	const [openDeleteSuceededDialog, setOpenDeleteSuceededDialog] = useState(
		router.query.deleteSucceeded === "true"
	);

	return (
		<div className="h-full overflow-y-scroll bg-background lg:rounded-lg flex-grow">
			<LibraryHeader
				selectedOrientationTab={selectedOrientationTab}
				setSelectedOrientationTab={setSelectedOrientationTab}
				selectedGenre={selectedGenre}
				setSelectedGenre={setSelectedGenre}
				selectedSort={selectedSort}
				setSelectedSort={setSelectedSort}
			/>
			{selectedOrientationTab === VIDEO_ORIENTATIONS.ALL.id ? (
				<LibraryHomePage
					setSelectedOrientationTab={setSelectedOrientationTab}
					filterOptions={filterOptions}
				/>
			) : (
				<LibraryGalleryPage
					key={selectedOrientationTab}
					orientation={selectedOrientationTab as VideoOrientation}
					filterOptions={filterOptions}
				/>
			)}

			<DeletedSuceededDialog
				open={openDeleteSuceededDialog}
				setOpen={setOpenDeleteSuceededDialog}
			/>
		</div>
	);
}

export default LibraryPage;
