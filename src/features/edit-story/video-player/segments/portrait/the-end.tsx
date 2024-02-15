import React, { CSSProperties } from "react";
import {
	AbsoluteFill,
	staticFile,
	Img,
	useCurrentFrame,
	interpolate,
	useVideoConfig,
} from "remotion";
import { VIDEO_FPS, PREMOUNT_FRAMES } from "../../constants";

const logoWatermarkContainer: CSSProperties = {
	justifyContent: "center",
	alignItems: "center",
};
const logoWatermark: CSSProperties = {
	width: 300,
};

const TheEndSegment = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();

	const fadeInOpacity = interpolate(frame, [0, VIDEO_FPS], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const fadeOutOpacity = interpolate(
		frame,
		[
			durationInFrames - PREMOUNT_FRAMES - VIDEO_FPS,
			durationInFrames - PREMOUNT_FRAMES - 10, // a bit before ending video
		],
		[1, 0],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	const animatedLogoWatermark: CSSProperties = {
		...logoWatermark,
		opacity: fadeInOpacity,
	};

	const animatedContainer: CSSProperties = {
		backgroundColor: "#1e2e75",
		opacity: fadeOutOpacity,
	};

	return (
		<AbsoluteFill style={animatedContainer}>
			<AbsoluteFill style={logoWatermarkContainer}>
				<Img
					src={staticFile("remotion/logo-watermark.svg")}
					style={animatedLogoWatermark}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

export default TheEndSegment;
