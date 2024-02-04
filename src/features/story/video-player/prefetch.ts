import pLimit from "p-limit";
import { prefetch } from "remotion";
import { preloadGif } from "@remotion/gif";
import { RemotionSegment } from "./constants";

const limit = pLimit(10);

const prefetchSegmentAssets = async (segment: RemotionSegment) => {
	try {
		if (segment.type === "page") {
			if (segment.visual.format === "video") {
				await prefetch(segment.visual.videoURL, {
					method: "base64",
					contentType: "video/mp4",
				}).waitUntilDone();
			}
			if (segment.visual.format === "image") {
				await prefetch(segment.visual.imageURL, {
					method: "base64",
				}).waitUntilDone();
			}
			if (segment.visual.format === "gif") {
				await preloadGif(segment.visual.gifURL).waitUntilDone();
			}
			if (segment.audioURL) {
				await prefetch(segment.audioURL, {
					contentType: "audio/mpeg",
				}).waitUntilDone();
			}
		}

		if (segment.type === "intermediate") {
			if (segment.visual.format === "video") {
				await prefetch(segment.visual.videoURL, {
					method: "base64",
					contentType: "video/mp4",
				}).waitUntilDone();
			}
			if (segment.visual.format === "image") {
				await prefetch(segment.visual.imageURL, {
					contentType: "image/gif",
					method: "base64",
				}).waitUntilDone();
			}
			if (segment.visual.format === "gif") {
				await preloadGif(segment.visual.gifURL).waitUntilDone();
			}
		}
	} catch (e) {
		console.error(e);
	}
};

export const prefetchAssets = async (segments: RemotionSegment[]) => {
	const prefetchAssetsPromises = segments.map((segment) =>
		limit(() => prefetchSegmentAssets(segment))
	);
	await Promise.all(prefetchAssetsPromises);
};
