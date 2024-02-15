import pLimit from "p-limit";
import sumBy from "lodash/sumBy";
import { v4 as uuidv4 } from "uuid";
import {
	getVideoMetadata,
	getAudioDurationInSeconds,
} from "@remotion/media-utils";
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
	PREMOUNT_FRAMES,
} from "./constants";
import { mainSchema } from "@/api/schema";
import { VoiceType, AspectRatios, StoryOutputTypes } from "@/utils/enums";
import Format from "@/utils/format";

type WebStory = NonNullable<
	mainSchema["ReturnVideoStoryDTO"] & {
		videoSegments: NonNullable<mainSchema["ReturnStorySegmentDTO"][]>;
	}
>;
type StorySegment = NonNullable<mainSchema["ReturnStorySegmentDTO"]>;

const calculateSegmentDuration = async ({
	audioURL,
	segment,
	isLastSegment,
	variant,
}: {
	audioURL: string | null;
	segment: StorySegment;
	isLastSegment: boolean;
	variant: RemotionVariant;
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
		durationInFrames:
			contentDuration +
			silentTime +
			(variant === "landscape" && isLastSegment ? PREMOUNT_FRAMES : 0), // for the end fade-in transition
	};
};

const storySegmentToRemotionSegment = async (
	segment: StorySegment,
	index: number,
	story: WebStory,
	selectedVoice: VoiceType,
	variant: RemotionVariant
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
	const isLastSegment = index === story.videoSegments.length - 1;
	const { contentDuration, durationInFrames } = await calculateSegmentDuration({
		audioURL,
		segment,
		isLastSegment,
		variant,
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
	return [
		intermediateSegment ?? transitionSegment,
		pageSegment,
		isLastSegment ? transitionSegment : undefined,
	].filter(Boolean);
};

const limit = pLimit(10);

export const webStoryToRemotionSegments = async (
	story: WebStory,
	selectedVoice: VoiceType,
	variant: RemotionVariant
): Promise<RemotionSegment[]> => {
	const storySegmentPromises = story.videoSegments.map((storySegment, index) =>
		limit(() =>
			storySegmentToRemotionSegment(
				storySegment,
				index,
				story,
				selectedVoice,
				variant
			)
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
	const variant = getRemotionVariant(story);

	const segments = await webStoryToRemotionSegments(
		story,
		selectedVoice,
		variant
	);

	// await prefetchAssets(segments);
	switch (variant) {
		case "landscape":
		case "portrait":
			const allPagesSegmentsFrames = sumBy(
				segments,
				(segment: RemotionSegment) =>
					segment.type === "transition" ? 0 : segment.durationInFrames
			);

			const theEndPageFrames = 5 * VIDEO_FPS;

			return {
				showLoadingVideo: false,
				variant,
				durationInFrames: allPagesSegmentsFrames + theEndPageFrames,
				enableAudio: true,
				enableSubtitles: true,
				segments,
			};
		case "split":
			const bottomVideoURL = Format.GetVideoUrl(story.originalMediaKey!);
			const bottomVideoDurationInFrames = Math.ceil(
				(await getVideoMetadata(bottomVideoURL)).durationInSeconds * VIDEO_FPS
			);

			const topVideoDurationInFrames = sumBy(
				segments,
				(segment: RemotionSegment) =>
					segment.type === "transition" ? 0 : segment.durationInFrames
			);

			const durationInFrames = Math.max(
				bottomVideoDurationInFrames,
				topVideoDurationInFrames
			);

			return {
				showLoadingVideo: false,
				durationInFrames,
				enableAudio: false,
				enableSubtitles: false,
				variant,
				bottomVideoURL,
				segments: extendLastSegmentOfTopVideo(segments),
			};
	}
};
