import React, { useMemo, CSSProperties } from "react";
import {
	AbsoluteFill,
	Audio,
	interpolate,
	useCurrentFrame,
	OffthreadVideo,
	Img,
} from "remotion";
import {
	SILENT_DURATION,
	VIDEO_FPS,
	INCREASED_LAST_PAGE_DURATION,
	bigZIndexTrick,
	RemotionPageSegment,
	RemotionSegment,
	PREMOUNT_FRAMES,
	RemotionPlayerInputProps,
} from "../../constants";
import LogoWatermark from "./components/LogoWatermark";
import { Premount } from "../../../components/premount";

const container: CSSProperties = {
	backgroundColor: "#000000",
};

const subtitleContainer: CSSProperties = {
	justifyContent: "flex-start",
	alignItems: "center",
	paddingTop: "600px",
	textAlign: "center",
};

const imageStyles: CSSProperties = {
	height: "100%",
};

type RenderSegmentProps = {
	segment: RemotionPageSegment;
	nextSegment: RemotionSegment | undefined;
	prevSegment: RemotionSegment | undefined;
	inputProps: RemotionPlayerInputProps;
};

const SegmentPage = ({
	segment,
	nextSegment,
	prevSegment,
	inputProps,
}: RenderSegmentProps) => {
	const frame = useCurrentFrame();

	const storyTextStyle: CSSProperties = useMemo(
		() => ({
			fontSize: 32,
			width: 500,
			color: "#fff",
			"-webkit-text-stroke": "1.5px #000",
			fontWeight: 900,
		}),
		[]
	);

	const startAudioFrom = VIDEO_FPS * SILENT_DURATION;

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

		const numberOfWordsToShow = 4;

		const words = segment.storyText.toLowerCase().split(" ");

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

			<LogoWatermark />

			{inputProps.enableSubtitles && (
				<AbsoluteFill style={subtitleContainer}>
					<p style={storyTextStyle}>{storyText}</p>
				</AbsoluteFill>
			)}

			{inputProps.enableAudio && segment.audioURL && (
				<Premount for={startAudioFrom}>
					<Audio src={segment.audioURL} />
				</Premount>
			)}
		</AbsoluteFill>
	);
};

export default SegmentPage;
