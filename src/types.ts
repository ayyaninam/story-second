import { mlSchema, mainSchema } from "@/api/schema";
import { SegmentModifications, StoryLengths } from "./utils/enums";
import { CallbackListener } from "@remotion/player";

export type CreateInitialStoryQueryParams = mlSchema["CreateStoryRequest"];

export interface AuthPromptProps {
	onSignUp: () => void;
	onLogIn: () => void;
}

export type VideoPlayerProps = {
	Webstory?: mainSchema["ReturnVideoStoryDTO"];
	isError?: boolean;
	onPlay?: CallbackListener<"play">;
	onEnded?: CallbackListener<"ended">;
	onPause?: CallbackListener<"pause">;
	onSeeked?: CallbackListener<"seeked">;
	isPlaying?: boolean;
	seekedFrame?: number;
	isMuted?: boolean;
};

export type StoryScreenBgBlurProps = {
	Webstory?: mainSchema["ReturnVideoStoryDTO"];
	isError?: boolean;
	isPlaying?: boolean;
	seekedFrame?: number;
	blur: string;
};

export type SegmentModificationData =
	| {
			operation: SegmentModifications.Add;
			details: mlSchema["SegmentAdd"];
	  }
	| {
			operation: SegmentModifications.Edit;
			details: mlSchema["SegmentEdit"];
	  }
	| {
			operation: SegmentModifications.Delete;
			details: mlSchema["SegmentDelete"];
	  };

export type RegenerateVideoSegments = {
	image_key: string;
	image_prompt: string;
	image_cfg_scale: number;
	image_resolution: number;
	image_sampling_steps: number;
	image_seed: number;
	image_alt_text: string;
	target_paths: string[];
};
