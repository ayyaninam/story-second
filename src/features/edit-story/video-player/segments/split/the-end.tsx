import React, { CSSProperties } from "react";
import {
	AbsoluteFill,
	staticFile,
	Img,
	useCurrentFrame,
	interpolate,
} from "remotion";
import { VIDEO_FPS, bigZIndexTrick, PREMOUNT_FRAMES } from "../../constants";

const logoWatermarkContainer: CSSProperties = {
	justifyContent: "center",
	alignItems: "center",
};

const logoWatermark: CSSProperties = {
	width: "100%",
	height: "100%",
};

const animatedContainerBase: CSSProperties = {
	backgroundColor: "#000",
	zIndex: bigZIndexTrick + 2,
};

const TheEndSegment = () => {
	const frame = useCurrentFrame();

	const fadeInOpacity = interpolate(frame, [0, PREMOUNT_FRAMES], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const containerFadeInOpacity = interpolate(frame, [0, VIDEO_FPS], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const animatedLogoWatermark: CSSProperties = {
		...logoWatermark,
		opacity: fadeInOpacity,
	};

	const animatedContainer: CSSProperties = {
		...animatedContainerBase,
		opacity: containerFadeInOpacity,
	};

	return (
		<AbsoluteFill style={animatedContainer}>
			<AbsoluteFill style={logoWatermarkContainer}>
				<Img
					src={staticFile("remotion/logo-the-end-portrait.svg")}
					style={animatedLogoWatermark}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

export default TheEndSegment;
