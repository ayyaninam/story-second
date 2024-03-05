"use client";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { useEffect, useState } from "react";
import { GetDisplayImageRatio, GetImageRatio } from "@/utils/image-ratio";
import { mainSchema } from "@/api/schema";
import useWebstoryContext from "../edit-story/providers/WebstoryContext";
import Stepper from "./components/Stepper";
import { StepperStep } from "@/utils/enums";
import Navbar from "./components/Navbar";

import Footer from "./components/Footer";
import EditorContainer from "./components/EditorContainer";
import SceneEditorView from "./components/SceneEditor";
import { useImmerReducer } from "use-immer";
import editStoryReducer, {
	EditStoryAction,
	EditStoryDraft,
} from "./reducers/edit-reducer";
import { WebstoryToStoryDraft } from "./utils/storydraft";

export default function StoryScenes({
	story,
	dispatch,
}: {
	story: EditStoryDraft;
	dispatch: React.Dispatch<EditStoryAction>;
}) {
	const router = useRouter();

	const [enableQuery, setEnableQuery] = useState(true);
	const [WebstoryData, setStory] = useWebstoryContext();

	// Queries
	const Webstory = useQuery<mainSchema["ReturnVideoStoryDTO"]>({
		queryFn: () =>
			api.video.get(
				router.query.genre!.toString(),
				router.query.id!.toString(),
				WebstoryData.storyType
			),
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.STORY, router.asPath],
		initialData: WebstoryData,
		refetchInterval: enableQuery ? 1000 : false,
		// Disable once all the videoKeys are obtained
	});

	useEffect(() => {
		console.log("Webstory.data", Webstory.data);
		if (Webstory.data) {
			if (
				Webstory.data?.scenes
					?.flatMap((el) => el?.videoSegments)
					?.every((segment) => !!segment?.videoKey) &&
				Webstory.data?.scenes?.flatMap((el) => el.videoSegments)?.length > 0
			) {
				console.log("All video segments are ready");
				setEnableQuery(false);
			}
			setStory(Webstory.data);
		}
	}, [Webstory.data]);

	const isLoading = Webstory.isLoading || !Webstory.data;
	const ImageRatio = GetDisplayImageRatio(Webstory.data.resolution);

	return (
		<div className="relative w-full rounded-lg bg-secondary h-[calc(100vh-16px)] overflow-hidden">
			{/* Navbar */}
			<Navbar ImageRatio={ImageRatio} WebstoryData={Webstory.data} />

			{/* Stepper */}
			<Stepper step={StepperStep.Scenes} WebstoryData={Webstory.data} />

			{/* MainSection */}
			<div className={`flex p-2 gap-x-1.5 h-screen overflow-y-auto pb-[246px]`}>
				<EditorContainer view="scene">
					<SceneEditorView
						WebstoryData={Webstory.data}
						ImageRatio={ImageRatio}
						story={story}
						dispatch={dispatch}
						isError={Webstory.isError}
					/>
				</EditorContainer>
			</div>

			{/* BottomBar */}
			<Footer
				WebstoryData={Webstory.data}
				story={story}
				dispatch={dispatch}
				view="scene"
			/>
		</div>
	);
}
