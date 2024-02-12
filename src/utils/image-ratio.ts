import { mainSchema } from "@/api/schema";
import { getRemotionVariant } from "@/features/edit-story/video-player/utils";
import { RemotionVariant } from "@/features/edit-story/video-player/constants";

export const ImageRatios = {
	"9x16": {
		width: 9,
		height: 16,
		ratio: 9 / 16,
	},
	"16x9": {
		width: 16,
		height: 9,
		ratio: 16 / 9,
	},
	"4x3": {
		width: 4,
		height: 3,
		ratio: 4 / 3,
	},
	"3x4": {
		width: 3,
		height: 4,
		ratio: 3 / 4,
	},
	"1x1": {
		width: 1,
		height: 1,
		ratio: 1 / 1,
	},
};

type GetImageRatioProps = {
	story?: mainSchema["ReturnWebStoryDTO"];
	variant?: RemotionVariant;
};

export const GetImageRatio = ({
	story,
	variant: variantProp,
}: GetImageRatioProps) => {
	if (!story && !variantProp) {
		return ImageRatios["16x9"];
	}

	// @ts-ignore
	const variant = variantProp ?? getRemotionVariant(story);

	if (variant === "split" || variant == "portrait") {
		return ImageRatios["9x16"];
	}
	return ImageRatios["16x9"];
};
