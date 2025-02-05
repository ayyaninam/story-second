import PublishedStory from "@/features/publish-story";
import api from "@/api";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { StoryOutputTypes } from "@/utils/enums";
import { WebStoryProvider } from "@/features/edit-story/providers/WebstoryContext";
import { getAccessToken } from "@auth0/nextjs-auth0";
import React from "react";
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
import { Book, VideoObject, WithContext } from "schema-dts";

export default function PublishPage({
	storyData,
	session,
	dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	useSaveSessionToken(session.accessToken);

	const jsonLd: WithContext<VideoObject> = {
		"@context": "https://schema.org",
		"@type": "VideoObject",
		name: storyData.storyTitle!,
		description: storyData.summary!,
		thumbnailUrl: Format.GetImageUrl(storyData.coverImage!),
		uploadDate: storyData.created,
		contentUrl: storyData.renderedVideoKey
			? storyData.renderedVideoKey
			: `https://story.com/video/${storyData.topLevelCategory}/${storyData.id}`,
		transcript: storyData.scenes
			?.map((scene) =>
				scene.videoSegments?.map((segment) => segment.textContent).join(" ")
			)
			.join("\n"),
		director: "https://story.com/" + storyData.user!.profileName,
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
				<WebStoryProvider initialValue={storyData}>
					<PublishedStory storyData={storyData} session={session} />
				</WebStoryProvider>
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
	try {
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
		return {
			props: {
				session: { accessToken: accessToken || "" },
				storyData: storyData,
				dehydratedState: dehydrate(queryClient),
			},
		};
	} catch (error: any) {
		return {
			notFound: true,
		};
	}
};
