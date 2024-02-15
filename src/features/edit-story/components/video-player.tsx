import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import Format from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import RemotionPlayer from "../video-player";
import { VoiceType } from "@/utils/enums";
import { useRemotionPlayerProps } from "../video-player/hooks";
import { mainSchema } from "@/api/schema";
import useWebstoryContext from "../providers/WebstoryContext";
import { CallbackListener } from "@remotion/player";
import { FC } from "react";
import { mainSchema as schema } from "@/api/schema";

type VideoPlayerProps = {
	Webstory: schema["ReturnVideoStoryDTO"];
	onPlay?: CallbackListener<"play">;
	onEnded?: CallbackListener<"ended">;
	onPause?: CallbackListener<"pause">;
	onSeeked?: CallbackListener<"seeked">;
	seekedFrame?: number;
	isPlaying?: boolean;
	isMuted?: boolean;
};

const VideoPlayer: FC<VideoPlayerProps> = ({
	Webstory,
	onPlay,
	onPause,
	onSeeked,
	seekedFrame,
	isPlaying,
	isMuted,
}) => {
	const router = useRouter();
	// const Webstory = useQuery({
	// 	queryFn: () =>
	// 		api.library.get(
	// 			router.query.genre!.toString(),
	// 			router.query.id!.toString()
	// 		),
	// 	queryKey: [QueryKeys.STORY, router.query.genre, router.query.id],
	// });

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
