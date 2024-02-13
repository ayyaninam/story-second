import pLimit from "p-limit";
import { v4 as uuidv4 } from "uuid";
import { getVideoMetadata } from "@remotion/media-utils";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import {
	RemotionSegment,
	VIDEO_FPS,
	INCREASED_LAST_PAGE_DURATION,
	SILENT_DURATION,
	RemotionPlayerInputProps,
	RemotionPageSegment,
	RemotionInterpolationSegment,
	RemotionTransitionSegment,
	RemotionVariant,
} from "./constants";
import { prefetchAssets } from "./prefetch";
import { mainSchema } from "@/api/schema";
import { VoiceType, AspectRatios, StoryOutputTypes } from "@/utils/enums";
import Format from "@/utils/format";

type WebStory = NonNullable<
	mainSchema["ReturnWebStoryDTO"] & {
		storySegments: NonNullable<mainSchema["ReturnStorySegmentDTO"][]>;
	}
>;
type StorySegment = NonNullable<mainSchema["ReturnStorySegmentDTO"]>;

const calculateSegmentDuration = async ({
	audioURL,
	segment,
	isLastSegment,
}: {
	audioURL: string | null;
	segment: StorySegment;
	isLastSegment: boolean;
}) => {
	const minContentDuration = 2 * VIDEO_FPS; // seconds

	// 1 silent part before start audio + 1 silent part after ending audio
	const silentTime = 2 * SILENT_DURATION * VIDEO_FPS;

	if (!audioURL) {
		return {
			contentDuration: minContentDuration,
			durationInFrames: minContentDuration + silentTime,
		};
	}
	const audioDuration = await getAudioDurationInSeconds(audioURL);

	let contentDuration = 0;
	if (audioDuration > 0) {
		contentDuration = Math.ceil(audioDuration * VIDEO_FPS);
	} else {
		const STORY_TEXT_SPEED_WHEN_NO_AUDIO = 20; // more speed means the story text will appear quicker
		if (segment.textContent)
			contentDuration =
				Math.ceil(segment.textContent.length / STORY_TEXT_SPEED_WHEN_NO_AUDIO) *
				VIDEO_FPS;
	}

	if (isLastSegment) {
		contentDuration += INCREASED_LAST_PAGE_DURATION * VIDEO_FPS;
	}

	contentDuration = Math.max(contentDuration, minContentDuration);

	return {
		contentDuration,
		durationInFrames: contentDuration + silentTime,
	};
};

const storySegmentToRemotionSegment = async (
	segment: StorySegment,
	index: number,
	story: WebStory,
	selectedVoice: VoiceType
): Promise<Omit<RemotionSegment, "index">[]> => {
	// getting audio url
	let audioKey = null;
	switch (selectedVoice) {
		case VoiceType.GenericMale:
			audioKey = segment.maleAudioKey;
			break;
		case VoiceType.GenericFemale:
			audioKey = segment.femaleAudioKey;
			break;
		case VoiceType.Portuguese:
			audioKey = segment.portugueseAudioKey;
			break;
		case VoiceType.Custom:
			audioKey = segment.customAudioKey;
			break;
	}
	const audioURL = audioKey ? Format.GetPublicBucketObjectUrl(audioKey) : null;

	// calculating segment duration based on audio duration
	const { contentDuration, durationInFrames } = await calculateSegmentDuration({
		audioURL,
		segment,
		isLastSegment: index === story.storySegments.length,
	});

	// creating the segments
	let pageSegment: Omit<RemotionPageSegment, "index"> | null = null;
	if (segment.videoKey) {
		pageSegment = {
			type: "page",
			id: uuidv4(),
			storyText: segment.textContent ?? "",
			visual: {
				format: "video",
				videoURL: Format.GetVideoUrl(segment.videoKey),
			},
			audioURL,
			durationInFrames: durationInFrames,
			contentDuration: contentDuration,
		};
	}

	let intermediateSegment: Omit<RemotionInterpolationSegment, "index"> | null =
		null;
	let transitionSegment: RemotionTransitionSegment | null = null;
	if (segment.frameInterpolationKey) {
		intermediateSegment = {
			type: "intermediate",
			id: uuidv4(),
			visual: {
				format: "video",
				videoURL: Format.GetVideoUrl(segment.frameInterpolationKey),
			},
			durationInFrames: 17,
		};
	} else {
		transitionSegment = {
			type: "transition",
			id: uuidv4(),
			durationInFrames: VIDEO_FPS,
		};
	}

	// @ts-ignore
	return [intermediateSegment ?? transitionSegment, pageSegment].filter(
		Boolean
	);
};

const limit = pLimit(10);

export const webStoryToRemotionSegments = async (
	story: WebStory,
	selectedVoice: VoiceType
): Promise<RemotionSegment[]> => {
	const storySegmentPromises = story.storySegments.map((storySegment, index) =>
		limit(() =>
			storySegmentToRemotionSegment(storySegment, index, story, selectedVoice)
		)
	);

	const segments = await Promise.all(storySegmentPromises);

	// @ts-ignore
	return segments.flat().map((segment, index) => ({ ...segment, index }));
};

export const getRemotionVariant = (story: WebStory): RemotionVariant => {
	const storyType: StoryOutputTypes = story.storyType;
	const imageResolution = story.resolution;

	if (storyType === StoryOutputTypes.SplitScreen) {
		return "split";
	} else if (imageResolution === AspectRatios["1024x576"]) {
		return "landscape";
	}
	return "portrait";
};

const TO_END_OF_VIDEO = 9999999;

const extendLastSegmentOfTopVideo = (segments: RemotionSegment[]) =>
	segments.map((segment, index) =>
		index === segments.length - 1
			? { ...segment, durationInFrames: TO_END_OF_VIDEO }
			: segment
	);

export const webStoryToRemotionInputProps = async (
	story: WebStory,
	selectedVoice: VoiceType
): Promise<RemotionPlayerInputProps> => {
	const segments = await webStoryToRemotionSegments(story, selectedVoice);

	const variant = getRemotionVariant(story);

	// await prefetchAssets(segments);

	const bottomVideoURL = Format.GetVideoUrl(story.originalTiktokInputKey!);

	const bottomVideoDurationInFrames = Math.ceil(
		(await getVideoMetadata(bottomVideoURL)).durationInSeconds * VIDEO_FPS
	);
	const topVideoDurationInFrames = segments.reduce(
		(acc, segment) =>
			acc + (segment.type === "transition" ? 0 : segment.durationInFrames),
		0
	);

	const durationInFrames = Math.max(
		bottomVideoDurationInFrames,
		topVideoDurationInFrames
	);

	const base = {
		showLoadingVideo: false,
		durationInFrames,
		enableAudio: false,
		enableSubtitles: false,
		segments:
			variant === "split" ? extendLastSegmentOfTopVideo(segments) : segments,
	};

	if (variant === "split") {
		return {
			...base,
			variant: "split",
			bottomVideoURL,
		};
	} else if (variant === "landscape") {
		return {
			...base,
			variant: "landscape",
		};
	} else {
		return {
			...base,
			variant: "portrait",
		};
	}
};
