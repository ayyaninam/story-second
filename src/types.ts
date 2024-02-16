import { mlSchema, mainSchema } from "@/api/schema";
import { StoryLengths } from "./utils/enums";
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
}
