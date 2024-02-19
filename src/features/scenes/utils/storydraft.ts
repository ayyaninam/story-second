import { mainSchema } from "@/api/schema";
import { EditStoryDraft, StoryStatus } from "../reducers/edit-reducer";

export const WebstoryToStoryDraft = (
	Webstory: mainSchema["ReturnWebStoryDTO"]
): EditStoryDraft => {
	return {
		id: Webstory.id!,
		scenes: [
			{
				id: 1,
				segments: Webstory.storySegments
					? Webstory.storySegments.map((el) => ({
							audioKey: el.femaleAudioKey!,
							audioStatus: StoryStatus.READY,
							id: el.index!,
							imageKey: el.imageKey!,
							imageStatus: StoryStatus.READY,
							textContent: el.textContent!,
							videoKey: el.videoKey!,
							videoStatus: StoryStatus.READY,
						}))
					: [],
				status: StoryStatus.READY,
			},
		],
		status: StoryStatus.READY,
		title: Webstory.storyTitle!,
	};
};
