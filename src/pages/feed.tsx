import React, { ReactElement } from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";

import { NextSeo } from "next-seo";

import FeedPage from "@/features/feed";
import PageLayout from "@/components/layouts/PageLayout";
import FeedAccentStyle from "@/features/feed/feed-accent-style";
import { fetchFeedStories } from "@/utils/fetch-feed-stories";
import { getSession } from "@auth0/nextjs-auth0";
import useSaveSessionToken from "@/hooks/useSaveSessionToken";

function Feed({
	session,
	dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	useSaveSessionToken(session.accessToken);

	return (
		<HydrationBoundary state={dehydratedState}>
			<NextSeo
				title="Feed"
				description="Feed our massive colleciton of videos, storybooks, and more"
				openGraph={{
					images: [
						{
							url: "/og-assets/og-feed.png",
							width: 1200,
							height: 630,
							alt: "Feed Story.com",
						},
					],
				}}
			/>
			<FeedAccentStyle />
			<FeedPage />
		</HydrationBoundary>
	);
}

Feed.getLayout = function getLayout(page: ReactElement) {
	return <PageLayout pageIndex={0}>{page}</PageLayout>;
};

export default Feed;

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const queryClient = new QueryClient();
	const session = await getSession(context.req, context.res);

	const { genre, orientation, page, sort } = context.query as {
		genre: string;
		orientation: string;
		page: string;
		sort: string;
	};

	await fetchFeedStories(
		{
			genre,
			orientation,
			page,
			sort,
		},
		queryClient,
		true
	);

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
			session: { ...session },
		},
	};
}
