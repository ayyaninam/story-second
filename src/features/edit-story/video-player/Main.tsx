import React from "react";
import { RemotionPlayerInputProps } from "./constants";
import MainLandscape from "./segments/landscape/main";
import MainPortrait from "./segments/portrait/main";
import { LoadingSegmentPage } from "./segments/loading-page";

export const Main: React.FC<RemotionPlayerInputProps> = (props) => {
	if (props.showLoadingVideo) {
		return <LoadingSegmentPage />;
	}

	if (props.variant === "landscape") {
		return <MainLandscape {...props} />;
	}
	return <MainPortrait {...props} />;
};
