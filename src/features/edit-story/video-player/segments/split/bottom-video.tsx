import React, { CSSProperties } from "react";
import { AbsoluteFill, OffthreadVideo } from "remotion";
import { RemotionPlayerSplitInputProps, bigZIndexTrick } from "../../constants";
import LogoWatermark from "./components/LogoWatermark";

const container: CSSProperties = {
	zIndex: bigZIndexTrick + 1,
};

const videoContainer: CSSProperties = {
	top: "50%",
};

const videoStyles: CSSProperties = {
	width: "100%",
	aspectRatio: "9 / 8",
};

type RenderSegmentProps = {
	inputProps: RemotionPlayerSplitInputProps;
};

export function SegmentSplitSplitBottomVideo({
	inputProps: { bottomVideoURL },
}: RenderSegmentProps) {
	return (
		<AbsoluteFill style={container}>
			<AbsoluteFill style={videoContainer}>
				<OffthreadVideo
					src={bottomVideoURL}
					style={videoStyles}
					pauseWhenBuffering
				/>
			</AbsoluteFill>

			<LogoWatermark />
		</AbsoluteFill>
	);
}
