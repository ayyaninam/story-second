import React, { CSSProperties } from "react";
import { AbsoluteFill, OffthreadVideo } from "remotion";
import { RemotionInterpolationSegment, bigZIndexTrick } from "../../constants";
import LogoWatermark from "./components/LogoWatermark";

const container: CSSProperties = {
	backgroundColor: "#000000",
};

const imageStyles: CSSProperties = {
	width: "100%",
};

type RenderSegmentProps = {
	segment: RemotionInterpolationSegment;
};

export function SegmentPortraitIntermediate({ segment }: RenderSegmentProps) {
	// this trick avoids showing the next segment before it should be
	const zIndex = bigZIndexTrick - segment.index;

	return (
		<AbsoluteFill style={{ ...container, zIndex }}>
			<OffthreadVideo
				src={segment.visual.videoURL}
				style={imageStyles}
				playbackRate={segment.playbackRate}
				pauseWhenBuffering
			/>

			<LogoWatermark />
		</AbsoluteFill>
	);
}
