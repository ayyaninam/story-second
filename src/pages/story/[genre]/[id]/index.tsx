import api from "@/api";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getAccessToken } from "@auth0/nextjs-auth0";
import React from "react";
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
import StoryBookPage from "@/features/story/story-page";
import { StoryOutputTypes } from "@/utils/enums";
import LibraryAccentStyle from "@/features/library/library-accent-style";
import FeedAccentStyle from "@/features/feed/feed-accent-style";
import { Book, WithContext } from "schema-dts";

export default function PublishPage({
	storyData,
	session,
	dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	useSaveSessionToken(session.accessToken);
	const jsonLd: WithContext<Book> = {
		"@context": "https://schema.org",
		"@type": "Book",
		name: storyData.storyTitle!,
		description: storyData.summary!,
		thumbnailUrl: Format.GetImageUrl(storyData.coverImage!),
		numberOfPages: storyData.scenes?.reduce(
			(total, scene) => total + (scene.storySegments?.length || 0),
			0
		),
		bookFormat: "https://schema.org/EBook",
		illustrator: "https://story.com/" + storyData.user!.profileName,
	};
	return (
		<PageLayout pageIndex={storyData.canEdit ? 2 : 0}>
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
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
				{storyData.canEdit ? <LibraryAccentStyle /> : <FeedAccentStyle />}
				<StoryBookPage storyData={storyData} session={session} />
			</HydrationBoundary>
		</PageLayout>
	);
}

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

	return {
		props: {
			session: { accessToken: accessToken || "" },
			storyData: storyData || null,
			dehydratedState: dehydrate(queryClient),
		},
	};
};
