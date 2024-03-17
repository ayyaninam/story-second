import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { AudioWithPremount } from "../../../components/audio-with-premount";
import { THE_END_DURATION, VIDEO_FPS, PREMOUNT_FRAMES } from "../../constants";

const volume = 0.5;

const BackgroundAudio = ({
	backgroundAudioUrl,
	durationInFrames,
	enableBackgroundAudioFadeOutEffect,
}: {
	backgroundAudioUrl: string;
	durationInFrames: number;
	enableBackgroundAudioFadeOutEffect: boolean;
}) => {
	return (
		<AbsoluteFill>
			<AudioWithPremount
				startAudioFrom={0}
				src={backgroundAudioUrl}
				loop
				pauseWhenBuffering
				volume={(f) =>
					enableBackgroundAudioFadeOutEffect
						? interpolate(
								f,
								[
									durationInFrames -
										THE_END_DURATION -
										2 * VIDEO_FPS -
										PREMOUNT_FRAMES,
									durationInFrames - THE_END_DURATION - PREMOUNT_FRAMES,
								],
								[volume, 0],
								{
									extrapolateRight: "clamp",
									extrapolateLeft: "clamp",
								}
							)
						: volume
				}
			/>
		</AbsoluteFill>
	);
};

export default BackgroundAudio;
