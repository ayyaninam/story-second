import { useEffect, useState } from "react";
import { webStoryToRemotionInputProps } from "./utils";
import { RemotionPlayerInputProps, VIDEO_FPS } from "./constants";
import { VoiceType } from "@/utils/enums";
import schema from "@/api/schema";

interface useRemotionPlayerProps {
	story: schema["ReturnWebStoryDTO"] | undefined | null;
	selectedVoice: VoiceType | null;
}

export const useRemotionPlayerProps = ({
	story,
	selectedVoice,
}: useRemotionPlayerProps) => {
	const [inputProps, setInputProps] = useState<RemotionPlayerInputProps>({
		showLoadingVideo: true,
		durationInFrames: 10 * VIDEO_FPS,
		segments: [],
	});

	useEffect(() => {
		if (!story || selectedVoice === null) {
			return;
		}

		const syncDurations = async () => {
			setInputProps(await webStoryToRemotionInputProps(story, selectedVoice));
		};

		syncDurations().then();
	}, [story, selectedVoice]);

	return { inputProps };
};
