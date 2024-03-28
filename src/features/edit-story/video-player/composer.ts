import sumBy from "lodash/sumBy";
import { takeWhile } from "lodash";
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
	PREMOUNT_FRAMES,
	RemotionPlayerInputProps,
	RemotionPageSegment,
	RemotionVariant,
	RemotionTransitionSegment,
	THE_END_DURATION,
} from "./constants";

const calculateSegmentDuration = async ({
	variant,
	audioURL,
	isLastSegment,
	storyText,
}: {
	variant: RemotionVariant;
	audioURL: string | null;
	isLastSegment: boolean;
	storyText: string;
}) => {
	const minContentDuration = variant === "split" ? 101 : 0; // 101 because it's the result of this formula: 3.3667 * VIDEO_FPS(which is 30) = 101

	const silentTime = 2 * SILENT_DURATION * VIDEO_FPS;

	if (!audioURL) {
		return {
			contentDuration: minContentDuration,
			durationInFrames: minContentDuration + silentTime,
		};
	}

	const audioDuration = await getAudioDurationInSeconds(audioURL);

	const contentDuration = Math.max(
		minContentDuration,
		(audioDuration > 0 ? Math.ceil(audioDuration * VIDEO_FPS) : 0) +
			(isLastSegment && variant !== "split"
				? INCREASED_LAST_PAGE_DURATION * VIDEO_FPS
				: 0)
	);

	const dotExtraDuration = storyText.endsWith(".") ? 8 : 0;

	return {
		contentDuration,
		durationInFrames:
			contentDuration +
			silentTime +
			(isLastSegment ? PREMOUNT_FRAMES : 0) +
			dotExtraDuration,
	};
};

type ToRemotionSegmentProps = {
	variant: RemotionVariant;
	audioURL: string | null;
	storyText: string;
	videoURL: string | null;
	imageURL: string | null;
	interpolationURL: string | null;
	coverImage: string | null;
	isFirstSegment: boolean;
	isLastSegment: boolean;
	seekId: string;
};

export const toRemotionSegment = async ({
	variant,
	audioURL,
	storyText,
	videoURL,
	imageURL,
	interpolationURL,
	coverImage,
	isFirstSegment,
	isLastSegment,
	seekId,
}: ToRemotionSegmentProps): Promise<Omit<RemotionSegment, "index">[]> => {
	const { contentDuration, durationInFrames } = await calculateSegmentDuration({
		variant,
		audioURL,
		isLastSegment,
		storyText,
	});

	let pageSegment: Omit<RemotionPageSegment, "index"> | null = {
		type: "page",
		id: uuidv4(),
		storyText,
		audioURL,
		durationInFrames,
		contentDuration,
		playbackRate: 1,
		seekId,
	};

	if (videoURL) {
		pageSegment = {
			...pageSegment,
			playbackRate: Math.min(
				1,
				((await getVideoMetadata(videoURL)).durationInSeconds * VIDEO_FPS) /
					contentDuration
			),
			visual: {
				format: "video",
				videoURL,
			},
		};
	} else if (imageURL) {
		pageSegment = {
			...pageSegment,
			visual: {
				format: "image",
				imageURL,
			},
		};
	}

	let coverImageSegment: Omit<RemotionPageSegment, "index"> | null = null;
	if (coverImage) {
		coverImageSegment = {
			type: "page",
			id: uuidv4(),
			storyText: "",
			durationInFrames: 1.5 * VIDEO_FPS,
			contentDuration: 1.5 * VIDEO_FPS,
			playbackRate: 1,
			visual: {
				format: "image",
				imageURL: coverImage,
			},
			seekId: "",
		};
	}

	const transitionSegment: RemotionTransitionSegment = {
		type: "transition",
		id: uuidv4(),
		durationInFrames: VIDEO_FPS,
		playbackRate: 1,
	};

	// @ts-ignore
	return [
		isFirstSegment ? coverImageSegment : undefined,
		isFirstSegment ? transitionSegment : undefined,
		pageSegment,
		isLastSegment && (variant === "landscape" || variant === "portrait")
			? transitionSegment
			: undefined,
	].filter(Boolean);
};

interface ProcessSegmentPromisesParams {
	segmentsPromises: Promise<Omit<RemotionSegment, "index">[]>[];
}

export const processSegmentPromises = async ({
	segmentsPromises,
}: ProcessSegmentPromisesParams): Promise<RemotionSegment[]> => {
	const segments = await Promise.all(segmentsPromises);

	// @ts-ignore
	return segments.flat().map((segment, index) => ({ ...segment, index }));
};

interface ToRemotionInputPropsParams {
	variant: RemotionVariant;
	segments: RemotionSegment[];
	bottomVideoURL?: string;
	backgroundAudioURL?: string;
	enableBackgroundAudioFadeOutEffect: boolean;
	renderedVideoURL?: string;
}

export const toRemotionInputProps = async ({
	variant,
	segments,
	bottomVideoURL,
	backgroundAudioURL,
	enableBackgroundAudioFadeOutEffect,
	renderedVideoURL,
}: ToRemotionInputPropsParams): Promise<RemotionPlayerInputProps> => {
	switch (variant) {
		case "landscape":
		case "portrait":
			const allPagesSegmentsFrames = sumBy(
				segments,
				(segment: RemotionSegment) =>
					segment.type === "transition" ? 0 : segment.durationInFrames
			);

			return {
				showLoadingVideo: false,
				variant,
				durationInFrames: allPagesSegmentsFrames + THE_END_DURATION,
				enableAudio: true,
				enableSubtitles: true,
				segments,
				backgroundAudioURL,
				enableBackgroundAudioFadeOutEffect,
				renderedVideoURL,
			};
		case "split":
			const bottomVideoDurationInFrames = Math.ceil(
				(await getVideoMetadata(bottomVideoURL as string)).durationInSeconds *
					VIDEO_FPS
			);

			let prevDurationsInFrames = PREMOUNT_FRAMES;
			let tookLastSegment = false;

			const segmentsWithLastSegmentCutoff: RemotionSegment[] = takeWhile(
				segments,
				(segment) => {
					if (tookLastSegment) {
						return false;
					}
					if (segment.type !== "page") {
						return true;
					}

					if (
						prevDurationsInFrames + segment.durationInFrames >
						bottomVideoDurationInFrames
					) {
						tookLastSegment = true;
						return true;
					}

					prevDurationsInFrames += segment.durationInFrames;
					return true;
				}
			);

			if (!tookLastSegment) {
				prevDurationsInFrames -=
					// @ts-ignore
					segmentsWithLastSegmentCutoff[
						segmentsWithLastSegmentCutoff.length - 1
					].durationInFrames;
			}

			// @ts-ignore
			segmentsWithLastSegmentCutoff[segmentsWithLastSegmentCutoff.length - 1] =
				{
					...segmentsWithLastSegmentCutoff[
						segmentsWithLastSegmentCutoff.length - 1
					],
					durationInFrames:
						bottomVideoDurationInFrames -
						prevDurationsInFrames +
						PREMOUNT_FRAMES,
				};

			return {
				showLoadingVideo: false,
				durationInFrames:
					bottomVideoDurationInFrames + (THE_END_DURATION + PREMOUNT_FRAMES),
				enableAudio: false,
				enableSubtitles: false,
				pagesDurationInFrames: bottomVideoDurationInFrames + PREMOUNT_FRAMES,
				variant,
				bottomVideoURL: bottomVideoURL as string,
				segments: segmentsWithLastSegmentCutoff,
				renderedVideoURL,
			};
	}
};
