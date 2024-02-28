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

import { NextSeo } from "next-seo";
import { genreOptions } from "@/constants/feed-constants";
import useSaveSessionToken from "@/hooks/useSaveSessionToken";
import { getServerSideSessionWithRedirect } from "@/utils/auth";

function Explore({
	session,
	dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	useSaveSessionToken(session);
	return (
		<HydrationBoundary state={dehydratedState}>
			<NextSeo
				title="Explore"
				description="Explore our massive colleciton of videos, storybooks, and more"
				openGraph={{
					images: [
						{
							url: "/og-assets/og-explore.png",
							width: 1200,
							height: 630,
							alt: "Explore Story.com",
						},
					],
				}}
			/>
			{/* declare css variables */}
			<style jsx global>{`
				:root {
					--menu-item-border-color: rgba(122, 255, 180, 0.2);
					--menu-item-selected-background-color: radial-gradient(
						88.31% 100% at 0% 50%,
						rgba(102, 129, 255, 0.5) 25.5%,
						rgba(102, 129, 255, 0) 100%
					);
					--menu-item-selected-border-color: rgba(56, 142, 131, 0.2);
					--stepper-box-shadow: 0px 4px 4px 0px rgba(122, 255, 133, 0.4);

					--accent-color-50: #334155;
					--accent-color-100: #e0e7ff;
					--accent-color-200: #c7d2fe;
					--accent-color-300: #a5b4fc;
					--accent-color-400: #818cf8;
					--accent-color-500: #6366f1;
					--accent-color-600: #4f46e5;
					--accent-color-700: #4338ca;
					--accent-color-800: #3730a3;
					--accent-color-900: #312e81;
					--accent-color-950: #1e1b4b;
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

	const session = await getServerSideSessionWithRedirect(
		context.req,
		context.res
	);

	const genre = genreOptions.find((g) => g.id === queryGenre)?.id || "all";

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
								topLevelCategory: genre,
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
								topLevelCategory: genre,
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
								topLevelCategory: genre,
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
								resolution: DisplayAspectRatios["576x1024"],
								CurrentPage: 1,
								topLevelCategory: genre,
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
				topLevelCategory: genre,
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
								resolution: DisplayAspectRatios["576x1024"],
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
			session: { ...session },
		},
	};
}
