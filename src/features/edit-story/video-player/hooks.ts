import { useEffect, useState } from "react";
import { webStoryToRemotionInputProps } from "./utils";
import { RemotionPlayerInputProps, VIDEO_FPS } from "./constants";
import { VoiceType } from "@/utils/enums";
import schema from "@/api/schema";
import { components } from "@/api/types";

interface useRemotionPlayerProps {
	story: schema["ReturnWebStoryDTO"] | undefined | null;
	selectedVoice: VoiceType | null;
	generatedImages: (components["schemas"]["ReturnStorySegmentDTO"] & {
		src: string;
	})[];
}

export const useRemotionPlayerProps = ({
	story,
	selectedVoice,
	generatedImages,
}: useRemotionPlayerProps) => {
	const [inputProps, setInputProps] = useState<RemotionPlayerInputProps>({
		showLoadingVideo: true,
		durationInFrames: 10 * VIDEO_FPS,
		segments: [],
		// @ts-ignore
		generatedImages,
	});

	useEffect(() => {
		if (!story || selectedVoice === null) {
			return;
		}

		const syncDurations = async () => {
			// @ts-expect-error Haven't typed this yet fully
			setInputProps(await webStoryToRemotionInputProps(story, selectedVoice));
		};

		syncDurations().then();
	}, [story, selectedVoice]);

	return { inputProps };
};
