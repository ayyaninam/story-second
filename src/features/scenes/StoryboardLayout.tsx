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
import VideoEditorStoryboard from "./components/VideoEditorStoryboard";
import EditorContainer from "./components/EditorContainer";
import Footer from "./components/Footer";
import { useImmerReducer } from "use-immer";
import editStoryReducer, {
	EditStoryAction,
	EditStoryDraft,
} from "./reducers/edit-reducer";
import { WebstoryToStoryDraft } from "./utils/storydraft";

export default function EditScript({
	story,
	dispatch,
}: {
	story: EditStoryDraft;
	dispatch: React.Dispatch<EditStoryAction>;
}) {
	const router = useRouter();
	const isDesktop = useMediaQuery("(min-width: 1280px)");

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
		// Disable once all the videoKeys are obtained
	});

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
			<Stepper step={StepperStep.Storyboard} />

			{/* MainSection */}
			<div className={`flex p-2 gap-x-1.5 h-screen overflow-y-auto pb-[246px]`}>
				<EditorContainer view="story">
					<VideoEditorStoryboard
						ImageRatio={ImageRatio}
						WebstoryData={Webstory.data}
						isError={Webstory.isError}
						isLoading={isLoading}
						dispatch={dispatch}
						story={story}
					/>
				</EditorContainer>
			</div>

			{/* BottomBar */}
			<Footer
				WebstoryData={Webstory.data}
				dispatch={dispatch}
				story={story}
				view="storyboard"
			/>
		</div>
	);
}
