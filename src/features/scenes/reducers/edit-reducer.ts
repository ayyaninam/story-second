import { mainSchema } from "@/api/schema";
import { StoryImageStyles } from "@/utils/enums";
import { nanoid } from "nanoid";

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
	videoKey: string;
	audioKey: string;
	textStatus: TextStatus;
	imageStatus: StoryStatus;
	videoStatus: StoryStatus;
	audioStatus: StoryStatus;
};
export type Scene = {
	id: string;
	status: StoryStatus;
	settings?: {
		modifier_prompt?: string;
		style?: StoryImageStyles;
		voice?: string;
	};
	segments: Segment[];
};

export type EditStoryDraft = {
	id: string;
	title: string;
	settings?: {
		style: StoryImageStyles;
		voice: string;
	};
	status: StoryStatus;
	scenes: Scene[];
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
			type: "reset";
			draft: EditStoryDraft;
	  }
	| {
			type: "update_settings";
			draft: Settings;
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
		case "reset": {
			draft = action.draft;
			return draft;
		}
	}
};

export default editStoryReducer;
