import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import Format from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import ImageLoader from "./components/image-loader";
import RemotionPlayer from "./video-player";
import { VoiceType } from "@/utils/enums";
import { useRemotionPlayerProps } from "./video-player/hooks";
import VideoPlayer from "./components/video-player";

const StoryScreen = () => {
	const router = useRouter();

	// Queries
	const Webstory = useQuery({
		queryFn: () =>
			api.library.get(
				router.query.genre!.toString(),
				router.query.id!.toString()
			),
		queryKey: [QueryKeys.STORY, router.query.genre, router.query.id],
	});

	const generatedImages = Webstory.data?.storySegments
		?.filter((seg) => !!seg.imageKey)
		.map((seg) => ({ ...seg, src: Format.GetImageUrl(seg.imageKey!) }));

	const areImagesLoading =
		!Webstory.data ||
		(Webstory.data.storySegments?.filter((el) => el.imageKey).length ?? 0) < 2;

	const isStoryLoading =
		!Webstory.data ||
		(Webstory.data.storySegments?.filter((el) => el.videoKey).length ?? 0) !==
			Webstory.data.storySegments?.length;

	if (Webstory.isError)
		return (
			<div className="aspect-video bg-slate-300 rounded-t-lg lg:rounded-tr-none lg:rounded-bl-lg flex justify-center items-center">
				<p className="text-xl">
					There was an error loading your story, please try again or contact
					support.
				</p>
			</div>
		);
	else if (areImagesLoading) {
		return (
			<div className="aspect-video bg-slate-300 rounded-t-lg lg:rounded-tr-none lg:rounded-bl-lg flex justify-center items-center">
				<div
					className="px-4 py-1 text-white border-[0.5px]"
					style={{
						background: `linear-gradient(180deg, rgba(3, 25, 38, 0.7) 0%, rgba(3, 25, 38, 0.8) 100%)`,
						borderColor: "rgba(0, 0, 0, 0.29)",
					}}
				>
					<p className="font-medium text-lg">Working on your story...</p>
				</div>
			</div>
		);
	} else if (isStoryLoading) {
		return <ImageLoader imageData={generatedImages!} />;
	} else {
		// return <ImageLoader imageData={generatedImages!} />;
		return <VideoPlayer />;
	}
};

export default StoryScreen;
