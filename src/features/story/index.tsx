import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Loading from "./components/loading";

export default function Story() {
	// State
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

	// Mutations

	// Hooks

	// Handlers

	// Short cuts

	if (Webstory.isError) return <p>Error</p>;

	if (Webstory.isLoading || !Webstory.data) return <p>Loading story data...</p>;

	const isVideoLoading = true;
	// const isVideoLoading =
	// 	Webstory.isLoading ||
	// 	!Webstory.data ||
	// 	Webstory.data.storySegments?.reduce(
	// 		(prev, seg) => prev || !seg.videoKey,
	// 		false
	// 	);

	const generatedImages = Webstory.data.storySegments
		?.filter((seg) => seg.imageKey)
		.map((seg) => seg.imageKey!);

	return (
		<div>
			{isVideoLoading && <Loading generatedImages={generatedImages || []} />}
			{/*
			<p>{Webstory.data.storyTitle || "not loaded"}</p>
			{Webstory.data.storySegments?.map((segment) => {
				return (
					<div key={segment.index}>
						<p>{segment.textContent}</p>
						<p>{segment.imageKey}</p>
					</div>
				);
			})} */}
		</div>
	);
}

// while videoKeys are loading show images with the loading component
// fallback order is: video, image, text
// we know that the video is loading if the videoKey is not present
// we want to show a random/different image every 5 seconds
