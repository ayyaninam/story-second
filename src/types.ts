import { mlSchema, mainSchema } from "@/api/schema";
import { StoryLengths, StoryOutputTypes } from "./utils/enums";
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

export type VideoOrientation = "wide" | "vertical" | "book";

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
	icon: React.ReactNode,
	aspectRatio: string,
    header: {
      title: string;
      subtitle: string;
      buttonText: string;
    };
  };
};
