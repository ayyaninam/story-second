import React, { ComponentProps } from "react";
import { getRemotionEnvironment, Sequence, Audio } from "remotion";

import { Premount } from "./premount";

interface AudioWithPremountProps extends ComponentProps<typeof Audio> {
	startAudioFrom: number;
}

export const AudioWithPremount = ({
	startAudioFrom,
	...props
}: AudioWithPremountProps) => {
	const { isRendering } = getRemotionEnvironment();

	return isRendering ? (
		<Sequence from={startAudioFrom}>
			<Audio {...props} />
		</Sequence>
	) : (
		<Premount for={startAudioFrom}>
			<Audio {...props} />
		</Premount>
	);
};
