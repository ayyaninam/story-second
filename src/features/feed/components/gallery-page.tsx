import React, { useEffect, useMemo } from "react";
import GalleryComponent from "@/components/gallery-components/gallery-component";
import { FeedPageVideoQueryOptions, VideoOrientation } from "@/types";
import {
	EXPLORE_HOME_GALLERY_DATA,
	VIDEO_ORIENTATIONS,
} from "@/constants/feed-constants";
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
import { getGalleryThumbnails } from "@/utils/feed-utils";
import GenericPagination from "@/components/ui/generic-pagination";

function FeedGalleryPage({
	orientation = "wide",
	filterOptions,
}: {
	orientation: VideoOrientation;
	filterOptions: FeedPageVideoQueryOptions;
}) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const currentPage = parseInt((router.query.page as string) || "1");

	const storiesList = useQuery<
		| mainSchema["ReturnWebStoryDTOPagedList"]
		| mainSchema["ReturnVideoStoryDTOPagedList"]
	>({
		queryFn: () => {
			const params = {
				PageSize: 20,
				storyType:
					orientation === VIDEO_ORIENTATIONS.BOOK.id
						? StoryOutputTypes.Story
						: orientation === VIDEO_ORIENTATIONS.TIK_TOK.id
							? StoryOutputTypes.SplitScreen
							: StoryOutputTypes.Video,
				resolution:
					orientation === VIDEO_ORIENTATIONS.WIDE.id
						? DisplayAspectRatios["1024x576"]
						: DisplayAspectRatios["576x1024"],
				...filterOptions,
			};

			return api.feed.getStories({ params });
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

	const galleryDetails = EXPLORE_HOME_GALLERY_DATA[orientation];
	if (!galleryDetails) {
		return null;
	}

	return (
		<div className="flex flex-col gap-4 max-w-[1440px] mx-auto px-3 lg:px-6 p-10">
			<GalleryComponent
				galleryDetails={galleryDetails}
				isIndependentGalleryPage
				thumbnails={galleryThumbnails}
				areThumbnailsLoading={storiesList.isFetching}
			/>
			<GenericPagination
				currentPage={currentPage}
				totalPages={storiesList.data?.totalPages || 0}
			/>
		</div>
	);
}

export default FeedGalleryPage;
