"use client";
import {
	Compass,
	CrossIcon,
	FlipVertical,
	Menu,
	Settings2,
} from "lucide-react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { GetImageRatio } from "@/utils/image-ratio";
import { mainSchema } from "@/api/schema";
import { env } from "@/env.mjs";
import useWebstoryContext from "../edit-story/providers/WebstoryContext";
import Stepper from "./components/Stepper";
import { StepperStep } from "@/utils/enums";
import Navbar from "./components/Navbar";
import VideoEditor from "./components/VideoEditor";
import VideoEditorStoryboard from "./components/VideoEditorStoryboard";

export default function StoryScenes() {
	const router = useRouter();
	const isDesktop = useMediaQuery("(min-width: 1280px)");

	const [enableQuery, setEnableQuery] = useState(true);
	const [story, setStory] = useWebstoryContext();

	// Queries
	const Webstory = useQuery<mainSchema["ReturnVideoStoryDTO"]>({
		queryFn: () =>
			api.video.get(
				router.query.genre!.toString(),
				router.query.id!.toString(),
				story.storyType
			),
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.STORY, router.asPath],
		initialData: story,
		refetchInterval: 1000,
		// Disable once all the videoKeys are obtained
		enabled: enableQuery,
	});

	useEffect(() => {
		if (Webstory.data) {
			setEnableQuery(
				!(
					Webstory.data.scenes
						?.flatMap((el) => el.videoSegments)
						.every((segment) => !!segment?.videoKey) &&
					Webstory.data.scenes?.flatMap((el) => el.videoSegments).length > 0
				)
			);
		}
		setStory(Webstory.data);
	}, [Webstory.data]);

	const isLoading = Webstory.isLoading || !Webstory.data;
	const ImageRatio = GetImageRatio(Webstory.data.resolution);

	return (
		<div className="w-full mr-2 flex flex-col rounded-lg overflow-y-scroll bg-background h-full">
			{/* Navbar */}
			<Navbar
				ImageRatio={ImageRatio}
				WebstoryData={Webstory.data}
				genre={router.query.genre!.toString()}
			/>

			{/* Stepper */}
			<Stepper step={StepperStep.Scenes} />

			{/* MainSection */}
			<div
				className={`flex bg-background rounded-bl-lg rounded-br-lg p-2 gap-x-1.5 overflow-y-auto h-full`}
			>
				{/* <VideoEditor
					ImageRatio={ImageRatio}
					WebstoryData={Webstory.data}
					isError={Webstory.isError}
					isLoading={isLoading}
				/> */}
				<VideoEditorStoryboard
					ImageRatio={ImageRatio}
					WebstoryData={Webstory.data}
					isError={Webstory.isError}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
}
