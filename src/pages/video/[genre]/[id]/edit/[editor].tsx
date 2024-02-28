import api from "@/api";
import { mainSchema } from "@/api/schema";
import { env } from "@/env.mjs";
import EditStory from "@/features/edit-story";
import { WebStoryProvider } from "@/features/edit-story/providers/WebstoryContext";
import StoryScenes from "@/features/scenes/ScenesLayout";
import ScriptLayout from "@/features/scenes/ScriptLayout";
import EditScript from "@/features/scenes/StoryboardLayout";
import ScenesLayout from "@/features/scenes/components/Layout";
import editStoryReducer, {
	EditStoryAction,
	EditStoryDraft,
} from "@/features/scenes/reducers/edit-reducer";
import {
	GenerateSceneDiff,
	GenerateStoryDiff,
	WebstoryToStoryDraft,
} from "@/features/scenes/utils/storydraft";
import useSaveSessionToken from "@/hooks/useSaveSessionToken";
import { QueryKeys } from "@/lib/queryKeys";
import Routes from "@/routes";
import { SceneModificationData, SegmentModificationData } from "@/types";
import { AuthError, getServerSideSessionWithRedirect } from "@/utils/auth";
import {
	SceneModifications,
	SegmentModifications,
	StoryOutputTypes,
} from "@/utils/enums";
import {
	getAccessToken,
	getSession,
	withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import {
	QueryClient,
	dehydrate,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	GetServerSideProps,
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
} from "next";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import { useImmerReducer } from "use-immer";

const EditorPage = ({
	dehydratedState,
	session,
	storyData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	useSaveSessionToken(session);
	const router = useRouter();
	const queryClient = useQueryClient();

	const Webstory = useQuery<mainSchema["ReturnVideoStoryDTO"]>({
		queryFn: () =>
			api.video.get(
				router.query.genre!.toString(),
				router.query.id!.toString(),
				storyData.storyType
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

	const EditSegment = useMutation({
		mutationFn: api.video.editSegment,
	});

	const handleSubmitEditScenesAndSegments = async () => {
		const sceneDiff = GenerateSceneDiff(
			WebstoryToStoryDraft(Webstory.data),
			story
		);

		const segmentDiff = GenerateStoryDiff(
			WebstoryToStoryDraft(Webstory.data),
			story
		);
		// return { sceneDiff, segmentDiff };

		const sceneEdits: SceneModificationData[] = sceneDiff.edits.map((el) => {
			return {
				details: {
					Ind: el.index,
					SceneDescription: el.description,
				},
				operation: SceneModifications.Edit,
			};
		});
		const sceneAdditions: SceneModificationData[] = sceneDiff.additions.map(
			(el) => {
				return {
					details: {
						Ind: el.index,
						SceneDescription: el.description,
					},
					operation: SegmentModifications.Edit,
				};
			}
		);
		await api.video.editScenes({
			story_id: Webstory.data?.id as string,
			story_type: Webstory.data?.storyType,
			edits: [{}],
		});

		// Generate new scenes

		// Create a map between oldscenes and newscenes
		// Iterate through all addition segments and replace sceneId with mapped sceneId
	};

	const handleSubmitEditSegments = async () => {
		const diff = GenerateStoryDiff(WebstoryToStoryDraft(Webstory.data), story);
		console.log(diff);
		const edits: SegmentModificationData[] = diff.edits.map((segment) => ({
			details: { Ind: segment.id, Text: segment.textContent },
			operation: SegmentModifications.Edit,
		}));
		const additions: SegmentModificationData[] = diff.additions
			.filter((segmentSet) => segmentSet.length > 0)
			.map((segmentSet) => ({
				details: {
					// @ts-ignore should be defined though??
					Ind: segmentSet[0].id + 1,
					segments: segmentSet.map((el) => ({
						Text: el.textContent,
						SceneId: el.sceneId,
					})),
				},
				operation: SegmentModifications.Add,
			}));
		const deletions: SegmentModificationData[] = diff.subtractions.map(
			(segment) => ({
				details: {
					Ind: segment.id,
				},
				operation: SegmentModifications.Delete,
			})
		);
		return { diff };
		return;
		if (!additions.length && !edits.length && !deletions.length) {
			console.log("No edits found");
		}

		const editedResponse = await EditSegment.mutateAsync({
			story_id: Webstory.data?.id as string,
			story_type: Webstory.data?.storyType,
			edits: [...edits, ...additions, ...deletions],
		});
		queryClient.invalidateQueries({ queryKey: [QueryKeys.STORY] });

		const newStory = await api.video.get(
			Webstory.data?.topLevelCategory!,
			Webstory.data?.slug!,
			Webstory.data?.storyType!
		);

		// setPreviousStory(WebstoryToStoryDraft(newStory));
		dispatch({ type: "reset", draft: WebstoryToStoryDraft(newStory) });
		return newStory;
	};

	useEffect(() => {
		// handleSubmitEditSegments();
		// console.log(WebstoryToStoryDraft(Webstory.data), story);
		console.log(handleSubmitEditScenesAndSegments());
		// console.log(GenerateSceneDiff(WebstoryToStoryDraft(Webstory.data), story));
	}, [story]);

	useEffect(() => {
		dispatch({
			type: "reset",
			draft: WebstoryToStoryDraft(Webstory.data),
		});
	}, [JSON.stringify(Webstory.data)]);

	useEffect(() => {
		const handleKeyDown = async (event: KeyboardEvent) => {
			if ((event.ctrlKey || event.metaKey) && event.key === "s") {
				// Prevent default browser behavior (saving the page)
				event.preventDefault();

				const newStory = await handleSubmitEditSegments();
				console.log("Story saved:", newStory?.slug);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	if (router.query.editor === "script") {
		return (
			<WebStoryProvider initialValue={storyData}>
				<ScriptLayout {...{ story, dispatch }} />
			</WebStoryProvider>
		);
	} else if (router.query.editor === "storyboard") {
		return (
			<WebStoryProvider initialValue={storyData}>
				<EditScript {...{ story, dispatch }} />
			</WebStoryProvider>
		);
	} else if (router.query.editor === "scenes") {
		return (
			<WebStoryProvider initialValue={storyData}>
				<StoryScenes {...{ story, dispatch }} />
			</WebStoryProvider>
		);
	}
	return notFound();
};

EditorPage.getLayout = function getLayout(page: ReactElement) {
	return <ScenesLayout>{page}</ScenesLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const session = await getSession(ctx.req, ctx.res);

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

export default EditorPage;
