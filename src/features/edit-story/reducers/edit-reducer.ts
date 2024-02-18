import { mainSchema } from "@/api/schema";
import { StoryImageStyles } from "@/utils/enums";

export enum StoryStatus {
	FAILED,
	PENDING,
	READY,
}

export type Segment = {
	id: number;
	settings?: {
		samplingSteps: number; // 2-10
		denoising: number; // 0-1,
		prompt: string;
		style: StoryImageStyles;
		voice: string;
	};
	textContent: string;
	imageKey: string;
	videoKey: string;
	audioKey: string;
	imageStatus: StoryStatus;
	videoStatus: StoryStatus;
	audioStatus: StoryStatus;
};
export type Scene = {
	id: number;
	status: StoryStatus;
	settings?: {
		modifier_prompt: string;
		style: StoryImageStyles;
		voice: string;
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
			id: number;
			scene: Scene;
	  }
	| {
			type: "edit_scene";
			id: number;
			scene: Scene;
	  }
	| {
			type: "delete_scene";
			id: number;
	  }
	| {
			type: "create_segment";
			sceneId: number;
			segmentId: number;
			segment: Segment;
	  }
	| {
			type: "edit_segment";
			sceneId: number;
			segmentId: number;
			segment: Segment;
	  }
	| {
			type: "delete_segment";
			sceneId: number;
			segmentId: number;
	  };

const editStoryReducer = (draft: EditStoryDraft, action: EditStoryAction) => {
	switch (action.type) {
		case "create_segment": {
			const { sceneId, segment, segmentId } = action;
			const sceneIdx = draft.scenes.findIndex((el) => el.id === sceneId);
			const segmentIdx = draft.scenes[sceneIdx]?.segments.findIndex(
				(el) => el.id === segmentId
			);
			draft.scenes[sceneIdx]?.segments.splice(segmentIdx + 1, 0, segment);

			break;
		}
		case "edit_segment": {
			const { sceneId, segment, segmentId } = action;
			draft.scenes
				.find((el) => el.id === sceneId)
				?.segments.splice(segmentId, 1, segment);
			break;
		}
		case "delete_segment": {
			const { sceneId, segmentId } = action;
			draft.scenes
				.find((el) => el.id === sceneId)
				?.segments.splice(segmentId, 1);
			break;
		}
		case "create_scene": {
			const { id } = action;
			draft.scenes.splice(id, 1);
			break;
		}
		case "edit_scene": {
			const { id, scene } = action;
			draft.scenes.splice(id, 1, scene);
			break;
		}
		case "delete_scene": {
			const { id } = action;
			draft.scenes.splice(id, 1);
			break;
		}
	}
};

export default editStoryReducer;
