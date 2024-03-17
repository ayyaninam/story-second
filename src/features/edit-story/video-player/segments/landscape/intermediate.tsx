import React, { CSSProperties } from "react";
import { AbsoluteFill, OffthreadVideo } from "remotion";
import LogoWatermark from "./components/LogoWatermark";
import { RemotionInterpolationSegment, bigZIndexTrick } from "../../constants";

const container: CSSProperties = {
	backgroundColor: "#000000",
};

const imageStyles: CSSProperties = {
	height: "100%",
};

type RenderSegmentProps = {
	segment: RemotionInterpolationSegment;
};

const SegmentIntermediate = ({ segment }: RenderSegmentProps) => {
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
};

export default SegmentIntermediate;
