import React, { useMemo } from "react";
import FeedGalleryComponent from "@/components/gallery-components/gallery-component";
import {
	FeedPageVideoQueryOptions,
	GalleryData,
	VideoOrientation,
} from "@/types";
import {
	EXPLORE_HOME_GALLERY_DATA,
	VIDEO_ORIENTATIONS,
} from "@/constants/feed-constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mainSchema } from "@/api/schema";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { DisplayAspectRatios, StoryOutputTypes } from "@/utils/enums";
import { getGalleryThumbnails } from "@/utils/feed-utils";

function FeedHomePage({
	setSelectedOrientationTab,
	filterOptions,
}: {
	setSelectedOrientationTab: (orientation: string) => void;
	filterOptions: FeedPageVideoQueryOptions;
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
				api.feed.getStories({
					params: {
						PageSize: 5,
						CurrentPage: 1,
						topLevelCategory: filterOptions.topLevelCategory,
						isDescending: filterOptions.isDescending,
						storyType: storyType,
						resolution: resolution,
					},
				}),
			staleTime: 3000,
			queryKey: [QueryKeys.GALLERY, filterOptions, storyType, resolution],
			initialData: queryClient.getQueryData([
				QueryKeys.GALLERY,
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

	return (
		<div className="flex p-4 flex-col gap-2 grow items-center justify-center">
			{/* Conditional rendering for FeedHeroSection */}
			<div className="flex max-w-[1440px] w-full flex-col gap-4">
				{Object.values(VIDEO_ORIENTATIONS)
					.filter((orientation) => segregatedStories[orientation.id]?.length)
					.map((orientation) =>
						orientation.id !== VIDEO_ORIENTATIONS.ALL.id &&
						EXPLORE_HOME_GALLERY_DATA[orientation.id] ? (
							<FeedGalleryComponent
								setSelectedOrientationTab={setSelectedOrientationTab}
								key={orientation.id}
								galleryDetails={
									EXPLORE_HOME_GALLERY_DATA[
										orientation.id
									] as GalleryData[VideoOrientation]
								}
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

export default FeedHomePage;
