import React, { CSSProperties } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const logoWatermarkContainer: CSSProperties = {
	position: "absolute",
	top: 20,
	right: 20,
};

const logoWatermark: CSSProperties = {
	width: 200,
	opacity: 0.5,
};

export const LogoWatermark = () => (
	<AbsoluteFill>
		<div style={logoWatermarkContainer}>
			<Img
				src={staticFile("remotion/logo-watermark.svg")}
				style={logoWatermark}
			/>
		</div>
	</AbsoluteFill>
);

export default LogoWatermark;
