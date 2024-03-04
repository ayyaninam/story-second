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
	PREMOUNT_FRAMES,
	RemotionPlayerInputProps,
	RemotionPageSegment,
	RemotionVariant,
	RemotionTransitionSegment,
} from "./constants";

const calculateSegmentDuration = async ({
	audioURL,
	isLastSegment,
}: {
	audioURL: string | null;
	isLastSegment: boolean;
}) => {
	const minContentDuration = 0 * VIDEO_FPS;

	if (!audioURL) {
		return {
			contentDuration: minContentDuration,
			durationInFrames: minContentDuration,
		};
	}

	const audioDuration = await getAudioDurationInSeconds(audioURL);

	const contentDuration = Math.max(
		minContentDuration,
		(audioDuration > 0 ? Math.ceil(audioDuration * VIDEO_FPS) : 0) +
			(isLastSegment ? INCREASED_LAST_PAGE_DURATION * VIDEO_FPS : 0)
	);

	return {
		contentDuration,
		durationInFrames: contentDuration + (isLastSegment ? PREMOUNT_FRAMES : 0),
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
		audioURL,
		isLastSegment,
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
}

export const toRemotionInputProps = async ({
	variant,
	segments,
	bottomVideoURL,
}: ToRemotionInputPropsParams): Promise<RemotionPlayerInputProps> => {
	switch (variant) {
		case "landscape":
		case "portrait":
			const allPagesSegmentsFrames = sumBy(
				segments,
				(segment: RemotionSegment) =>
					segment.type === "transition" ? 0 : segment.durationInFrames
			);

			const theEndPageFrames = 3 * VIDEO_FPS;

			return {
				showLoadingVideo: false,
				variant,
				durationInFrames: allPagesSegmentsFrames + theEndPageFrames,
				enableAudio: true,
				enableSubtitles: true,
				segments,
			};
		case "split":
			const bottomVideoDurationInFrames = Math.ceil(
				(await getVideoMetadata(bottomVideoURL as string)).durationInSeconds *
					VIDEO_FPS
			);

			const topVideoDurationInFrames = sumBy(
				segments,
				(segment: RemotionSegment) =>
					segment.type === "transition" ? 0 : segment.durationInFrames
			);

			const pagesDurationInFrames = Math.max(
				bottomVideoDurationInFrames,
				topVideoDurationInFrames
			);

			const theEndPageFramesInSplitFormat = 3 * VIDEO_FPS;

			return {
				showLoadingVideo: false,
				durationInFrames: pagesDurationInFrames + theEndPageFramesInSplitFormat,
				enableAudio: false,
				enableSubtitles: false,
				topEndDurationInFrames:
					pagesDurationInFrames - topVideoDurationInFrames,
				pagesDurationInFrames,
				variant,
				bottomVideoURL: bottomVideoURL as string,
				segments,
			};
	}
};
