import React, { useEffect, useMemo } from "react";
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
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

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
	const currentPage = parseInt((router.query.page as string) || "1");

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
	const storiesList = useQuery<
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
			<Pagination>
				<PaginationContent>
					{currentPage > 1 && (
						<PaginationItem>
							<PaginationPrevious
								onClick={() => {
									router.push({
										query: {
											...router.query,
											page: currentPage - 1,
										},
									});
								}}
							/>
						</PaginationItem>
					)}
					{/* useEllipses when too many pages between */}
					{currentPage > 2 ? (
						<>
							<PaginationItem>
								<PaginationLink
									onClick={() => {
										router.push({
											query: {
												...router.query,
												page: 1,
											},
										});
									}}
								>
									1
								</PaginationLink>
							</PaginationItem>
							{currentPage !== 3 && (
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
							)}
						</>
					) : null}
					{Array.from({ length: 3 }, (_, i) => {
						const pageNumber = currentPage - 1 + i;
						if (
							pageNumber >= 1 &&
							pageNumber <= (storiesList.data?.totalPages || 0)
						) {
							return (
								<PaginationItem key={pageNumber}>
									<PaginationLink
										onClick={() => {
											router.push(
												{
													query: {
														...router.query,
														page: pageNumber,
													},
												},
												undefined,
												{ shallow: true }
											);
										}}
									>
										{pageNumber}
									</PaginationLink>
								</PaginationItem>
							);
						}
					})}
					{currentPage < (storiesList.data?.totalPages || 0) - 1 ? (
						<>
							{currentPage !== (storiesList.data?.totalPages || 0) - 2 && (
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
							)}
							<PaginationItem>
								<PaginationLink
									onClick={() => {
										router.push(
											{
												query: {
													...router.query,
													page: storiesList.data?.totalPages,
												},
											},
											undefined,
											{ shallow: true }
										);
									}}
								>
									{storiesList.data?.totalPages}
								</PaginationLink>
							</PaginationItem>
						</>
					) : null}
					{currentPage < (storiesList.data?.totalPages || 0) && (
						<PaginationItem>
							<PaginationNext
								onClick={() => {
									router.push(
										{
											query: {
												...router.query,
												page: currentPage + 1,
											},
										},
										undefined,
										{ shallow: true }
									);
								}}
							/>
						</PaginationItem>
					)}
				</PaginationContent>
			</Pagination>
		</div>
	);
}

export default LibraryGalleryPage;
