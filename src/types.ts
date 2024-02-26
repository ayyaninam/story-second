import { mlSchema, mainSchema } from "@/api/schema";
import {
	DisplayAspectRatios,
	StoryOutputTypes,
	SegmentModifications,
} from "./utils/enums";
import { CallbackListener } from "@remotion/player";
import { VIDEO_ORIENTATIONS } from "./features/library/constants";

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

const VIDEO_ORIENTATION_IDS = Object.values(VIDEO_ORIENTATIONS).map(
	(el) => el.id
);

export type VideoOrientation = (typeof VIDEO_ORIENTATION_IDS)[number];

export type VideoThumbnail = {
	id?: string;
	expand?: boolean;
	title?: string | null;
	thumbnail?: string | null;
	description?: string | null;
	storyType: StoryOutputTypes;
	topLevelCategory?: string | null;
	slug?: string | null;
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

export type ExplorePageVideoQueryOptions = {
	CurrentPage?: number;
	PageSize?: number;
	storyType?: StoryOutputTypes;
	searchTerm?: string;
	resolution?: DisplayAspectRatios;
	isDescending?: boolean;
	topLevelCategory: string;
};
