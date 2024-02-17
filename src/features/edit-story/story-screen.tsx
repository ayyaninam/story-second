import Format from "@/utils/format";
import ImageLoader from "./components/image-loader";
import VideoPlayer from "./components/video-player";
import { FC, useEffect, useState } from "react";
import { prefetch } from "remotion";
import { GetImageRatio } from "@/utils/image-ratio";
import { VideoPlayerProps } from "@/types";

const StoryScreen: FC<VideoPlayerProps> = ({
	Webstory,
	isError,
	onPlay,
	onPause,
	onSeeked,
	seekedFrame,
	isPlaying,
	isMuted,
}) => {
	const [fetchedVideos, setFetchedVideos] = useState<string[]>([]);
	const [fetchedAudios, setFetchedAudios] = useState<string[]>([]);

	useEffect(() => {
		for (const seg of Webstory?.videoSegments ?? []) {
			if (seg.videoKey && !fetchedVideos.includes(seg.videoKey)) {
				const url = Format.GetVideoUrl(seg.videoKey);
				const fetchedContent = prefetch(url, {
					method: "blob-url",
					contentType: "video/mp4",
				})
					.waitUntilDone()
					.then((res) => {
						setFetchedVideos((prev) => [...prev, url]);
					})
					.catch((e) => console.error(e)); // I think the errors are about cors
			}
		}
		for (const seg of Webstory?.videoSegments ?? []) {
			if (seg.femaleAudioKey && !fetchedAudios.includes(seg.femaleAudioKey)) {
				const url = Format.GetImageUrl(seg.femaleAudioKey);
				const fetchedContent = prefetch(url, {
					method: "blob-url",
					contentType: "audio/mpeg",
				})
					.waitUntilDone()
					.then((res) => {
						setFetchedAudios((prev) => [...prev, url]);
					})
					.catch((e) => console.error(e)); // I think the errors are about cors
			}
		}
		const originalTikTokVideoKey = Webstory?.originalMediaKey;
		if (
			originalTikTokVideoKey &&
			!fetchedVideos.includes(originalTikTokVideoKey)
		) {
			const url = Format.GetVideoUrl(originalTikTokVideoKey);
			prefetch(url, {
				method: "blob-url",
				contentType: "video/webm",
			})
				.waitUntilDone()
				.then(() => {
					setFetchedVideos((prev) => [...prev, url]);
				});
		}
	}, [Webstory]);

	const videoArray = Webstory?.videoSegments
		?.filter((seg) => !!seg.videoKey)
		.map((seg) => seg.videoKey);

	const generatedImages = Webstory?.videoSegments
		?.filter((seg) => !!seg.imageKey)
		.map((seg) => ({ ...seg, src: Format.GetImageUrl(seg.imageKey!) }));

	const areImagesLoading =
		!Webstory ||
		(Webstory.videoSegments?.filter((seg) => !!seg.imageKey)?.length ?? 0) < 2;

	const originalTikTokVideoKey = Webstory?.originalMediaKey;
	const hasOriginalTikTokVideoKey = Boolean(originalTikTokVideoKey);

	const isStoryLoading =
		!Webstory ||
		(videoArray?.length ?? 0) !== Webstory.videoSegments?.length ||
		// Using large vidArray length to ensure that all videos are fetched
		fetchedVideos.length < (videoArray?.length ?? 1000) ||
		fetchedAudios.length < (videoArray?.length ?? 1000) ||
		(hasOriginalTikTokVideoKey &&
			!fetchedVideos.includes(Format.GetVideoUrl(originalTikTokVideoKey!)));

	const ImageRatio = GetImageRatio(Webstory?.resolution);

	if (isError)
		return (
			<div
				className="bg-slate-300 rounded-t-lg lg:rounded-tr-none lg:rounded-bl-lg flex justify-center items-center"
				style={{ aspectRatio: ImageRatio.ratio }}
			>
				<p className="text-xl">
					There was an error loading your story, please try again or contact
					support.
				</p>
			</div>
		);
	else if (areImagesLoading) {
		return (
			<div
				className="bg-slate-300 rounded-t-lg lg:rounded-tr-none  lg:rounded-bl-lg flex justify-center items-end"
				style={{ aspectRatio: ImageRatio.ratio }}
			>
				<div
					className="px-4 py-1 text-white border-[0.5px] mb-16"
					style={{
						background: `linear-gradient(180deg, rgba(3, 25, 38, 0.7) 0%, rgba(3, 25, 38, 0.8) 100%)`,
						borderColor: "rgba(0, 0, 0, 0.29)",
					}}
				>
					<p className="font-medium font-mono text-lg">
						Working on your story...
					</p>
				</div>
			</div>
		);
	} else if (isStoryLoading) {
		return <ImageLoader imageData={generatedImages!} />;
	} else {
		return (
			<VideoPlayer
				Webstory={Webstory}
				onPlay={onPlay}
				onPause={onPause}
				onSeeked={onSeeked}
				isPlaying={isPlaying}
				seekedFrame={seekedFrame}
				isMuted={isMuted}
			/>
		);
	}
};

export default StoryScreen;
