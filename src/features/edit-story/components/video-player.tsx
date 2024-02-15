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

const VideoPlayer = () => {
	const router = useRouter();

	const [Webstory] = useWebstoryContext();

	const remotionPlayerProps = useRemotionPlayerProps({
		story: Webstory,
		selectedVoice: VoiceType.GenericFemale,
		generatedImages: Webstory.videoSegments
			?.filter((seg) => !!seg.imageKey)
			.map((seg) => ({ ...seg, src: Format.GetVideoUrl(seg.imageKey!) }))!,
	});
	return <RemotionPlayer {...remotionPlayerProps} />;
};

export default VideoPlayer;
