"use client";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { useEffect, useState } from "react";
import { GetImageRatio } from "@/utils/image-ratio";
import { mainSchema } from "@/api/schema";
import useWebstoryContext from "../edit-story/providers/WebstoryContext";
import Stepper from "./components/Stepper";
import { StepperStep } from "@/utils/enums";
import Navbar from "./components/Navbar";
import VideoEditorStoryboard from "./components/VideoEditorStoryboard";
import Footer from "./components/Footer";
import EditorContainer from "./components/EditorContainer";

export default function StoryScenes() {
	const router = useRouter();

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
		<div className="relative w-full mr-2 rounded-lg bg-secondary h-[calc(100vh-16px)] overflow-hidden">
			{/* Navbar */}
			<Navbar
				ImageRatio={ImageRatio}
				WebstoryData={Webstory.data}
				genre={router.query.genre!.toString()}
			/>

			{/* Stepper */}
			<Stepper step={StepperStep.Scenes} />

			{/* MainSection */}
			<div className={`flex p-2 gap-x-1.5 h-screen overflow-y-auto pb-[246px]`}>
				<EditorContainer view="story">
					<VideoEditorStoryboard
						ImageRatio={ImageRatio}
						WebstoryData={Webstory.data}
						isError={Webstory.isError}
						isLoading={isLoading}
					/>
				</EditorContainer>
			</div>

			{/* BottomBar */}
			<Footer  WebstoryData={Webstory.data}/>
		</div>
	);
}
