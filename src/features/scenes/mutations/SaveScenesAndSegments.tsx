import {
	DefinedUseQueryResult,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	EditStoryAction,
	EditStoryDraft,
	Scene,
} from "../reducers/edit-reducer";
import { mainSchema } from "@/api/schema";
import {
	GenerateSceneDiff,
	GenerateSceneDiffDto,
	GenerateStoryDiff,
	GenerateStoryDiffDto,
	WebstoryToStoryDraft,
} from "../utils/storydraft";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";

export const useSubmitEditScenesAndSegments = (
	dispatch: React.Dispatch<EditStoryAction>
) => {
	const queryClient = useQueryClient();
	const EditSegment = useMutation({
		mutationFn: api.video.editSegment,
	});
	return useMutation({
		mutationFn: async ({
			prevStory,
			updatedStory,
		}: {
			updatedStory: EditStoryDraft;
			prevStory: mainSchema["ReturnVideoStoryDTO"];
		}) => {
			const sceneDiff = GenerateSceneDiff(
				WebstoryToStoryDraft(prevStory),
				updatedStory
			);
			const {
				additions: sceneAdditions,
				deletions: sceneDeletions,
				edits: sceneEdits,
			} = GenerateSceneDiffDto(sceneDiff);

			if (sceneEdits.length || sceneAdditions.length || sceneDeletions.length)
				await api.video.editScenes({
					story_id: prevStory?.id as string,
					story_type: prevStory?.storyType,
					edits: [...sceneEdits, ...sceneAdditions, ...sceneDeletions],
				});

			const newVideo = await api.video.get(
				updatedStory.topLevelCategory,
				updatedStory.slug,
				updatedStory.type
			);

			const reindexSceneSegments = (scene: Scene, sceneIndex: number) => {
				const oldInitialIndex =
					updatedStory.scenes?.[sceneIndex]?.segments[0]?.id ?? 0;
				const newInitialIndex = scene.segments[0]?.id ?? 0;

				const indexDiff = oldInitialIndex - newInitialIndex;
				return updatedStory.scenes?.[sceneIndex]?.segments?.map(
					(segment, segmentIndex) => {
						const oldSegment =
							updatedStory.scenes?.[sceneIndex]?.segments?.[segmentIndex];
						return {
							...segment,
							id:
								oldSegment?.id && indexDiff
									? oldSegment.id - indexDiff
									: segment.id,
							sceneIndex,
							segmentIndex,
							sceneId: scene.id,
						};
					}
				);
			};
			const newStoryDraft = WebstoryToStoryDraft(newVideo);
			const newStory: EditStoryDraft = {
				...newStoryDraft,
				scenes: newStoryDraft.scenes?.map((scene, sceneIndex) => ({
					...scene,
					segments: reindexSceneSegments(scene, sceneIndex) ?? [],
				})),
			};

			console.log(newStoryDraft, updatedStory);

			const diff = GenerateStoryDiff(newStoryDraft, newStory);
			const { edits, additions, deletions } = GenerateStoryDiffDto(diff);
			// return;
			if (!additions.length && !edits.length && !deletions.length) {
			}

			const editedResponse = await EditSegment.mutateAsync({
				story_id: prevStory?.id as string,
				story_type: prevStory?.storyType,
				edits: [...edits, ...additions, ...deletions],
			});
			await queryClient.invalidateQueries({ queryKey: [QueryKeys.STORY] });

			const newStory2 = await api.video.get(
				prevStory?.topLevelCategory!,
				prevStory?.slug!,
				prevStory?.storyType!
			);

			dispatch({ type: "reset", draft: WebstoryToStoryDraft(newStory2) });
			return newStory2;
		},
	});
};
