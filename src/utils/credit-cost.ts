import { IMAGE_COST, VIDEO_COST } from "@/constants/constants";

export const getImageCost = (numImages: number) => {
	return numImages * IMAGE_COST;
};
export const getVideoCost = (numVideos: number) => {
	return numVideos * VIDEO_COST;
};
