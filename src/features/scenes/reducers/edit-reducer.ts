import {
	AspectRatios,
	DisplayAspectRatios,
	StoryImageStyles,
	StoryOutputTypes,
} from "@/utils/enums";
import { recursivelyUpdateOverlappingKeys } from "../utils/storydraft";

export enum StoryStatus {
	READY,
	FAILED,
	PENDING,
	COMPLETE,
}
export enum TextStatus {
	UNEDITED,
	EDITED,
	ADDED,
	DELETED,
}

export type Settings = {
	samplingSteps?: number; // 2-10
	denoising?: number; // 0-1,
	seed?: number; // 0-1,
	prompt?: string;
	style?: StoryImageStyles;
	voice?: string;
};

export type Segment = {
	id: number;
	settings?: Settings;
	textContent: string;
	imageKey: string;
	videoKey?: string;
	audioKey: string;
	textStatus: TextStatus;
	imageStatus: StoryStatus;
	videoStatus?: StoryStatus;
	audioStatus: StoryStatus;
	alternateImageKeys?: string[];
	alternateImagesStatus?: StoryStatus;
};

export type Scene = {
	id: string;
	index: number;
	status: StoryStatus;
	settings?: {
		modifier_prompt?: string;
		style?: StoryImageStyles;
		voice?: string;
	};
	segments: Segment[];
	description: string;
};

export type EditStoryDraft = {
	id: string;
	slug: string;
	topLevelCategory: string;
	title: string;
	displayResolution: DisplayAspectRatios;
	resolution: AspectRatios;
	settings?: {
		style: StoryImageStyles | null;
		voice: string;
	};
	status: StoryStatus;
	scenes: Scene[];
	type: StoryOutputTypes;
};

export type EditStoryAction =
	| {
			type: "create_scene";
			index: number;
			scene: Scene;
	  }
	| {
			type: "edit_scene";
			index: number;
			scene: Scene;
	  }
	| {
			type: "delete_scene";
			index: number;
	  }
	| {
			type: "create_segment";
			sceneIndex: number;
			segmentIndex: number;
			segment: Segment;
	  }
	| {
			type: "edit_segment";
			sceneIndex: number;
			segmentIndex: number;
			segment: Segment;
	  }
	| {
			type: "delete_segment";
			sceneIndex: number;
			segmentIndex: number;
	  }
	| {
			type: "reset_all_except_text";
			draft: EditStoryDraft;
	  }
	| {
			type: "reset_text";
			draft: EditStoryDraft;
	  }
	| {
			type: "reset";
			draft: EditStoryDraft;
	  }
	| {
			type: "update_image_style";
			style: StoryImageStyles;
	  }
	| {
			type: "update_narrator";
			voiceType: string;
	  }
	| {
			type: "update_settings";
			draft: Settings;
	  }
	| {
			type: "update_segment_statuses";
			key: "imageStatus" | "videoStatus" | "audioStatus";
			segmentIndices: { segmentIndex: number; sceneIndex: number }[];
			status: StoryStatus;
	  };

const editStoryReducer = (draft: EditStoryDraft, action: EditStoryAction) => {
	switch (action.type) {
		case "create_segment": {
			const { sceneIndex, segment, segmentIndex } = action;
			// const segmentId = draft.scenes[sceneIdx]?.segments[segmentIndex]?.id;
			draft.scenes[sceneIndex]?.segments.splice(segmentIndex + 1, 0, {
				...segment,
			});

			break;
		}
		case "edit_segment": {
			const { sceneIndex, segment, segmentIndex } = action;
			draft.scenes[sceneIndex]?.segments.splice(segmentIndex, 1, segment);
			break;
		}
		case "delete_segment": {
			const { sceneIndex, segmentIndex } = action;
			draft.scenes[sceneIndex]?.segments.splice(segmentIndex, 1);
			break;
		}
		case "create_scene": {
			const { index, scene } = action;
			draft.scenes.splice(index + 1, 0, scene);
			break;
		}
		case "edit_scene": {
			const { index, scene } = action;
			draft.scenes.splice(index, 1, scene);
			break;
		}
		case "delete_scene": {
			const { index } = action;
			draft.scenes.splice(index, 1);
			break;
		}
		case "update_image_style": {
			const { style } = action;
			if (!draft.settings) {
				draft.settings = { style, voice: "" };
			} else {
				draft.settings.style = style;
			}
			break;
		}
		case "update_narrator": {
			const { voiceType } = action;
			if (!draft.settings) {
				draft.settings = { style: null, voice: voiceType };
			} else {
				draft.settings.voice = voiceType;
			}
			break;
		}
		case "reset_text": {
			draft.title = action.draft.title;
			draft.scenes = draft.scenes.map((scene, index) => {
				const relatableScene = action.draft.scenes?.[index];
				if (relatableScene) {
					return {
						...scene,
						description: scene.description,
						segments: scene.segments.map((segment, index) => {
							const relatableSegment = relatableScene.segments?.[index];
							if (relatableSegment) {
								return {
									...segment,
									textStatus:
										relatableSegment?.textContent === segment?.textContent
											? TextStatus.UNEDITED
											: TextStatus.EDITED,
								};
							}
							return segment;
						}),
					};
				}
				return scene;
			});
			return draft;
		}
		case "reset_all_except_text": {
			action.draft.title = draft.title;
			action.draft.scenes = action.draft.scenes.map((scene) => {
				const draftScene = draft.scenes.find((el) => el.id === scene.id);
				if (draftScene) {
					return {
						...scene,
						description: draftScene.description,
						segments: scene.segments.map((segment) => {
							const draftSegment = draftScene.segments.find(
								(el) => el.id === segment.id
							);
							if (draftSegment) {
								return {
									...segment,
									textContent: draftSegment.textContent,
									textStatus: draftSegment.textStatus,
								};
							}
							return segment;
						}),
					};
				}
				return scene;
			});

			/* Only update the keys that are present in the new draft,
			 facing issues with direct update because there are few keys that are not present in the new draft.
			 I needed some of the data at reducer level to not update with the poling data
			 because not everything is present in the data from backend. Eg alternateImageKeys, alternateImagesStatus etc.
			 and recursively because there are nested objects and array in that */
			recursivelyUpdateOverlappingKeys(draft, action.draft);
			return draft;
		}
		case "reset": {
			/* Only update the keys that are present in the new draft,
			 facing issues with direct update because there are few keys that are not present in the new draft.
			 I needed some of the data at reducer level to not update with the poling data
			 because not everything is present in the data from backend. Eg alternateImageKeys, alternateImagesStatus etc.
			 and recursively because there are nested objects and array in that */
			recursivelyUpdateOverlappingKeys(draft, action.draft);
			return draft;
		}
		case "update_segment_statuses": {
			const { segmentIndices, key, status } = action;
			const sceneIdSegmentIndexKeys = segmentIndices.map(
				(el) => `${el.sceneIndex}&${el.segmentIndex}`
			);
			draft.scenes.forEach((scene, sceneIndex) =>
				scene.segments.forEach((segment, segmentIndex) => {
					if (
						sceneIdSegmentIndexKeys.includes(`${sceneIndex}&${segmentIndex}`)
					) {
						// @ts-expect-error not sure why ts is complaining
						draft.scenes[sceneIndex].segments[segmentIndex][key] = status;
					}
				})
			);
		}
		default:
			break;
	}
};

export default editStoryReducer;
