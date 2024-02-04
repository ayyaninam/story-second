import React, { CSSProperties } from "react";
import { AbsoluteFill, Video, OffthreadVideo } from "remotion";
import { RemotionSegment } from "../constants";

const container: CSSProperties = {
	backgroundColor: "#000000",
};

const imageStyles: CSSProperties = {
	height: "100%",
};

type RenderSegmentProps = {
	segment: RemotionSegment;
};

export function SegmentIntermediate({ segment }: RenderSegmentProps) {
	return (
		<AbsoluteFill style={container}>
			<AbsoluteFill>
				<OffthreadVideo src={segment.visual.videoURL} style={imageStyles} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
}
