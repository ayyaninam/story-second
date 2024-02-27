import api from "@/api";
import { mainSchema } from "@/api/schema";
import { env } from "@/env.mjs";
import EditStory from "@/features/edit-story";
import { WebStoryProvider } from "@/features/edit-story/providers/WebstoryContext";
import StoryScenes from "@/features/scenes/ScenesLayout";
import ScenesLayout from "@/features/scenes/components/Layout";
import useSaveSessionToken from "@/hooks/useSaveSessionToken";
import { QueryKeys } from "@/lib/queryKeys";
import Routes from "@/routes";
import { AuthError, getServerSideSessionWithRedirect } from "@/utils/auth";
import { StoryOutputTypes } from "@/utils/enums";
import {
	getAccessToken,
	getSession,
	withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import {
	GetServerSideProps,
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
} from "next";
import { ReactElement } from "react";

const ScenesPage = ({
	dehydratedState,
	session,
	storyData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	useSaveSessionToken(session);

	return (
		<WebStoryProvider initialValue={storyData}>
			<StoryScenes />
		</WebStoryProvider>
	);
};

ScenesPage.getLayout = function getLayout(page: ReactElement) {
	return <ScenesLayout>{page}</ScenesLayout>;
};

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
	}

	return {
		props: {
			session: { ...session },
			storyData,
			dehydratedState: dehydrate(queryClient),
		},
	};
};

export default ScenesPage;
