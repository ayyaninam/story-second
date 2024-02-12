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

export const GetImageRatio = () => {
	return ImageRatios["9x16"];
};
