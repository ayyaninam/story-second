import { mainSchema } from "@/api/schema";
import { getRemotionVariant } from "@/features/edit-story/video-player/utils";
import { RemotionVariant } from "@/features/edit-story/video-player/constants";
import { AspectRatios, DisplayAspectRatios } from "./enums";

export const ImageRatios = {
	"9x16": {
		width: 9,
		height: 16,
		ratio: 9 / 16,
		enumValue: AspectRatios["576x1024"],
	},
	"16x9": {
		width: 16,
		height: 9,
		ratio: 16 / 9,
		enumValue: AspectRatios["1024x576"],
	},
	"4x3": {
		width: 4,
		height: 3,
		ratio: 4 / 3,
		enumValue: AspectRatios["1024x576"], // TODO: Remove this
	},
	"3x4": {
		width: 3,
		height: 4,
		ratio: 3 / 4,
		enumValue: AspectRatios["1024x576"], // TODO: Remove this
	},
	"1x1": {
		width: 1,
		height: 1,
		ratio: 1 / 1,
		enumValue: AspectRatios["1024x1024"],
	},
	"8x9": {
		width: 8,
		height: 9,
		ratio: 8 / 9,
		enumValue: AspectRatios["1024x1152"],
	},
	"9x8": {
		width: 9,
		height: 8,
		ratio: 9 / 8,
		enumValue: AspectRatios["1152x1024"],
	},
};
export const DisplayImageRatios = {
	"9x16": {
		width: 9,
		height: 16,
		ratio: 9 / 16,
		enumValue: DisplayAspectRatios["576x1024"],
	},
	"16x9": {
		width: 16,
		height: 9,
		ratio: 16 / 9,
		enumValue: DisplayAspectRatios["1024x576"],
	},
};

export const GetImageRatio = (resolution: AspectRatios) => {
	return (
		Object.values(ImageRatios).find(
			(ratio) => ratio.enumValue === resolution
		) ?? ImageRatios["9x16"]
	);
};
export const GetDisplayImageRatio = (resolution: DisplayAspectRatios) => {
	return (
		Object.values(DisplayImageRatios).find(
			(ratio) => ratio.enumValue === resolution
		) ?? DisplayImageRatios["16x9"]
	);
};

export const GetDisplayImageRatioFromVariant = (variant: RemotionVariant) => {
	switch (variant) {
		case "landscape":
			return ImageRatios["16x9"];
		case "portrait":
			return ImageRatios["9x16"];
		case "split":
			return ImageRatios["9x16"];
	}
};
