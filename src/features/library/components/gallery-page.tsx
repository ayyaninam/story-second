import React, {useEffect, useMemo, useState} from "react";
import LibraryGalleryComponent from "./gallery-component";
import { LibraryPageVideoQueryOptions, VideoOrientation } from "@/types";
import { LIBRARY_HOME_GALLERY_DATA, VIDEO_ORIENTATIONS } from "../constants";
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
import {getJwt} from "@/utils/jwt";

function LibraryGalleryPage({
	orientation = "wide",
	searchTerm,
	accessToken,
}: {
	orientation: VideoOrientation;
	searchTerm: string;
	accessToken: string;
}) {
	const router = useRouter();
	const galleryDetails = LIBRARY_HOME_GALLERY_DATA[orientation];
	const queryClient = useQueryClient();
	const currentPage = parseInt((router.query.page as string) || "1");

	const filterOptions = useDebounce(
		useMemo<LibraryPageVideoQueryOptions>(() => {
			const page = (router.query.page as string) || "1";
			const sort = router.query.sort as string || "desc"
			return {
				CurrentPage: parseInt(page),
				topLevelCategory: router.query.genre as string,
				searchTerm,
				isDescending: sort === "desc",
			};
		}, [router.query.page, router.query.genre, searchTerm, router.query.sort]),
		500
	);
	const storiesList = useQuery<
		| mainSchema["ReturnWebStoryDTOPagedList"]
		| mainSchema["ReturnVideoStoryDTOPagedList"]
	>({
		queryFn: () => {
			if (orientation === VIDEO_ORIENTATIONS.BOOK.id) {
				return api.library.getStoryBooks({
					accessToken,
					params: {
						PageSize: 50,
						...filterOptions,
					},
				});
			}
			if (orientation === VIDEO_ORIENTATIONS.TIK_TOK.id) {
				return api.library.getVideos({
					accessToken,
					params: {
						PageSize: 50,
						storyType: StoryOutputTypes.SplitScreen,
						...filterOptions,
					},
				});
			}
			return api.library.getVideos({
				accessToken,
				params: {
					PageSize: 50,
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
		queryKey: [QueryKeys.GALLERY, filterOptions, orientation, accessToken],
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
		<div className="flex flex-col gap-4 max-w-[1440px] mx-auto px-6 p-10">
			<LibraryGalleryComponent
				galleryDetails={galleryDetails}
				isIndependentGalleryPage
				thumbnails={galleryThumbnails}
				areThumbnailsLoading={storiesList.isPending || storiesList.isFetching}
			/>
			<GenericPagination currentPage={currentPage} totalPages={storiesList.data?.totalPages || 0} />
		</div>
	);
}

export default LibraryGalleryPage;
