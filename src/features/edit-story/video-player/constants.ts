import { z } from "zod";

const VideoVisual = z.object({
	format: z.literal("video"),
	videoURL: z.string(),
});
const ImageVisual = z.object({
	format: z.literal("image"),
	imageURL: z.string(),
});
const PageVisual = z.discriminatedUnion("format", [VideoVisual, ImageVisual]);

const PageSegment = z.object({
	type: z.literal("page"),
	id: z.string(),
	index: z.number(),
	storyText: z.string(),
	visual: PageVisual.nullish(),
	audioURL: z.string().nullish(),
	durationInFrames: z.number(),
	contentDuration: z.number(),
	playbackRate: z.number(),
	seekId: z.string(),
});
const InterpolationSegment = z.object({
	type: z.literal("intermediate"),
	id: z.string(),
	index: z.number(),
	visual: VideoVisual,
	durationInFrames: z.number(),
	playbackRate: z.number(),
});
const TransitionSegment = z.object({
	type: z.literal("transition"),
	id: z.string(),
	durationInFrames: z.number(),
	playbackRate: z.number(),
});
const Segment = z.discriminatedUnion("type", [
	PageSegment,
	InterpolationSegment,
	TransitionSegment,
]);

export const CompositionPropsLandscape = z.object({
	variant: z.literal("landscape"),
	showLoadingVideo: z.boolean().nullish(),
	enableAudio: z.boolean(),
	enableSubtitles: z.boolean(),
	enableBackgroundAudioFadeOutEffect: z.boolean(),
	durationInFrames: z.number(),
	segments: z.array(Segment),
	renderedVideoURL: z.string().nullish(),
	backgroundAudioURL: z.string().nullish(),
});

export const CompositionPropsPortrait = z.object({
	variant: z.literal("portrait"),
	showLoadingVideo: z.boolean().nullish(),
	enableAudio: z.boolean(),
	enableSubtitles: z.boolean(),
	enableBackgroundAudioFadeOutEffect: z.boolean(),
	durationInFrames: z.number(),
	segments: z.array(Segment),
	renderedVideoURL: z.string().nullish(),
	backgroundAudioURL: z.string().nullish(),
});

export const CompositionPropsSplit = z.object({
	variant: z.literal("split"),
	showLoadingVideo: z.boolean().nullish(),
	enableAudio: z.boolean(),
	enableSubtitles: z.boolean(),
	durationInFrames: z.number(),
	pagesDurationInFrames: z.number(),
	bottomVideoURL: z.string(),
	segments: z.array(Segment),
	renderedVideoURL: z.string().nullish(),
});

export const CompositionProps = z.discriminatedUnion("variant", [
	CompositionPropsLandscape,
	CompositionPropsPortrait,
	CompositionPropsSplit,
]);
export type RemotionPlayerInputProps = z.infer<typeof CompositionProps>;
export type RemotionPlayerLandscapeInputProps = z.infer<
	typeof CompositionPropsLandscape
>;
export type RemotionPlayerPortraitInputProps = z.infer<
	typeof CompositionPropsPortrait
>;
export type RemotionPlayerSplitInputProps = z.infer<
	typeof CompositionPropsSplit
>;
export type RemotionPageSegment = z.infer<typeof PageSegment>;
export type RemotionInterpolationSegment = z.infer<typeof InterpolationSegment>;
export type RemotionTransitionSegment = z.infer<typeof TransitionSegment>;
export type RemotionSegment = RemotionPlayerInputProps["segments"][number];
export type RemotionVariant = RemotionPlayerInputProps["variant"];

export const VIDEO_WIDTH: Record<RemotionVariant, number> = {
	landscape: 1280,
	portrait: 720,
	split: 720,
};
export const VIDEO_HEIGHT: Record<RemotionVariant, number> = {
	landscape: 720,
	portrait: 1280,
	split: 1280,
};
export const VIDEO_FPS = 30;
export const SILENT_DURATION = 0.4; // in seconds
export const INCREASED_LAST_PAGE_DURATION = 2; // in seconds

export const bigZIndexTrick = 40000;

// todo: this might slow down the mp4 rendering on ec2, check if happens
// if it does then setting this value to 0 only for ec2 will work
// this is in order to avoid flickering
// higher value means more video players existing one above other at the same time = more resources?
// lower value increases the chance of flickering
// todo: also this controls the transition duration, decouple this transition logic with the premount logic
export const PREMOUNT_FRAMES = 1.5 * VIDEO_FPS;

export const TO_THE_END_OF_VIDEO = 999999;

export const THE_END_DURATION = 3 * VIDEO_FPS;
