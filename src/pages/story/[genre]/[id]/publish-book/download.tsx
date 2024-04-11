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
import { StoryOutputTypes } from "@/utils/enums";
import LibraryAccentStyle from "@/features/library/library-accent-style";
import FeedAccentStyle from "@/features/feed/feed-accent-style";
import AmazonDownloadPage from "@/features/story/components/amazon-download-page";

export default function DownloadAmazonBook({
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
				<AmazonDownloadPage storyData={storyData} />
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
	const user = await queryClient.fetchQuery({
		queryFn: async () => await api.user.getServer(accessToken),
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.USER],
	});
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
		const amazonBookStoryData = await queryClient.fetchQuery({
			queryFn: async () =>
				await api.amazon.getMetaDataServer({
					id: storyData?.id as string,
					accessToken: accessToken as string,
				}),
			// eslint-disable-next-line @tanstack/query/exhaustive-deps
			queryKey: [QueryKeys.AMAZON_BOOK_METADATA, ctx.resolvedUrl],
		});
		storyData.storyTitle = amazonBookStoryData.data?.title;
		if (storyData.user) {
			storyData.user.name =
				amazonBookStoryData.data?.firstName ||
				"" + amazonBookStoryData.data?.middleName;
			storyData.user.lastName = amazonBookStoryData.data?.lastName;
		}
	} else {
		return {
			redirect: {
				destination: `/auth/login?returnTo=/story/${genre}/${id}/publish-book`,
				permanent: false,
			},
		};
	}
	if (storyData?.user?.id !== user?.data?.id) {
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
			isOwner: user?.data?.id === storyData?.user?.id,
			dehydratedState: dehydrate(queryClient),
		},
	};
};
