import React, { useMemo, CSSProperties } from "react";
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	OffthreadVideo,
	Img,
} from "remotion";
import {
	SILENT_DURATION,
	VIDEO_FPS,
	bigZIndexTrick,
	RemotionPageSegment,
	RemotionSegment,
	PREMOUNT_FRAMES,
	RemotionPlayerInputProps,
} from "../../constants";
import LogoWatermark from "./components/LogoWatermark";
import { AudioWithPremount } from "../../../components/audio-with-premount";

const container: CSSProperties = {
	backgroundColor: "#000000",
};

const subtitleContainer: CSSProperties = {
	justifyContent: "flex-start",
	alignItems: "center",
	paddingTop: "500px",
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
			fontSize: 48,
			width: 650,
			letterSpacing: -1,
			color: "#fff",
			"-webkit-text-stroke": "2px #000",
			textShadow: "0.04em 0.04em 0.04em black",
			fontWeight: 900,
		}),
		[]
	);

	const startAudioFrom = VIDEO_FPS * SILENT_DURATION;

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
					<p style={storyTextStyle}>{segment.storyText}</p>
				</AbsoluteFill>
			)}

			{inputProps.enableAudio && segment.audioURL && (
				<AudioWithPremount
					startAudioFrom={startAudioFrom}
					audioURL={segment.audioURL}
				/>
			)}
		</AbsoluteFill>
	);
};

export default SegmentPage;
