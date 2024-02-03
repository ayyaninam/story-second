import { z } from "zod";

const ImageVisual = z.object({
  format: z.literal("image"),
  imageURL: z.string(),
});
const VideoVisual = z.object({
  format: z.literal("video"),
  videoURL: z.string(),
});
const GifVisual = z.object({
  format: z.literal("gif"),
  gifURL: z.string(),
});
const Visual = z.discriminatedUnion("format", [
  ImageVisual,
  VideoVisual,
  GifVisual,
]);

const PageSegment = z.object({
  type: z.literal("page"),
  id: z.string(),
  storyText: z.string(),
  visual: Visual,
  audioURL: z.string().nullish(),
  durationInFrames: z.number(),
  contentDuration: z.number(),
  isInterpolation: z.boolean().nullish()
});
const InterpolationSegment = z.object({
  type: z.literal("intermediate"),
  id: z.string(),
  visual: Visual,
  durationInFrames: z.number(),
});
const Segment = z.discriminatedUnion("type", [
  PageSegment,
  InterpolationSegment,
]);

export const CompositionProps = z.object({
  showLoadingVideo: z.boolean().nullish(),
  durationInFrames: z.number(),
  segments: z.array(Segment),
});
export type RemotionPlayerInputProps = z.infer<typeof CompositionProps>
export type RemotionSegment = RemotionPlayerInputProps["segments"][number]

export const VIDEO_WIDTH= 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;
export const SILENT_DURATION = 0.2; // in seconds
export const INCREASED_LAST_PAGE_DURATION = 2; // in seconds
