import pLimit from "p-limit";
import { v4 as uuidv4 } from "uuid";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import {
	RemotionSegment,
	VIDEO_FPS,
	INCREASED_LAST_PAGE_DURATION,
	SILENT_DURATION,
	RemotionPlayerInputProps,
} from "./constants";
import { prefetchAssets } from "./prefetch";
import schema from "@/api/schema";
import { VoiceType } from "@/utils/enums";
import { env } from "@/env.mjs";
import Format from "@/utils/format";

const IMAGE_BASE_URL = env.NEXT_PUBLIC_S3_BUCKET_PUBLIC;
const AUDIO_BASE_URL = env.NEXT_PUBLIC_IMAGEKIT_URL;

type WebStory = NonNullable<
	schema["ReturnWebStoryDTO"] & {
		storySegments: NonNullable<schema["ReturnStorySegmentDTO"][]>;
	}
>;
type StorySegment = NonNullable<schema["ReturnStorySegmentDTO"]>;

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
): Promise<RemotionSegment[]> => {
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
	let mainPage: RemotionSegment | null = null;
	if (segment.videoKey) {
		mainPage = {
			type: "page",
			id: uuidv4(),
			storyText: segment.textContent ?? "",
			visual: {
				format: "video",
				videoURL: Format.GetImageUrl(segment.videoKey),
			},
			audioURL,
			durationInFrames: durationInFrames,
			contentDuration: contentDuration,
		};
	}

	let intermediatePage: RemotionSegment | null = null;
	if (segment.frameInterpolationKey) {
		intermediatePage = {
			type: "intermediate",
			id: uuidv4(),
			visual: {
				format: "video",
				videoURL: Format.GetImageUrl(segment.frameInterpolationKey),
			},
			durationInFrames: 17,
		};
	}

	// @ts-ignore
	return [intermediatePage, mainPage].filter(Boolean);
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

	return segments.flat();
};

export const webStoryToRemotionInputProps = async (
	story: WebStory,
	selectedVoice: VoiceType
): Promise<RemotionPlayerInputProps> => {
	const segments = await webStoryToRemotionSegments(story, selectedVoice);

	await prefetchAssets(segments);

	const durationInFrames = segments.reduce(
		(acc, segment) => acc + segment.durationInFrames,
		0
	);

	return {
		showLoadingVideo: false,
		durationInFrames,
		segments,
	};
};
