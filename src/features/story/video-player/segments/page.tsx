import React, { useMemo, CSSProperties } from "react";
import { Gif } from "@remotion/gif";
import { loadFont } from "@remotion/google-fonts/Poppins";
import {
	AbsoluteFill,
	Img,
	Audio,
	Sequence,
	useVideoConfig,
	interpolate,
	useCurrentFrame,
	Video,
	OffthreadVideo,
} from "remotion";
import {
	SILENT_DURATION,
	VIDEO_FPS,
	INCREASED_LAST_PAGE_DURATION,
	RemotionSegment,
} from "../constants";
import { Premount } from "@/features/story/components/premount";

const { fontFamily: fontFamilyPoppins } = loadFont();

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
	segment: RemotionSegment;
	isLastSegment: boolean;
};

export const SegmentPage = ({ segment, isLastSegment }: RenderSegmentProps) => {
	if (segment.type !== "page") {
		return null;
	}

	const frame = useCurrentFrame();
	const { width, height } = useVideoConfig();

	const storyTextStyle: CSSProperties = useMemo(
		() => ({
			fontFamily: fontFamilyPoppins,
			fontSize: 24,
			width: 500,
			color: "white",
		}),
		[]
	);

	const startAudioFrom = VIDEO_FPS * SILENT_DURATION;

	const percentageTextToShow = interpolate(
		frame,
		[
			startAudioFrom,
			Math.max(startAudioFrom + 1,startAudioFrom +
				segment.contentDuration -
				(isLastSegment ? INCREASED_LAST_PAGE_DURATION * VIDEO_FPS : 0)), // to avoid crashing on [N,N]
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

	return (
		<AbsoluteFill style={container}>
			<AbsoluteFill>
				<OffthreadVideo src={segment.visual.videoURL} style={imageStyles} />
			</AbsoluteFill>

			<AbsoluteFill style={subtitleContainer}>
				<p style={storyTextStyle}>{storyText}</p>
			</AbsoluteFill>

			{segment.audioURL && (
				<Sequence from={startAudioFrom}>
					<Audio src={segment.audioURL} />
				</Sequence>
			)}
		</AbsoluteFill>
	);
};
