import pLimit from "p-limit";
import { v4 as uuidv4 } from "uuid";
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
import { VoiceType, StoryType, ImageResolution } from "@/utils/enums";
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
	// @ts-ignore
	const storyType: StoryType = story.storyType; // todo: add their openapi schema
	const imageResolution = story.storySegments[0]?.imageResolution;

	if (storyType === StoryType.SplitScreen) {
		return "split";
	} else if (imageResolution === ImageResolution._1024x576) {
		return "landscape";
	}
	return "portrait";
};

export const webStoryToRemotionInputProps = async (
	story: WebStory,
	selectedVoice: VoiceType
): Promise<RemotionPlayerInputProps> => {
	const segments = await webStoryToRemotionSegments(story, selectedVoice);

	// await prefetchAssets(segments);

	const durationInFrames = segments.reduce(
		(acc, segment) => acc + segment.durationInFrames,
		0
	);

	const base = {
		showLoadingVideo: false,
		durationInFrames,
		enableAudio: true,
		enableSubtitles: true,
		segments,
	};

	const variant = getRemotionVariant(story);

	if (variant === "split") {
		return {
			...base,
			variant: "split",
			bottomVideoURL:
				"https://ik.imagekit.io/storybird/staging/videos/3c27a33f-948e-4ded-8176-074ddee93285/1_357318118.mp4?tr=f-webm", // todo: change this hardcoded value
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
