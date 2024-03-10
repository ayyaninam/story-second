import api from "@/api";
import { mainSchema } from "@/api/schema";
import { WebStoryProvider } from "@/features/edit-story/providers/WebstoryContext";
import ScenesLayout from "@/features/scenes/ScenesLayout";
import ScriptLayout from "@/features/scenes/ScriptLayout";
import StoryboardLayout from "@/features/scenes/StoryboardLayout";
import PageLayout from "@/components/layouts/PageLayout";
import editStoryReducer, {
	EditStoryAction,
	EditStoryDraft,
} from "@/features/scenes/reducers/edit-reducer";
import {
	WebstoryToStoryDraft,
	filterSelectedKeysFromObject,
	getAllTextsFromVideoStory,
	getEverythingExceptTextFromVideoStory,
} from "@/features/scenes/utils/storydraft";
import useSaveSessionToken from "@/hooks/useSaveSessionToken";
import { QueryKeys } from "@/lib/queryKeys";
import { StoryOutputTypes } from "@/utils/enums";
import {
	getAccessToken,
	getSession,
	withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import {
	QueryClient,
	dehydrate,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect } from "react";
import { useImmerReducer } from "use-immer";
import EditAccentStyle from "@/features/scenes/edit-accent-style";
import Script from "next/script";

const EditorPage = ({
	session,
	storyData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	useSaveSessionToken(session.accessToken);
	const router = useRouter();

	const Webstory = useQuery<mainSchema["ReturnVideoStoryDTO"]>({
		queryFn: () =>
			api.video.get(
				router.query.genre!.toString(),
				router.query.id!.toString(),
				storyData.storyType,
				true
			),
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.STORY, router.asPath],
		initialData: storyData,
		refetchInterval: 1000,
		// Disable once all the videoKeys are obtained
	});

	const [story, dispatch] = useImmerReducer<EditStoryDraft, EditStoryAction>(
		editStoryReducer,
		WebstoryToStoryDraft(Webstory.data!)
	);

	useEffect(() => {
		console.log("updated");
		dispatch({
			type: "reset_text",
			draft: WebstoryToStoryDraft(Webstory.data!),
		});
	}, [getAllTextsFromVideoStory(Webstory.data!)]);

	useEffect(() => {
		console.log(
			"updated123",
			getEverythingExceptTextFromVideoStory(Webstory.data!)
		);
		dispatch({
			type: "reset_all_except_text",
			draft: WebstoryToStoryDraft(Webstory.data!),
		});
	}, [getEverythingExceptTextFromVideoStory(Webstory.data!)]);

	if (router.query.editor === "script") {
		return (
			<WebStoryProvider initialValue={storyData}>
				<Script id={"intercom-editor"}>
					{`
            window.intercomSettings = {
              hide_default_launcher: true,
            };
          `}
				</Script>
				<EditAccentStyle />
				<ScriptLayout {...{ story, dispatch }} />
			</WebStoryProvider>
		);
	} else if (router.query.editor === "storyboard") {
		return (
			<WebStoryProvider initialValue={storyData}>
				<EditAccentStyle />
				<StoryboardLayout {...{ story, dispatch }} />
			</WebStoryProvider>
		);
	} else if (router.query.editor === "scenes") {
		return (
			<WebStoryProvider initialValue={storyData}>
				<EditAccentStyle />
				<ScenesLayout {...{ story, dispatch }} />
			</WebStoryProvider>
		);
	}
	return notFound();
};

EditorPage.getLayout = function getLayout(page: ReactElement) {
	return <PageLayout pageIndex={1}>{page}</PageLayout>;
};

export const getServerSideProps = withPageAuthRequired({
	getServerSideProps: async (ctx: GetServerSidePropsContext) => {
		const { accessToken } = await getAccessToken(ctx.req, ctx.res);

		// @ts-expect-error Not typing correctly
		const { genre, id, editor } = ctx.params;
		if (!genre || !id || !["scenes", "script", "storyboard"].includes(editor)) {
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
					StoryOutputTypes.Video,
					accessToken
				),
			// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
			queryKey: [QueryKeys.STORY, ctx.resolvedUrl],
		});
		// if (accessToken) {
		// 	await queryClient.prefetchQuery({
		// 		queryFn: async () =>
		// 			await api.webstory.interactions(storyData?.id as string, accessToken),
		// 		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		// 		queryKey: [QueryKeys.INTERACTIONS, ctx.resolvedUrl],
		// 	});
		// }

		if (!storyData) {
			return {
				notFound: true,
			};
		}

		return {
			props: {
				session: { accessToken: accessToken },
				storyData: storyData,
			},
		};
	},
});
