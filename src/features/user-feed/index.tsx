import React, { useMemo } from "react";
import { UserProfileHeader } from "./components/header";
import { VIDEO_ORIENTATIONS } from "@/constants/feed-constants";
import UserProfileHomePage from "./components/home-page";
import UserGalleryPage from "./components/gallery-page";
import { FeedPageVideoQueryOptions, VideoOrientation } from "@/types";
import { useRouter } from "next/router";
import { useDebounce } from "usehooks-ts";
import { mainSchema } from "@/api/schema";

function UserProfilePage({
	userData,
}: {
	userData: mainSchema["OtherUserInfoDTO"];
}) {
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

	return (
		<div className="h-full overflow-y-scroll bg-background lg:rounded-lg flex-grow">
			<UserProfileHeader
				selectedOrientationTab={selectedOrientationTab}
				setSelectedOrientationTab={setSelectedOrientationTab}
				selectedGenre={selectedGenre}
				setSelectedGenre={setSelectedGenre}
				selectedSort={selectedSort}
				setSelectedSort={setSelectedSort}
			/>
			{selectedOrientationTab === VIDEO_ORIENTATIONS.ALL.id ? (
				<UserProfileHomePage
					setSelectedOrientationTab={setSelectedOrientationTab}
					filterOptions={filterOptions}
					userData={userData}
				/>
			) : (
				<UserGalleryPage
					key={selectedOrientationTab}
					orientation={selectedOrientationTab as VideoOrientation}
					filterOptions={filterOptions}
					userData={userData}
				/>
			)}
		</div>
	);
}

export default UserProfilePage;
