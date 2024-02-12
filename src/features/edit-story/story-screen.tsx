import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import Format from "@/utils/format";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import ImageLoader from "./components/image-loader";
import RemotionPlayer from "./video-player";
import { VoiceType } from "@/utils/enums";
import { useRemotionPlayerProps } from "./video-player/hooks";
import VideoPlayer from "./components/video-player";
import { FC, useEffect, useRef, useState } from "react";
import { prefetch } from "remotion";
import { mainSchema as schema } from "@/api/schema";
import { GetImageRatio } from "@/utils/image-ratio";
import { CallbackListener } from "@remotion/player";

type StoryScreenProps = {
	Webstory: schema["ReturnWebStoryDTOApiResponse"];
	isError: boolean;
	onPlay?: CallbackListener<"play">;
	onEnded?: CallbackListener<"ended">;
	onPause?: CallbackListener<"pause">;
	onSeeked?: CallbackListener<"seeked">;
	isPlaying?: boolean;
	seekedFrame?: number;
};

const StoryScreen: FC<StoryScreenProps> = ({
	Webstory,
	isError,
	onPlay,
	onPause,
	onSeeked,
	seekedFrame,
	isPlaying,
}) => {
	const router = useRouter();
	const [fetchedVideos, setFetchedVideos] = useState<string[]>([]);
	const [fetchedAudios, setFetchedAudios] = useState<string[]>([]);

	// Queries
	// const Webstory = useQuery({
	// 	queryFn: () =>
	// 		api.library.get(
	// 			router.query.genre!.toString(),
	// 			router.query.id!.toString()
	// 		),
	// 	queryKey: [QueryKeys.STORY, router.query.genre, router.query.id],
	// });

	useEffect(() => {
		console.log(">>>> webstory.data", Webstory.data);

		for (const seg of Webstory.data?.storySegments ?? []) {
			if (seg.videoKey && !fetchedVideos.includes(seg.videoKey)) {
				const url = Format.GetVideoUrl(seg.videoKey);
				const fetchedContent = prefetch(url, {
					method: "blob-url",
					contentType: "video/webm",
				})
					.waitUntilDone()
					.then((res) => {
						setFetchedVideos((prev) => [...prev, url]);
					});
			}
		}
		for (const seg of Webstory.data?.storySegments ?? []) {
			if (seg.femaleAudioKey && !fetchedAudios.includes(seg.femaleAudioKey)) {
				const url = Format.GetImageUrl(seg.femaleAudioKey);
				const fetchedContent = prefetch(url, {
					method: "blob-url",
					contentType: "audio/mpeg",
				})
					.waitUntilDone()
					.then((res) => {
						setFetchedAudios((prev) => [...prev, url]);
					});
			}
		}
	}, [Webstory.data]);

	const videoArray = Webstory.data?.storySegments
		?.filter((seg) => !!seg.videoKey)
		.map((seg) => seg.videoKey);

	const generatedImages = Webstory.data?.storySegments
		?.filter((seg) => !!seg.imageKey)
		.map((seg) => ({ ...seg, src: Format.GetImageUrl(seg.imageKey!) }));

	const areImagesLoading =
		!Webstory.data ||
		(Webstory.data?.storySegments?.filter((seg) => !!seg.imageKey)?.length ??
			0) < 2;

	const isStoryLoading =
		!Webstory.data ||
		(videoArray?.length ?? 0) !== Webstory.data.storySegments?.length ||
		// Using large vidArray length to ensure that all videos are fetched
		fetchedVideos.length < (videoArray?.length ?? 1000) ||
		fetchedAudios.length < (videoArray?.length ?? 1000);

	if (isError)
		return (
			<div
				className="bg-slate-300 rounded-t-lg lg:rounded-tr-none lg:rounded-bl-lg flex justify-center items-center"
				style={{ aspectRatio: GetImageRatio().ratio }}
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
				style={{ aspectRatio: GetImageRatio().ratio }}
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
			/>
		);
	}
};

export default StoryScreen;
