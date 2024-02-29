import {
	DefinedUseQueryResult,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { EditStoryAction, EditStoryDraft } from "../reducers/edit-reducer";
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
	return useMutation({
		mutationFn: async ({
			story,
			Webstory,
		}: {
			story: EditStoryDraft;
			Webstory: mainSchema["ReturnVideoStoryDTO"];
		}) => {
			const sceneDiff = GenerateSceneDiff(
				WebstoryToStoryDraft(Webstory),
				story
			);
			const {
				additions: sceneAdditions,
				deletions: sceneDeletions,
				edits: sceneEdits,
			} = GenerateSceneDiffDto(sceneDiff);

			await api.video.editScenes({
				story_id: Webstory?.id as string,
				story_type: Webstory?.storyType,
				edits: [...sceneEdits, ...sceneAdditions, ...sceneDeletions],
			});

			const newVideo = await api.video.get(
				story.topLevelCategory,
				story.slug,
				story.type
			);
			const newStoryDraft = WebstoryToStoryDraft(newVideo);
			const newStory: EditStoryDraft = {
				...newStoryDraft,
				scenes:
					newStoryDraft.scenes?.map((scene, index) => ({
						...scene,
						segments: story.scenes[index]?.segments!,
					})) ?? [],
			};

			const diff = GenerateStoryDiff(newStoryDraft, newStory);
			const { edits, additions, deletions } = GenerateStoryDiffDto(diff);
			// return;
			if (!additions.length && !edits.length && !deletions.length) {
				console.log("No edits found");
			}

			const editedResponse = await api.video.editSegment({
				story_id: Webstory?.id as string,
				story_type: Webstory?.storyType,
				edits: [...edits, ...additions, ...deletions],
			});
			queryClient.invalidateQueries({ queryKey: [QueryKeys.STORY] });

			const newStory2 = await api.video.get(
				Webstory?.topLevelCategory!,
				Webstory?.slug!,
				Webstory?.storyType!
			);

			dispatch({ type: "reset", draft: WebstoryToStoryDraft(newStory2) });
			return newStory2;
		},
	});
};
