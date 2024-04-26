import api from "@/api";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getAccessToken } from "@auth0/nextjs-auth0";
import React, { ReactElement } from "react";
import useSaveSessionToken from "@/hooks/useSaveSessionToken";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";
import Format from "@/utils/format";
import { NextSeo } from "next-seo";
import PageLayout from "@/components/layouts/PageLayout";
import { StoryOutputTypes } from "@/utils/enums";
import LibraryAccentStyle from "@/features/library/library-accent-style";
import FeedAccentStyle from "@/features/feed/feed-accent-style";
import AmazonPublishForm from "@/features/story/components/amazon-publish-form";
import AmazonConfirmPage from "@/features/story/components/amazon-confirm-page";

export default function PublishBook({
	storyData,
	session,
	dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	useSaveSessionToken(session.accessToken);
	return (
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
			<LibraryAccentStyle />
			<AmazonConfirmPage storyData={storyData} />
		</HydrationBoundary>
	);
}

PublishBook.getLayout = function getLayout(page: ReactElement) {
	return <PageLayout pageIndex={2}>{page}</PageLayout>;
};

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

	const storyData = await queryClient.fetchQuery({
		queryFn: async () =>
			await api.video.getStoryServer(
				genre,
				id,
				StoryOutputTypes.Story,
				accessToken
			),
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.STORY, ctx.resolvedUrl],
	});
	if (accessToken) {
		await queryClient.prefetchQuery({
			queryFn: async () =>
				await api.webstory.interactions(storyData?.id as string, accessToken),
			// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
			queryKey: [QueryKeys.INTERACTIONS, ctx.resolvedUrl],
		});
		await queryClient.prefetchQuery({
			queryFn: async () => await api.user.get(),
			// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
			queryKey: [QueryKeys.USER],
		});
	} else {
		return {
			redirect: {
				destination: `/auth/login?returnTo=/story/${genre}/${id}/publish-book`,
				permanent: false,
			},
		};
	}
	if (!storyData?.canEdit) {
		return {
			redirect: {
				destination: `/story/${genre}/${id}`,
				permanent: false,
			},
		};
	}
	return {
		props: {
			session: { accessToken: accessToken || "" },
			storyData: storyData || null,
			dehydratedState: dehydrate(queryClient),
		},
	};
};
