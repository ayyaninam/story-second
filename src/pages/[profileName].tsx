import React, { ReactElement } from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";

import { NextSeo } from "next-seo";

import PageLayout from "@/components/layouts/PageLayout";
import FeedAccentStyle from "@/features/feed/feed-accent-style";
import { getSession } from "@auth0/nextjs-auth0";
import useSaveSessionToken from "@/hooks/useSaveSessionToken";
import UserProfilePage from "@/features/user-feed";
import { fetchUserFeedStories } from "@/utils/fetch-user-stories";
import api from "@/api";

function Feed({
	session,
	dehydratedState,
	userData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	useSaveSessionToken(session.accessToken);

	return (
		<HydrationBoundary state={dehydratedState}>
			<NextSeo
				title={
					`${userData?.name || ""}${userData?.lastName ? " " + userData?.lastName : ""}` ||
					userData.profileName ||
					"User Profile"
				}
				description={`${userData?.bio || ""}`}
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
			<UserProfilePage userData={userData} />
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

	const { genre, profileName } = context.params as {
		genre: string;
		profileName: string;
	};
	const { orientation, page, sort } = context.query as {
		orientation: string;
		page: string;
		sort: string;
	};

	console.log(genre, profileName);

	await fetchUserFeedStories(
		{
			genre,
			orientation,
			page,
			sort,
			profileName,
		},
		queryClient
	);

	const userData = await api.user.getUserProfile(profileName);

	if (!userData) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
			session: { ...session },
			userData,
		},
	};
}
