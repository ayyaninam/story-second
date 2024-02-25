import ExplorePage from "@/features/explore";
import React, { ReactElement } from "react";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { DisplayAspectRatios, StoryOutputTypes } from "@/utils/enums";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { VIDEO_ORIENTATIONS } from "@/features/explore/constants";
import PageLayout from "@/components/layouts/PageLayout";

function Explore({
	dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<HydrationBoundary state={dehydratedState}>
			{/* declare css variables */}
			<style jsx global>{`
				:root {
					--menu-item-border-color: rgba(122, 255, 180, 0.2);
					--menu-item-selected-background-color: radial-gradient(
						88.31% 100% at 0% 50%, 
						rgba(102, 129, 255, 0.50) 25.5%, 
						rgba(102, 129, 255, 0.00) 100%
					);
					--menu-item-selected-border-color: rgba(56, 142, 131, 0.20);
					--stepper-box-shadow: 0px 4px 4px 0px rgba(122, 255, 133, 0.4);
				}
			`}</style>
			<ExplorePage />
		</HydrationBoundary>
	);
}

Explore.getLayout = function getLayout(page: ReactElement) {
	return <PageLayout pageIndex={0}>{page}</PageLayout>;
};

export default Explore;

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const queryClient = new QueryClient();
	const {
		genre: queryGenre,
		page = "1",
		orientation = VIDEO_ORIENTATIONS.ALL.id,
		sort = "desc",
	} = context.query;

	try {
		await queryClient.fetchQuery({
			queryFn: () => api.explore.getCategories(),
			queryKey: [QueryKeys.CATEGORIES],
			staleTime: 3000,
		});
	} catch (error) {
		console.error("Error fetching data", error);
	}

	const categories = queryClient.getQueryData<string[]>([QueryKeys.CATEGORIES]);

	const genre = categories?.includes(queryGenre as string) ? queryGenre as string: "all";

	const isDescending = sort === "desc";

	try {
		if (orientation === VIDEO_ORIENTATIONS.ALL.id) {
			await Promise.all([
				queryClient.fetchQuery({
					queryFn: () =>
						api.explore.getVideos({
							params: {
								PageSize: 7,
								resolution: DisplayAspectRatios["1024x576"],
								CurrentPage: 1,
								topLevelCategory: genre as string,
								storyType: StoryOutputTypes.Video,
								isDescending: isDescending,
							},
						}),
					queryKey: [QueryKeys.WIDE_VIDEOS, genre, isDescending],
					staleTime: 3000,
				}),
				queryClient.fetchQuery({
					queryFn: () =>
						api.explore.getVideos({
							params: {
								PageSize: 5,
								resolution: DisplayAspectRatios["576x1024"],
								CurrentPage: 1,
								topLevelCategory: genre as string,
								storyType: StoryOutputTypes.Video,
								isDescending: isDescending,
							},
						}),
					queryKey: [QueryKeys.VERTICAL_VIDEOS, genre, isDescending],
					staleTime: 3000,
				}),
				queryClient.fetchQuery({
					queryFn: () =>
						api.explore.getStoryBooks({
							params: {
								PageSize: 5,
								CurrentPage: 1,
								topLevelCategory: genre as string,
								isDescending: isDescending,
							},
						}),
					queryKey: [QueryKeys.STORY_BOOKS, genre, isDescending],
					staleTime: 3000,
				}),
				queryClient.fetchQuery({
					queryFn: () =>
						api.explore.getVideos({
							params: {
								PageSize: 5,
								storyType: StoryOutputTypes.SplitScreen,
								CurrentPage: 1,
								topLevelCategory: genre as string,
								isDescending: isDescending,
							},
						}),
					queryKey: [QueryKeys.TIK_TOK, genre, isDescending],
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
						return api.explore.getStoryBooks({
							params: {
								PageSize: 50,
								...filterOptions,
							},
						});
					}
					if (orientation === VIDEO_ORIENTATIONS.TIK_TOK.id) {
						return api.explore.getVideos({
							params: {
								PageSize: 50,
								storyType: StoryOutputTypes.SplitScreen,
								...filterOptions,
							},
						});
					}
					return api.explore.getVideos({
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
