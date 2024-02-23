import React, { useEffect, useMemo } from "react";
import LibraryGalleryComponent from "./gallery-component";
import { LibraryPageVideoQueryOptions, VideoOrientation } from "@/types";
import { LIBRARY_HOME_GALLERY_DATA, VIDEO_ORIENTATIONS } from "../constants";
import { DisplayAspectRatios, StoryOutputTypes } from "@/utils/enums";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mainSchema } from "@/api/schema";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { useRouter } from "next/router";
import { useDebounce } from "usehooks-ts";
import { getGalleryThumbnails } from "../utils";

function LibraryGalleryPage({
	orientation = "wide",
	searchTerm,
}: {
	orientation: VideoOrientation;
	searchTerm: string;
}) {
	const router = useRouter();
	const galleryDetails = LIBRARY_HOME_GALLERY_DATA[orientation];
	const queryClient = useQueryClient();

	const filterOptions = useDebounce(
		useMemo<LibraryPageVideoQueryOptions>(() => {
			const page = (router.query.page as string) || "1";
			return {
				CurrentPage: parseInt(page),
				topLevelCategory: router.query.genre as string,
				searchTerm,
			};
		}, [router.query.page, router.query.genre, searchTerm]),
		500
	);
	const StoriesList = useQuery<
		| mainSchema["ReturnWebStoryDTOPagedList"]
		| mainSchema["ReturnVideoStoryDTOPagedList"]
	>({
		queryFn: () => {
			if (orientation === VIDEO_ORIENTATIONS.BOOK.id) {
				return api.library.getStoryBooks({
					params: {
						PageSize: 50,
						...filterOptions,
					},
				});
			}
			if (orientation === VIDEO_ORIENTATIONS.TIK_TOK.id) {
				return api.library.getVideos({
					params: {
						PageSize: 50,
						storyType: StoryOutputTypes.SplitScreen,
						...filterOptions,
					},
				});
			}
			return api.library.getVideos({
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
		queryKey: [QueryKeys.GALLERY, filterOptions, orientation],
		initialData: queryClient.getQueryData([
			QueryKeys.GALLERY,
			filterOptions,
			orientation,
		]),
	});

	const galleryThumbnails = useMemo(
		() =>
			getGalleryThumbnails(
				StoriesList.data?.items || [],
				orientation === VIDEO_ORIENTATIONS.WIDE.id
			),
		[StoriesList.data?.items, orientation]
	);

	if (!galleryDetails) {
		return null;
	}

	return (
		<div className="flex flex-col gap-4 max-w-[1440px] mx-auto px-6 pt-10">
			<LibraryGalleryComponent
				galleryDetails={galleryDetails}
				isIndependentGalleryPage
				thumbnails={galleryThumbnails}
			/>
		</div>
	);
}

export default LibraryGalleryPage;
