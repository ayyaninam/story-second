import PublishedStory from "@/features/publish-story";
import api from "@/api";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { StoryOutputTypes } from "@/utils/enums";
import { WebStoryProvider } from "@/features/edit-story/providers/WebstoryContext";
import { getAccessToken, getSession } from "@auth0/nextjs-auth0";
import React, { ReactElement } from "react";
import useSaveSessionToken from "@/hooks/useSaveSessionToken";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";
import { NextSeo } from "next-seo";
import Format from "@/utils/format";
import PageLayout from "@/components/layouts/PageLayout";
import LibraryAccentStyle from "@/features/library/library-accent-style";
import FeedAccentStyle from "@/features/feed/feed-accent-style";

export default function PublishPage({
	storyData,
	session,
	isOwner,
	dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	useSaveSessionToken(session.accessToken);
	return (
		<PageLayout pageIndex={isOwner ? 2 : 0}>
			<HydrationBoundary state={dehydratedState}>
				<NextSeo
					title={storyData?.storyTitle || undefined}
					description={
						storyData?.summary ||
						"Find your videos, trends, storybooks, all in one place"
					}
					openGraph={{
						images: [
							{
								url: storyData?.coverImage
									? Format.GetImageUrl(storyData.coverImage)
									: "/og-assets/og-story.png",
								width: 1200,
								height: 630,
								alt: storyData?.storyTitle || "Story.com",
							},
						],
					}}
				/>
				{isOwner ? <LibraryAccentStyle /> : <FeedAccentStyle />}
				<WebStoryProvider initialValue={storyData}>
					<PublishedStory storyData={storyData} session={session} />
				</WebStoryProvider>
			</HydrationBoundary>
		</PageLayout>
	);
}

// PublishPage.getLayout = function getLayout(page: ReactElement) {
// 	return <PageLayout pageIndex={1}>{page}</PageLayout>;
// };

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	let accessToken: string | undefined = undefined;
	try {
		const tokenResult = await getAccessToken(ctx.req, ctx.res);
		accessToken = tokenResult.accessToken;
	} catch (e) {
		accessToken = undefined;
	}

	// @ts-expect-error Not typing correctly
	const { genre, id } = ctx.params;
	if (!genre || !id) {
		return {
			notFound: true,
		};
	}

	const queryClient = new QueryClient();
	try {
		const user = await queryClient.fetchQuery({
			queryFn: async () => await api.user.getServer(accessToken),
			// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
			queryKey: [QueryKeys.USER],
		});
		console.log(user);
		const storyData = await queryClient.fetchQuery({
			queryFn: async () =>
				await api.video.getStoryServer(
					genre,
					id,
					StoryOutputTypes.Video,
					accessToken
				),
			// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
			queryKey: [QueryKeys.STORY, ctx.resolvedUrl],
		});
		// if (session?.accessToken) {
		// 	await queryClient.prefetchQuery({
		// 		queryFn: async () =>
		// 			await api.webstory.interactions(
		// 				storyData?.id as string,
		// 				session?.accessToken
		// 			),
		// 		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		// 		queryKey: [QueryKeys.INTERACTIONS, ctx.resolvedUrl],
		// 	});
		// }
		const isOwner = user?.data?.id === storyData?.user?.id;
		// const isOwner = false;
		return {
			props: {
				session: { accessToken: accessToken || "" },
				storyData: storyData,
				isOwner: isOwner,
				dehydratedState: dehydrate(queryClient),
			},
		};
	} catch (error: any) {
		return {
			notFound: true,
		};
	}
};
