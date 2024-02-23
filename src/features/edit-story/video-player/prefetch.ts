import pLimit from "p-limit";
import { prefetch } from "remotion";
import { RemotionSegment } from "./constants";

const limit = pLimit(10);

const prefetchSegmentAssets = async (segment: RemotionSegment) => {
	try {
		if (segment.type === "page") {
			if (segment.visual?.format === "video") {
				await prefetch(segment.visual.videoURL, {
					method: "base64",
					contentType: "video/mp4",
				}).waitUntilDone();
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
