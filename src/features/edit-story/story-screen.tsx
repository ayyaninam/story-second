import Format from "@/utils/format";
import ImageLoader from "./components/image-loader";
import VideoPlayer, { VideoPlayerHandler } from "./components/video-player";
import { FC, useEffect, useState, useRef, forwardRef } from "react";
import { prefetch } from "remotion";
import { GetDisplayImageRatio } from "@/utils/image-ratio";
import { VideoPlayerProps } from "@/types";
import { mainSchema } from "@/api/schema";

const loadingTexts = [
	"Starting your story",
	"Building the characters",
	"Creating the narration",
	"Generating the plot",
	"Adding the climax",
	"Finalizing the story",
	"Almost there",
	"Finishing up",
];

const StoryScreen: FC<
	VideoPlayerProps & {
		ref?: React.Ref<VideoPlayerHandler>;
	}
> = forwardRef<VideoPlayerHandler, VideoPlayerProps>(
	(
		{
			Webstory,
			isError,
			onPlay,
			onPause,
			onSeeked,
			seekedFrame,
			isPlaying,
			isMuted,
			defaultLoadingText,
		},
		ref
	) => {
		const [fetchedVideos, setFetchedVideos] = useState<string[]>([]);
		const [fetchedAudios, setFetchedAudios] = useState<string[]>([]);
		const [loadingTextIndex, setLoadingTextIndex] = useState<number>(0);

		useEffect(() => {
			for (const seg of Webstory?.scenes?.flatMap((el) => el.videoSegments) ??
				[]) {
				if (seg?.videoKey && !fetchedVideos.includes(seg.videoKey)) {
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
			for (const seg of Webstory?.scenes?.flatMap((el) => el.videoSegments) ??
				[]) {
				if (
					seg?.femaleAudioKey &&
					!fetchedAudios.includes(seg.femaleAudioKey)
				) {
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
				})
					.waitUntilDone()
					.then(() => {
						setFetchedVideos((prev) => [...prev, url]);
					});
			}
		}, [Webstory]);

		useEffect(() => {
			const timePerText = 5000;
			const interval = setInterval(() => {
				setLoadingTextIndex((prev) => prev + 1);
			}, timePerText);
			setTimeout(
				() => {
					clearInterval(interval);
				},
				timePerText * (loadingTexts.length - 1)
			);
		}, []);

		const videoArray = Webstory?.scenes
			?.flatMap((el) => el.videoSegments)
			?.filter((seg) => !!seg?.videoKey)
			.map((seg) => seg?.videoKey);

		const generatedImages = Webstory?.scenes
			?.flatMap((el) => el.videoSegments)
			?.filter((seg) => !!seg?.imageKey)
			.map((seg) => ({ ...seg, src: Format.GetImageUrl(seg?.imageKey!) }));

		const areImagesLoading =
			!Webstory ||
			(Webstory.scenes
				?.flatMap((el) => el.videoSegments)
				?.filter((seg) => !!seg?.imageKey)?.length ?? 0) < 2;

		const ImageRatio = GetDisplayImageRatio(Webstory?.resolution);

		console.log(Webstory?.scenes);

		const originalTrendsVideoKey = Webstory?.originalMediaKey;
		const hasOriginalTrendsVideoKey = Boolean(originalTrendsVideoKey);

		const isStoryLoading =
			!Webstory ||
			(videoArray?.length ?? 0) !==
				Webstory.scenes?.flatMap((el) => el.videoSegments)?.length ||
			// Using large vidArray length to ensure that all videos are fetched
			fetchedVideos.length < (videoArray?.length ?? 1000) ||
			fetchedAudios.length < (videoArray?.length ?? 1000) ||
			(hasOriginalTrendsVideoKey &&
				!fetchedVideos.includes(Format.GetVideoUrl(originalTrendsVideoKey!)));

		const videoPlayerRef = useRef<VideoPlayerHandler | null>(null);

		const seekToSegment = (segment: mainSchema["ReturnVideoSegmentDTO"]) => {
			videoPlayerRef.current?.seekToSegment(segment);
		};

		console.log(Webstory?.scenes);

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
						className="bg-slate-300 rounded-t-lg lg:rounded-tr-none lg:rounded-bl-lg flex justify-center items-center"
						style={{ aspectRatio: ImageRatio.ratio }}
					>
						<p className="text-xl">
							There was an error loading your story, please try again or contact
							support.
						</p>
					</div>
				</div>
			);
		} else if (areImagesLoading) {
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
							{defaultLoadingText ||
								loadingTexts[loadingTextIndex % loadingTexts.length]}
						</p>
					</div>
				</div>
			);
		} else if (isStoryLoading) {
			return (
				<ImageLoader
					imageData={generatedImages!}
					defaultLoadingText={defaultLoadingText}
				/>
			);
		} else {
			return (
				<VideoPlayer
					playerClassName="rounded-tl-lg rounded-bl-lg"
					ref={ref}
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
	}
);

StoryScreen.displayName = "StoryScreen";

export default StoryScreen;
