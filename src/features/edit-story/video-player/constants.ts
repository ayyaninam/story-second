import { z } from "zod";

const VideoVisual = z.object({
	format: z.literal("video"),
	videoURL: z.string(),
});
const Visual = z.discriminatedUnion("format", [VideoVisual]);

const PageSegment = z.object({
	type: z.literal("page"),
	id: z.string(),
	index: z.number(),
	storyText: z.string(),
	visual: Visual,
	audioURL: z.string().nullish(),
	durationInFrames: z.number(),
	contentDuration: z.number(),
});
const InterpolationSegment = z.object({
	type: z.literal("intermediate"),
	id: z.string(),
	index: z.number(),
	visual: Visual,
	durationInFrames: z.number(),
});
const TransitionSegment = z.object({
	type: z.literal("transition"),
	id: z.string(),
	durationInFrames: z.number(),
});
const Segment = z.discriminatedUnion("type", [
	PageSegment,
	InterpolationSegment,
	TransitionSegment,
]);

export const CompositionProps = z.object({
	showLoadingVideo: z.boolean().nullish(),
	durationInFrames: z.number(),
	segments: z.array(Segment),
});
export type RemotionPlayerInputProps = z.infer<typeof CompositionProps>;
export type RemotionPageSegment = z.infer<typeof PageSegment>;
export type RemotionInterpolationSegment = z.infer<typeof InterpolationSegment>;
export type RemotionTransitionSegment = z.infer<typeof TransitionSegment>;
export type RemotionSegment = RemotionPlayerInputProps["segments"][number];

export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;
export const SILENT_DURATION = 0.2; // in seconds
export const INCREASED_LAST_PAGE_DURATION = 2; // in seconds

export const bigZIndexTrick = 40000;

// todo: this might slow down the mp4 rendering on ec2, check if happens
// if it does then setting this value to 0 only for ec2 will work
// this is in order to avoid flickering
// higher value means more video players existing one above other at the same time = more resources?
// lower value increases the chance of flickering
export const PREMOUNT_FRAMES = VIDEO_FPS;
