import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import Format from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const StoryScreen = () => {
	const router = useRouter();

	// Queries
	const Webstory = useQuery({
		queryFn: () =>
			api.library.get(
				"adventure", //router.query.genre!.toString(),
				"the-lost-key-105" //router.query.id!.toString()
			),
		queryKey: [QueryKeys.STORY, router.query.genre, router.query.id],
	});
	const generatedImages = Webstory.data?.storySegments
		?.filter((seg) => seg.imageKey)
		.map((seg) => Format.GetImageUrl(seg.imageKey!));

	const areImagesLoading =
		Webstory.isLoading || !Webstory.data || !Webstory.data.imagesDone;

	const isStoryLoading =
		Webstory.isLoading || !Webstory.data || !Webstory.data.storyDone;

	if (Webstory.isError)
		return (
			<div className="h-full w-full bg-slate-300 flex justify-center items-center">
				<p className="text-xl">
					There was an error loading your story, please try again or contact
					support.
				</p>
			</div>
		);
	else if (areImagesLoading) {
		return (
			<div className="h-full w-full bg-slate-300 flex justify-center items-center">
				<p className="text-xl">Loading...</p>
			</div>
		);
	} else if (isStoryLoading) {
		return <ImageLoader />;
	} else {
		<StoryPlayer />;
	}
};

export default StoryScreen;
