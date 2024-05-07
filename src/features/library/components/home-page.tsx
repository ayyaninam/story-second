import React, { useMemo } from "react";
import LibraryHeroSection from "./hero-section";
import LibraryGalleryComponent from "@/components/gallery-components/gallery-component";
import { LibraryPageVideoQueryOptions } from "@/types";
import {
	LIBRARY_HOME_GALLERY_DATA,
	VIDEO_ORIENTATIONS,
} from "@/constants/feed-constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mainSchema } from "@/api/schema";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { DisplayAspectRatios, StoryOutputTypes } from "@/utils/enums";
import { getGalleryThumbnails } from "@/utils/feed-utils";

function LibraryHomePage({
	setSelectedOrientationTab,
	filterOptions,
}: {
	setSelectedOrientationTab: (orientation: string) => void;
	filterOptions: LibraryPageVideoQueryOptions;
}) {
	const queryClient = useQueryClient();

	const useFetchStories = (
		storyType: StoryOutputTypes,
		resolution?: DisplayAspectRatios
	) =>
		useQuery<
			| mainSchema["ReturnVideoStoryDTOPagedList"]
			| mainSchema["ReturnWebStoryDTOPagedList"]
		>({
			queryFn: () =>
				api.library.getStories({
					params: {
						PageSize: resolution === DisplayAspectRatios["1024x576"] ? 7 : 5,
						CurrentPage: 1,
						topLevelCategory: filterOptions.topLevelCategory,
						isDescending: filterOptions.isDescending,
						storyType: storyType,
						resolution: resolution,
						searchTerm: filterOptions.searchTerm,
					},
				}),
			staleTime: 3000,
			queryKey: [
				QueryKeys.LIBRARY_GALLERY,
				filterOptions,
				storyType,
				resolution,
			],
			initialData: queryClient.getQueryData([
				QueryKeys.LIBRARY_GALLERY,
				filterOptions,
				storyType,
				resolution,
			]),
		});

	const wideVideoList = useFetchStories(
		StoryOutputTypes.Video,
		DisplayAspectRatios["1024x576"]
	);
	const verticalVideoList = useFetchStories(
		StoryOutputTypes.Video,
		DisplayAspectRatios["576x1024"]
	);
	const storyBooksList = useFetchStories(StoryOutputTypes.Story); // Assuming no resolution needed for story books
	const trendsVideosList = useFetchStories(
		StoryOutputTypes.SplitScreen,
		DisplayAspectRatios["576x1024"]
	);

	const segregatedStories = useMemo(
		() => ({
			[VIDEO_ORIENTATIONS.WIDE.id]: getGalleryThumbnails(
				wideVideoList.data?.items || [],
				true
			),
			[VIDEO_ORIENTATIONS.VERTICAL.id]: getGalleryThumbnails(
				verticalVideoList.data?.items || []
			),
			[VIDEO_ORIENTATIONS.BOOK.id]: getGalleryThumbnails(
				storyBooksList.data?.items || []
			),
			[VIDEO_ORIENTATIONS.TIK_TOK.id]: getGalleryThumbnails(
				trendsVideosList.data?.items || []
			),
		}),
		[
			wideVideoList.data,
			verticalVideoList.data,
			storyBooksList.data,
			trendsVideosList.data,
		]
	);

	const allStories = useMemo(() => {
		return Object.values(segregatedStories).flat().filter(Boolean);
	}, [segregatedStories]);

	const randomStory = useMemo(() => {
		if (allStories.length === 0) return null;
		const randomIndex = Math.floor(Math.random() * allStories.length);
		return allStories[randomIndex];
	}, [allStories]);

	return (
		<div className="flex p-4 flex-col gap-2 grow items-center justify-center">
			{/* # TODO: select at random from the format based on responsiveness */}
			<LibraryHeroSection randomStory={randomStory} />
			<div className="flex max-w-[1440px] w-full flex-col gap-4">
				{Object.values(VIDEO_ORIENTATIONS)
					.filter((orientation) => segregatedStories[orientation.id]?.length)
					.map((orientation) =>
						orientation.id !== VIDEO_ORIENTATIONS.ALL.id &&
						LIBRARY_HOME_GALLERY_DATA[orientation.id] ? (
							<LibraryGalleryComponent
								setSelectedOrientationTab={setSelectedOrientationTab}
								key={orientation.id}
								galleryDetails={LIBRARY_HOME_GALLERY_DATA[orientation.id]!}
								thumbnails={segregatedStories[orientation.id] || []}
								areThumbnailsLoading={[
									wideVideoList,
									verticalVideoList,
									storyBooksList,
									trendsVideosList,
								].some((query) => query.isLoading)}
							/>
						) : null
					)}
			</div>
		</div>
	);
}

export default LibraryHomePage;
