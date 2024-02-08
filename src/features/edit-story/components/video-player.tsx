import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import Format from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import RemotionPlayer from "../video-player";
import { VoiceType } from "@/utils/enums";
import { useRemotionPlayerProps } from "../video-player/hooks";

const VideoPlayer = () => {
	const router = useRouter();
	const Webstory = useQuery({
		queryFn: () =>
			api.library.get(
				router.query.genre!.toString(),
				router.query.id!.toString()
			),
		queryKey: [QueryKeys.STORY, router.query.genre, router.query.id],
	});

	const remotionPlayerProps = useRemotionPlayerProps({
		story: Webstory.data,
		selectedVoice: VoiceType.GenericFemale,
		generatedImages: Webstory.data?.storySegments
			?.filter((seg) => !!seg.imageKey)
			.map((seg) => ({ ...seg, src: Format.GetVideoUrl(seg.imageKey!) }))!,
	});
	return <RemotionPlayer {...remotionPlayerProps} />;
};

export default VideoPlayer;
