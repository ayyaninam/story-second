import React, { FC, useImperativeHandle, forwardRef, useRef } from "react";
import sumBy from "lodash/sumBy";
import Format from "@/utils/format";
import { VoiceType } from "@/utils/enums";
import { VideoPlayerProps } from "@/types";
import { mainSchema } from "@/api/schema";
import { createSeekId } from "@/features/edit-story/video-player/utils";

import RemotionPlayer, { RemotionPlayerHandle } from "../video-player";
import { useRemotionPlayerProps } from "../video-player/hooks";

export interface VideoPlayerHandler {
	seekToSegment: (segment: mainSchema["ReturnVideoSegmentDTO"]) => void;
}

const VideoPlayer: FC<
	VideoPlayerProps & {
		ref?: React.Ref<VideoPlayerHandler>;
	}
> = forwardRef<VideoPlayerHandler, VideoPlayerProps>(
	(
		{
			Webstory,
			onPlay,
			onPause,
			onSeeked,
			seekedFrame,
			isPlaying,
			isMuted,
			playerClassName,
		},
		ref
	) => {
		const remotionPlayerProps = useRemotionPlayerProps({
			story: Webstory,
			selectedVoice: VoiceType.GenericFemale,
			generatedImages: Webstory?.scenes
				?.flatMap((el) => el.videoSegments)
				?.filter((seg) => !!seg?.imageKey)
				.map((seg) => ({ ...seg, src: Format.GetVideoUrl(seg?.imageKey!) }))!,
		});

		const remotionPlayerRef = useRef<RemotionPlayerHandle | null>(null);

		useImperativeHandle(ref, () => ({
			seekToSegment: (segment) => {
				if (!remotionPlayerRef.current) {
					return;
				}
				const remotionSegments = remotionPlayerProps.inputProps.segments;
				const foundSegmentIndex = remotionSegments.findIndex(
					(remotionSegment) =>
						remotionSegment.type === "page" &&
						remotionSegment.seekId === createSeekId(segment)
				);

				if (foundSegmentIndex === -1) {
					throw new Error("Segment Index not found");
				}

				const frameSeekId = sumBy(
					remotionSegments.slice(0, foundSegmentIndex).map((segment) =>
						segment.type === "transition"
							? {
									...segment,
									durationInFrames: 0, // transitions do not take any real time
								}
							: segment
					),
					"durationInFrames"
				);

				remotionPlayerRef.current?.seekTo(frameSeekId);
			},
		}));

		return (
			<RemotionPlayer
				playerClassName={playerClassName}
				ref={remotionPlayerRef}
				{...remotionPlayerProps}
				onPlay={onPlay}
				onPause={onPause}
				onSeeked={onSeeked}
				isPlaying={isPlaying}
				seekedFrame={seekedFrame}
				isMuted={isMuted}
			/>
		);
	}
);

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
