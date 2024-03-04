import pLimit from "p-limit";
import { RemotionPlayerInputProps, RemotionVariant } from "./constants";
import Format from "@/utils/format";
import { mainSchema } from "@/api/schema";
import {
	VoiceType,
	StoryOutputTypes,
	DisplayAspectRatios,
} from "@/utils/enums";
import {
	toRemotionInputProps,
	toRemotionSegment,
	processSegmentPromises,
} from "./composer";

type WebStory = NonNullable<
	mainSchema["ReturnVideoStoryDTO"] & {
		videoSegments: NonNullable<mainSchema["ReturnStorySegmentDTO"][]>;
	}
>;

export const getRemotionVariant = (story: WebStory): RemotionVariant => {
	const storyType: StoryOutputTypes = story.storyType;
	const imageResolution = story.resolution;

	if (storyType === StoryOutputTypes.SplitScreen) {
		return "split";
	} else if (imageResolution === DisplayAspectRatios["1024x576"]) {
		return "landscape";
	}
	return "portrait";
};

export const createSeekId = (segment: mainSchema["ReturnVideoSegmentDTO"]) =>
	`${segment.sceneId}-${segment.index}`;

const limit = pLimit(10);

export const webStoryToRemotionInputProps = async (
	story: WebStory,
	selectedVoice: VoiceType
): Promise<RemotionPlayerInputProps> => {
	const variant = getRemotionVariant(story);

	const segments = await processSegmentPromises({
		segmentsPromises: story
			.scenes!.flatMap((el) => el.videoSegments!)
			.map((segment, index, segments) => {
				let audioKey = null;
				switch (selectedVoice) {
					case VoiceType.GenericMale:
						audioKey = segment.maleAudioKey;
						break;
					case VoiceType.GenericFemale:
						audioKey = segment.femaleAudioKey;
						break;
					case VoiceType.Portuguese:
						audioKey = segment.portugueseAudioKey;
						break;
					case VoiceType.Custom:
						audioKey = segment.customAudioKey;
						break;
				}
				const audioURL = audioKey
					? Format.GetPublicBucketObjectUrl(audioKey)
					: null;

				return limit(() =>
					toRemotionSegment({
						variant,
						audioURL,
						videoURL: segment.videoKey
							? Format.GetVideoUrl(segment.videoKey)
							: null,
						imageURL: segment.imageKey
							? Format.GetVideoUrl(segment.imageKey)
							: null,
						interpolationURL: segment.frameInterpolationKey
							? Format.GetVideoUrl(segment.frameInterpolationKey)
							: null,
						coverImage: story.coverImage
							? Format.GetVideoUrl(story.coverImage)
							: null,
						storyText: segment.textContent!,
						isFirstSegment: index === 0,
						isLastSegment: segments.length - 1 === index,
						seekId: createSeekId(segment),
					})
				);
			}),
	});

	return toRemotionInputProps({
		variant,
		segments,
		bottomVideoURL: story.originalMediaKey
			? Format.GetVideoUrl(story.originalMediaKey)
			: undefined,
	});
};
