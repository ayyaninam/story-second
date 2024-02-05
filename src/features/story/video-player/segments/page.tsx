import React, { useMemo, CSSProperties } from "react";
import {
	AbsoluteFill,
	Audio,
	Sequence,
	interpolate,
	useCurrentFrame,
	OffthreadVideo,
	Video,
} from "remotion";
import {
	SILENT_DURATION,
	VIDEO_FPS,
	INCREASED_LAST_PAGE_DURATION,
	RemotionPageSegment,
	bigZIndexTrick,
} from "../constants";
import { Premount } from "@/features/story/components/premount";

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
	isLastSegment: boolean;
};

export const SegmentPage = ({ segment, isLastSegment }: RenderSegmentProps) => {
	const frame = useCurrentFrame();

	const storyTextStyle: CSSProperties = useMemo(
		() => ({
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
			Math.max(
				startAudioFrom + 1,
				startAudioFrom +
					segment.contentDuration -
					(isLastSegment ? INCREASED_LAST_PAGE_DURATION * VIDEO_FPS : 0)
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

	// this trick avoids showing the next segment before it should be
	const zIndex = bigZIndexTrick - segment.index;

	return (
		<AbsoluteFill
			style={{ ...container, zIndex }}
			className="rounded-t-lg lg:rounded-tr-none"
		>
			<AbsoluteFill>
				<Video
					src={segment.visual.videoURL}
					style={imageStyles}
					className="rounded-t-lg lg:rounded-tr-none"
				/>
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
