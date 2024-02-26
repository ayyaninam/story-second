import LibraryPage from "@/features/library";
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
import { VIDEO_ORIENTATIONS } from "@/features/library/constants";
import ScenesLayout from "@/features/scenes/components/Layout";
import {getSession} from "@auth0/nextjs-auth0";
import useSaveSessionToken from "@/hooks/useSaveSessionToken";
import {NextSeo} from "next-seo";

function Library({
  session,
	dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const accessToken = session.accessToken as string || "";
	return (
		<HydrationBoundary state={dehydratedState}>
			<NextSeo
				title="Library"
				description="Find your videos, trends, storybooks, all in one place"
			/>
			{/* declare css variables */}
			<style jsx global>{`
				:root {
					--menu-item-border-color: rgba(122, 255, 180, 0.2);
					--menu-item-selected-background-color: radial-gradient(
						88.31% 100% at 0% 50%,
						rgba(48, 149, 136, 0.50) 25.5%, 
						rgba(48, 149, 136, 0.00) 100%
					);
					--menu-item-selected-border-color: rgba(56, 142, 131, 0.20);
					--stepper-box-shadow: 0px 4px 4px 0px rgba(122, 255, 133, 0.4);
				}
			`}</style>
			<LibraryPage accessToken={accessToken} />
		</HydrationBoundary>
	);
}

Library.getLayout = function getLayout(page: ReactElement) {
	return <ScenesLayout pageIndex={2}>{page}</ScenesLayout>;
};

export default Library;

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const session = await getSession(context.req, context.res);
	if (!session) {
		return {
			redirect: {
				destination: '/auth/login?returnTo=' + context.req.url,
				permanent: false,
			},
		};
	}
	const accessToken = session.accessToken || "";
	if (!accessToken) {
		return {
			redirect: {
				destination: '/auth/login?returnTo=' + context.req.url,
				permanent: false,
			},
		};
	}
	const queryClient = new QueryClient();
	const {
		genre: queryGenre,
		page = "1",
		orientation = VIDEO_ORIENTATIONS.ALL.id,
		sort = "desc",
	} = context.query;

	try {
		await queryClient.fetchQuery({
			queryFn: () => api.library.getCategories(),
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
						api.library.getVideos({
							accessToken: accessToken,
							params: {
								PageSize: 7,
								resolution: DisplayAspectRatios["1024x576"],
								CurrentPage: 1,
								topLevelCategory: genre as string,
								storyType: StoryOutputTypes.Video,
								isDescending: isDescending,
							},
						}),
					queryKey: [QueryKeys.WIDE_VIDEOS, genre, isDescending, accessToken],
					staleTime: 3000,
				}),
				queryClient.fetchQuery({
					queryFn: () =>
						api.library.getVideos({
							accessToken: accessToken,
							params: {
								PageSize: 5,
								resolution: DisplayAspectRatios["576x1024"],
								CurrentPage: 1,
								topLevelCategory: genre as string,
								storyType: StoryOutputTypes.Video,
								isDescending: isDescending,
							},
						}),
					queryKey: [QueryKeys.VERTICAL_VIDEOS, genre, isDescending, accessToken],
					staleTime: 3000,
				}),
				queryClient.fetchQuery({
					queryFn: () =>
						api.library.getStoryBooks({
							accessToken: accessToken,
							params: {
								PageSize: 5,
								CurrentPage: 1,
								topLevelCategory: genre as string,
								isDescending: isDescending,
							},
						}),
					queryKey: [QueryKeys.STORY_BOOKS, genre, isDescending, accessToken],
					staleTime: 3000,
				}),
				queryClient.fetchQuery({
					queryFn: () =>
						api.library.getVideos({
							accessToken: accessToken,
							params: {
								PageSize: 5,
								storyType: StoryOutputTypes.SplitScreen,
								CurrentPage: 1,
								topLevelCategory: genre as string,
								isDescending: isDescending,
							},
						}),
					queryKey: [QueryKeys.TIK_TOK, genre, isDescending, accessToken],
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
							accessToken: accessToken,
							params: {
								PageSize: 50,
								...filterOptions,
							},
						});
					}
					if (orientation === VIDEO_ORIENTATIONS.TIK_TOK.id) {
						return api.library.getVideos({
							accessToken: accessToken,
							params: {
								PageSize: 50,
								storyType: StoryOutputTypes.SplitScreen,
								...filterOptions,
							},
						});
					}
					return api.library.getVideos({
						accessToken: accessToken,
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
				queryKey: [QueryKeys.GALLERY, filterOptions, orientation, accessToken],
				staleTime: 3000,
			});
		}
	} catch (error) {
		console.error("Error fetching data", error);
	}

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
			session: {...session},
		},
	};
}
