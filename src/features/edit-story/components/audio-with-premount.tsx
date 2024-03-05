import React from "react";
import { getRemotionEnvironment, Sequence, Audio } from "remotion";
import { Premount } from "./premount";

interface AudioWithPremountProps {
	startAudioFrom: number;
	audioURL: string;
}

export const AudioWithPremount = ({
	startAudioFrom,
	audioURL,
}: AudioWithPremountProps) => {
	const { isRendering } = getRemotionEnvironment();

	return isRendering ? (
		<Sequence from={startAudioFrom}>
			<Audio src={audioURL} />
		</Sequence>
	) : (
		<Premount for={startAudioFrom}>
			<Audio src={audioURL} />
		</Premount>
	);
};
