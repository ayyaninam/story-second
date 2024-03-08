import React, { useEffect, useMemo } from "react";
import FeedGalleryComponent from "./gallery-component";
import { FeedPageVideoQueryOptions, VideoOrientation } from "@/types";
import { EXPLORE_HOME_GALLERY_DATA, VIDEO_ORIENTATIONS } from "../constants";
import { DisplayAspectRatios, StoryOutputTypes } from "@/utils/enums";
import {
	keepPreviousData,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { mainSchema } from "@/api/schema";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { useRouter } from "next/router";
import { useDebounce } from "usehooks-ts";
import { getGalleryThumbnails } from "../utils";
import GenericPagination from "@/components/ui/generic-pagination";

function FeedGalleryPage({
	orientation = "wide",
}: {
	orientation: VideoOrientation;
}) {
	const router = useRouter();
	const galleryDetails = EXPLORE_HOME_GALLERY_DATA[orientation];
	const queryClient = useQueryClient();
	const currentPage = parseInt((router.query.page as string) || "1");

	const filterOptions = useDebounce(
		useMemo<FeedPageVideoQueryOptions>(() => {
			const page = (router.query.page as string) || "1";
			const sort = (router.query.sort as string) || "desc";
			return {
				CurrentPage: parseInt(page),
				topLevelCategory: (router.query.genre as string) || "all",
				isDescending: sort === "desc",
			};
		}, [router.query.page, router.query.genre, router.query.sort]),
		500
	);
	const storiesList = useQuery<
		| mainSchema["ReturnWebStoryDTOPagedList"]
		| mainSchema["ReturnVideoStoryDTOPagedList"]
	>({
		queryFn: () => {
			if (orientation === VIDEO_ORIENTATIONS.BOOK.id) {
				return api.feed.getStoryBooks({
					params: {
						PageSize: 20,
						...filterOptions,
					},
				});
			}
			if (orientation === VIDEO_ORIENTATIONS.TIK_TOK.id) {
				return api.feed.getVideos({
					params: {
						PageSize: 20,
						storyType: StoryOutputTypes.SplitScreen,
						resolution: DisplayAspectRatios["576x1024"],
						...filterOptions,
					},
				});
			}
			return api.feed.getVideos({
				params: {
					PageSize: 20,
					storyType: StoryOutputTypes.Video,
					resolution:
						orientation === VIDEO_ORIENTATIONS.WIDE.id
							? DisplayAspectRatios["1024x576"]
							: DisplayAspectRatios["576x1024"],
					...filterOptions,
				},
			});
		},
		staleTime: 3000,
		queryKey: [QueryKeys.GALLERY, filterOptions, orientation],
		initialData: queryClient.getQueryData([
			QueryKeys.GALLERY,
			filterOptions,
			orientation,
		]),
		placeholderData: keepPreviousData,
	});

	const galleryThumbnails = useMemo(
		() =>
			getGalleryThumbnails(
				storiesList.data?.items || [],
				orientation === VIDEO_ORIENTATIONS.WIDE.id
			),
		[storiesList.data?.items, orientation]
	);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [currentPage]);

	if (!galleryDetails) {
		return null;
	}

	return (
		<div className="flex flex-col gap-4 max-w-[1440px] mx-auto px-3 lg:px-6 p-10">
			<FeedGalleryComponent
				galleryDetails={galleryDetails}
				isIndependentGalleryPage
				thumbnails={galleryThumbnails}
				areThumbnailsLoading={storiesList.isPending || storiesList.isFetching}
			/>
			<GenericPagination
				currentPage={currentPage}
				totalPages={storiesList.data?.totalPages || 0}
			/>
		</div>
	);
}

export default FeedGalleryPage;
