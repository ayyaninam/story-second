import { mlSchema, mainSchema } from "@/api/schema";
import {
	DisplayAspectRatios,
	StoryOutputTypes,
	SegmentModifications,
	SceneModifications,
} from "./utils/enums";
import { CallbackListener } from "@remotion/player";
import { VIDEO_ORIENTATIONS } from "./constants/feed-constants";

export type CreateInitialStoryQueryParams = mlSchema["CreateStoryRequest"];

export interface AuthPromptProps {
	onSignUp: () => void;
	onLogIn: () => void;
}

export type VideoPlayerProps = {
	Webstory?: mainSchema["ReturnVideoStoryDTO"];
	isError?: boolean;
	playerClassName?: string;
	onPlay?: CallbackListener<"play">;
	onEnded?: CallbackListener<"ended">;
	onPause?: CallbackListener<"pause">;
	onSeeked?: CallbackListener<"seeked">;
	isPlaying?: boolean;
	seekedFrame?: number;
	isMuted?: boolean;
	defaultLoadingText?: string;
	roundedClassName?: string;
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

export type SceneModificationData =
	| {
			operation: SceneModifications.Add;
			details: mlSchema["SceneAdd"];
	  }
	| {
			operation: SceneModifications.Edit;
			details: mlSchema["SceneEdit"];
	  }
	| {
			operation: SceneModifications.Delete;
			details: mlSchema["SceneDelete"];
	  };

const VIDEO_ORIENTATION_IDS = Object.values(VIDEO_ORIENTATIONS).map(
	(el) => el.id
);

export type VideoOrientation = (typeof VIDEO_ORIENTATION_IDS)[number];

export type PaginationParams = {
	CurrentPage?: number;
	PageSize?: number;
};

export type VideoThumbnail = {
	id?: string;
	expand?: boolean;
	title?: string | null;
	thumbnail?: string | null;
	description?: string | null;
	storyType: StoryOutputTypes;
	topLevelCategory?: string | null;
	slug?: string | null;
	storyLikes?: number;
};

export type GalleryData = {
	[key in VideoOrientation]: {
		title: string;
		orientation: VideoOrientation;
		icon: React.ReactNode;
		aspectRatio: string;
		header: {
			title: string;
			subtitle: string;
			buttonText: string;
		};
	};
};

export type LibraryPageVideoQueryOptions = {
	CurrentPage?: number;
	PageSize?: number;
	storyType?: StoryOutputTypes;
	searchTerm?: string;
	resolution?: DisplayAspectRatios;
	isDescending?: boolean;
	topLevelCategory: string;
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

export type FeedPageVideoQueryOptions = {
	CurrentPage?: number;
	PageSize?: number;
	storyType?: StoryOutputTypes;
	searchTerm?: string;
	resolution?: DisplayAspectRatios;
	orientation?: VideoOrientation;
	isDescending?: boolean;
	topLevelCategory: string;
};
