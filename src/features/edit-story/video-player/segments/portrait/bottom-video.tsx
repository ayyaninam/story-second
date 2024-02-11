import React, { CSSProperties } from "react";
import { AbsoluteFill, OffthreadVideo } from "remotion";
import {
	RemotionPlayerPortraitInputProps,
	bigZIndexTrick,
} from "../../constants";

const container: CSSProperties = {
	backgroundColor: "#000000",
	top: "50%",
	zIndex: bigZIndexTrick + 1,
};

const videoStyles: CSSProperties = {
	width: "150%",
	left: -100,
	aspectRatio: "9 / 8",
};

type RenderSegmentProps = {
	inputProps: RemotionPlayerPortraitInputProps;
};

export function SegmentPortraitPortraitBottomVideo({
	inputProps: { bottomVideoURL },
}: RenderSegmentProps) {
	return (
		<AbsoluteFill style={container}>
			<OffthreadVideo src={bottomVideoURL} style={videoStyles} />
		</AbsoluteFill>
	);
}
