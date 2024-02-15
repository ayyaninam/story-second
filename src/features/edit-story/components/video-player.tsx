import Format from "@/utils/format";
import RemotionPlayer from "../video-player";
import { VoiceType } from "@/utils/enums";
import { useRemotionPlayerProps } from "../video-player/hooks";
import { FC } from "react";
import { VideoPlayerProps } from "@/types";

const VideoPlayer: FC<VideoPlayerProps> = ({
	Webstory,
	onPlay,
	onPause,
	onSeeked,
	seekedFrame,
	isPlaying,
	isMuted,
}) => {
	const remotionPlayerProps = useRemotionPlayerProps({
		story: Webstory,
		selectedVoice: VoiceType.GenericFemale,
		generatedImages: Webstory.videoSegments
			?.filter((seg) => !!seg.imageKey)
			.map((seg) => ({ ...seg, src: Format.GetVideoUrl(seg.imageKey!) }))!,
	});

	return (
		<RemotionPlayer
			{...remotionPlayerProps}
			onPlay={onPlay}
			onPause={onPause}
			onSeeked={onSeeked}
			isPlaying={isPlaying}
			seekedFrame={seekedFrame}
			isMuted={isMuted}
		/>
	);
};

export default VideoPlayer;
