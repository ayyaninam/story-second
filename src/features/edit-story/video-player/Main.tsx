import { useBufferState, continueRender, delayRender } from "remotion";
import React from "react";
import { RemotionPlayerInputProps } from "./constants";
import MainLandscape from "./segments/landscape/main";
import MainPortrait from "./segments/portrait/main";
import MainSplit from "./segments/split/main";

export const Main: React.FC<RemotionPlayerInputProps> = (props) => {
	const buffer = useBufferState();
	const [handle] = React.useState(() => delayRender());

	React.useEffect(() => {
		const delayHandle = buffer.delayPlayback();

		setTimeout(() => {
			delayHandle.unblock();
			continueRender(handle);
		}, 5000);

		return () => {
			delayHandle.unblock();
		};
		// disabled bc if I use the dependencies it breaks the "pause when buffering"
		// also I see on the docs that it's the good way "https://www.remotion.dev/docs/use-buffer-state#together-with-delayrender"
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (props.variant === "landscape") {
		return <MainLandscape {...props} />;
	} else if (props.variant === "portrait") {
		return <MainPortrait {...props} />;
	}
	return <MainSplit {...props} />;
};
