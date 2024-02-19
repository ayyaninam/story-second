import { mainSchema } from "@/api/schema";
import { EditStoryDraft, StoryStatus } from "../reducers/edit-reducer";
import React from "react";
import { nanoid } from "nanoid";

export const WebstoryToStoryDraft = (
	Webstory: mainSchema["ReturnWebStoryDTO"]
): EditStoryDraft => {
	return {
		id: Webstory.id!,
		scenes:
			Webstory.scenes?.map((scene) => ({
				id: scene.id!,
				segments:
					scene.videoSegments?.map((segment) => {
						return {
							audioKey: segment.femaleAudioKey!,
							audioStatus: StoryStatus.READY,
							id: segment.index!,
							imageKey: segment.imageKey!,
							imageStatus: StoryStatus.READY,
							textContent: segment.textContent!,
							videoKey: segment.videoKey!,
							videoStatus: StoryStatus.READY,
							internalKey: nanoid(),
						};
					}) ?? [],
				status: StoryStatus.READY,
			})) ?? [],
		status: StoryStatus.READY,
		title: Webstory.storyTitle!,
	};
};
