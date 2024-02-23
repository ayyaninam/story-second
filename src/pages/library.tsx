import LibraryPage from "@/features/library";
import React from "react";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import api from "@/api"; // Ensure this points to your API setup
import { QueryKeys } from "@/lib/queryKeys";
import { DisplayAspectRatios, StoryOutputTypes } from "@/utils/enums";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { VIDEO_ORIENTATIONS } from "@/features/library/constants";

function Library({
	dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<HydrationBoundary state={dehydratedState}>
			<LibraryPage />
		</HydrationBoundary>
	);
}

export default Library;

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const queryClient = new QueryClient();
	const {
		genre: queryGenre,
		page = "1",
		orientation = VIDEO_ORIENTATIONS.ALL.id,
	} = context.query;

	try {
		await queryClient.fetchQuery({
			queryFn: () => api.library.getCategories(),
			queryKey: [QueryKeys.CATEGORIES],
			staleTime: 3000,
		});
	} catch (error) {
		console.error("Error fetching data123", error);
	}

	const categories = queryClient.getQueryData<string[]>([QueryKeys.CATEGORIES]);

	const genre = categories?.includes(queryGenre as string) ? queryGenre : "all";

	try {
		if (orientation === VIDEO_ORIENTATIONS.ALL.id) {
			await Promise.all([
				queryClient.fetchQuery({
					queryFn: () =>
						api.library.getVideos({
							params: {
								PageSize: 7,
								resolution: DisplayAspectRatios["1024x576"],
								CurrentPage: 1,
								topLevelCategory: genre as string,
								storyType: StoryOutputTypes.Video,
							},
						}),
					queryKey: [QueryKeys.WIDE_VIDEOS, genre],
					staleTime: 3000,
				}),
				queryClient.fetchQuery({
					queryFn: () =>
						api.library.getVideos({
							params: {
								PageSize: 5,
								resolution: DisplayAspectRatios["576x1024"],
								CurrentPage: 1,
								topLevelCategory: genre as string,
								storyType: StoryOutputTypes.Video,
							},
						}),
					queryKey: [QueryKeys.VERTICAL_VIDEOS, genre],
					staleTime: 3000,
				}),
				queryClient.fetchQuery({
					queryFn: () =>
						api.library.getStoryBooks({
							params: {
								PageSize: 5,
								CurrentPage: 1,
								topLevelCategory: genre as string,
							},
						}),
					queryKey: [QueryKeys.STORY_BOOKS, genre],
					staleTime: 3000,
				}),
				queryClient.fetchQuery({
					queryFn: () =>
						api.library.getVideos({
							params: {
								PageSize: 5,
								storyType: StoryOutputTypes.SplitScreen,
								CurrentPage: 1,
								topLevelCategory: genre as string,
							},
						}),
					queryKey: [QueryKeys.TIK_TOK, genre],
					staleTime: 3000,
				}),
			]);
		} else {
			const filterOptions = {
				CurrentPage: parseInt(page as string),
				topLevelCategory: genre as string,
				searchTerm: "",
			};
			await queryClient.fetchQuery({
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
				queryKey: [QueryKeys.GALLERY, filterOptions, orientation],
				staleTime: 3000,
			});
		}
	} catch (error) {
		console.error("Error fetching data", error);
	}

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	};
}
