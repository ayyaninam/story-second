import PublishedStory from "@/features/publish-story";
import api from "@/api";
import { mainSchema } from "@/api/schema";
import {
	GetServerSideProps,
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
} from "next";
import { StoryOutputTypes } from "@/utils/enums";
import { WebStoryProvider } from "@/features/edit-story/providers/WebstoryContext";
import { getAccessToken, getSession } from "@auth0/nextjs-auth0";
import { useEffect } from "react";
import { setJwt } from "@/utils/jwt";
import useSaveSessionToken from "@/hooks/useSaveSessionToken";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";

export default function PublishPage({
	storyData,
	session,
	dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	useSaveSessionToken(session);
	return (
		<HydrationBoundary state={dehydratedState}>
			<WebStoryProvider initialValue={storyData}>
				<PublishedStory storyData={storyData} session={session} />
			</WebStoryProvider>
		</HydrationBoundary>
	);
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const session = await getSession(ctx.req, ctx.res);

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
			await api.video.get(genre, id, StoryOutputTypes.SplitScreen),
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.STORY, ctx.resolvedUrl],
	});
	if (session?.accessToken) {
		await queryClient.prefetchQuery({
			queryFn: async () =>
				await api.webstory.interactions(
					storyData?.id as string,
					session?.accessToken
				),
			// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
			queryKey: [QueryKeys.INTERACTIONS, ctx.resolvedUrl],
		});
		await queryClient.prefetchQuery({
			queryFn: async () => await api.user.get(session?.accessToken),
			// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
			queryKey: [QueryKeys.USER],
		});
	}

	return {
		props: {
			session: { ...session },
			storyData,
			dehydratedState: dehydrate(queryClient),
		},
	};
};
