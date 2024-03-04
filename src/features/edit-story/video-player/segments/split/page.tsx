import React, { CSSProperties, useMemo } from "react";
import {
	AbsoluteFill,
	Audio,
	Sequence,
	interpolate,
	useCurrentFrame,
	OffthreadVideo,
	Img,
} from "remotion";
import {
	VIDEO_FPS,
	bigZIndexTrick,
	RemotionPageSegment,
	RemotionSegment,
	PREMOUNT_FRAMES,
	RemotionPlayerInputProps,
	INCREASED_LAST_PAGE_DURATION,
} from "../../constants";

const container: CSSProperties = {
	backgroundColor: "#000000",
};

const subtitleContainer: CSSProperties = {
	justifyContent: "flex-start",
	alignItems: "center",
	paddingTop: "300px",
	textAlign: "center",
};

const imageStyles: CSSProperties = {
	width: "100%",
};

type RenderSegmentProps = {
	segment: RemotionPageSegment;
	nextSegment: RemotionSegment | undefined;
	prevSegment: RemotionSegment | undefined;
	inputProps: RemotionPlayerInputProps;
};

export const SegmentSplitPage = ({
	segment,
	nextSegment,
	prevSegment,
	inputProps,
}: RenderSegmentProps) => {
	const frame = useCurrentFrame();

	const storyTextStyle: CSSProperties = useMemo(
		() => ({
			fontSize: 40,
			width: 500,
			color: "#fff",
			"-webkit-text-stroke": "2px #000",
			fontWeight: 900,
		}),
		[]
	);

	const startAudioFrom = 0;

	const percentageTextToShow = interpolate(
		frame,
		[
			startAudioFrom,
			Math.max(
				startAudioFrom + 1,
				startAudioFrom +
					segment.contentDuration -
					(!nextSegment ? INCREASED_LAST_PAGE_DURATION * VIDEO_FPS : 0)
			), // to avoid crashing on [N,N]
		],
		[0, 1],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	const storyText = useMemo(() => {
		if (!segment.storyText) {
			return "";
		}

		const numberOfWordsToShow = 3;

		const blacklist = /[,.-]/g;

		const cleanedText = segment.storyText.replace(blacklist, "").toLowerCase();
		const words = cleanedText.split(" ");

		const startIndex =
			Math.floor(percentageTextToShow * (words.length / numberOfWordsToShow)) *
			numberOfWordsToShow;

		return words.slice(startIndex, startIndex + numberOfWordsToShow).join(" ");
	}, [percentageTextToShow, segment.storyText]);

	const isFadeTransitionNext = nextSegment?.type === "transition";

	const opacity = isFadeTransitionNext
		? interpolate(
				frame,
				[
					segment.durationInFrames - PREMOUNT_FRAMES / 2,
					segment.durationInFrames,
				],
				[1, 0],
				{
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				}
			)
		: 1;

	// this trick avoids showing the next segment before it should be
	const zIndex = bigZIndexTrick - segment.index;

	return (
		<AbsoluteFill style={{ ...container, zIndex, opacity }}>
			<AbsoluteFill>
				{segment.visual?.format === "video" ? (
					<OffthreadVideo
						src={segment.visual.videoURL}
						style={imageStyles}
						playbackRate={segment.playbackRate}
					/>
				) : segment.visual?.format === "image" ? (
					<Img src={segment.visual.imageURL} />
				) : null}
			</AbsoluteFill>

			{inputProps.enableSubtitles && (
				<AbsoluteFill style={subtitleContainer}>
					<p style={storyTextStyle}>{storyText}</p>
				</AbsoluteFill>
			)}

			{inputProps.enableAudio && segment.audioURL && (
				<Sequence from={startAudioFrom}>
					<Audio src={segment.audioURL} />
				</Sequence>
			)}
		</AbsoluteFill>
	);
};
