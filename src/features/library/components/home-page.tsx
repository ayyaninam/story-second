import React, {useEffect, useMemo, useState} from "react";
import LibraryHeroSection from "./hero-section";
import LibraryGalleryComponent from "./gallery-component";
import { LibraryPageVideoQueryOptions, VideoOrientation } from "@/types";
import { LIBRARY_HOME_GALLERY_DATA, VIDEO_ORIENTATIONS } from "../constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mainSchema } from "@/api/schema";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { useRouter } from "next/router";
import { DisplayAspectRatios, StoryOutputTypes } from "@/utils/enums";
import { useDebounce } from "usehooks-ts";
import { getGalleryThumbnails } from "../utils";
import {getJwt} from "@/utils/jwt";

function LibraryHomePage({
	setSelectedOrientationTab,
	accessToken,
}: {
	setSelectedOrientationTab: (orientation: string) => void;
	accessToken: string;
}) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const filterOptions = useDebounce(
		useMemo<LibraryPageVideoQueryOptions>(() => {
			const page = (router.query.page as string) || "1";
			const sort = router.query.sort as string || "desc";
			return {
				CurrentPage: parseInt(page),
				topLevelCategory: router.query.genre as string || "all",
				isDescending: sort === "desc",
			};
		}, [router.query.page, router.query.genre, router.query.sort, accessToken]),
		500
	);

	const wideVideoList = useQuery<mainSchema["ReturnVideoStoryDTOPagedList"]>({
		queryFn: () =>
			api.library.getVideos({
				accessToken,
				params: {
					PageSize: 7,
					storyType: StoryOutputTypes.Video,
					resolution: DisplayAspectRatios["1024x576"],
					CurrentPage: 1,
					topLevelCategory: filterOptions.topLevelCategory,
					isDescending: filterOptions.isDescending,
				},
			}),
		staleTime: 3000,
		queryKey: [QueryKeys.WIDE_VIDEOS, filterOptions.topLevelCategory, filterOptions.isDescending, accessToken],
		initialData: queryClient.getQueryData([
			QueryKeys.WIDE_VIDEOS,
			filterOptions.topLevelCategory,
			filterOptions.isDescending,
		]),
	});

	const verticalVideoList = useQuery<
		mainSchema["ReturnVideoStoryDTOPagedList"]
	>({
		queryFn: () =>
			api.library.getVideos({
				accessToken,
				params: {
					PageSize: 5,
					storyType: StoryOutputTypes.Video,
					resolution: DisplayAspectRatios["576x1024"],
					CurrentPage: 1,
					topLevelCategory: filterOptions.topLevelCategory,
					isDescending: filterOptions.isDescending,
				},
			}),
		staleTime: 3000,
		queryKey: [QueryKeys.VERTICAL_VIDEOS, filterOptions.topLevelCategory, filterOptions.isDescending, accessToken],
		initialData: queryClient.getQueryData([
			QueryKeys.VERTICAL_VIDEOS,
			filterOptions.topLevelCategory,
			filterOptions.isDescending,
		]),
	});

	const storyBooksList = useQuery<mainSchema["ReturnWebStoryDTOPagedList"]>({
		queryFn: () =>
			api.library.getStoryBooks({
				accessToken,
				params: {
					PageSize: 5,
					CurrentPage: 1,
					topLevelCategory: filterOptions.topLevelCategory,
					isDescending: filterOptions.isDescending,
				},
			}),
		staleTime: 3000,
		queryKey: [QueryKeys.STORY_BOOKS, filterOptions.topLevelCategory, filterOptions.isDescending, accessToken],
		initialData: queryClient.getQueryData([
			QueryKeys.STORY_BOOKS,
			filterOptions.topLevelCategory,
			filterOptions.isDescending,
		]),
	});

	const trendsVideosList = useQuery<mainSchema["ReturnVideoStoryDTOPagedList"]>(
		{
			queryFn: () =>
				api.library.getVideos({
					accessToken,
					params: {
						PageSize: 5,
						storyType: StoryOutputTypes.SplitScreen,
						resolution: DisplayAspectRatios["576x1024"],
						CurrentPage: 1,
						topLevelCategory: filterOptions.topLevelCategory,
						isDescending: filterOptions.isDescending,
					},
				}),
			staleTime: 3000,
			queryKey: [QueryKeys.TIK_TOK, filterOptions.topLevelCategory, filterOptions.isDescending, accessToken],
			initialData: queryClient.getQueryData([
				QueryKeys.TIK_TOK,
				filterOptions.topLevelCategory,
				filterOptions.isDescending,
			]),
		}
	);

	const segregatedStories = useMemo(() => {
		const segregatedStories = {
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
		};
		return segregatedStories;
	}, [wideVideoList.data, verticalVideoList.data, storyBooksList.data]);

	return (
		<div className="flex p-4 flex-col gap-2 grow items-center justify-center">
			{/* # TODO: select at random from the format based on responsiveness */}
			<LibraryHeroSection
				randomThumbnail={segregatedStories[VIDEO_ORIENTATIONS.WIDE.id]?.[0]?.thumbnail}
			/>
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
