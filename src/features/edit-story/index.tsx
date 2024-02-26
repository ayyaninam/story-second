"use client";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { StepperStep } from "@/utils/enums";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { GetDisplayImageRatio } from "@/utils/image-ratio";
import { mainSchema } from "@/api/schema";
import useWebstoryContext from "./providers/WebstoryContext";
import Stepper from "../scenes/components/Stepper";
import Navbar from "../scenes/components/Navbar";
import Footer from "../scenes/components/Footer";
import EditorContainer from "../scenes/components/EditorContainer";
import { useImmerReducer } from "use-immer";
import editStoryReducer, {
	EditStoryAction,
	EditStoryDraft,
} from "@/features/scenes/reducers/edit-reducer";
import { WebstoryToStoryDraft } from "@/features/scenes/utils/storydraft";
import PreviewEditor from "./components/preview-editor";

export default function EditStory() {
	const router = useRouter();

	const [enableQuery, setEnableQuery] = useState(true);
	const [storyData, setStory] = useWebstoryContext();

	// Queries
	const Webstory = useQuery<mainSchema["ReturnVideoStoryDTO"]>({
		queryFn: () =>
			api.video.get(
				router.query.genre!.toString(),
				router.query.id!.toString(),
				storyData.storyType
			),
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.STORY, router.asPath],
		initialData: storyData,
		refetchInterval: 1000,
		// Disable once all the videoKeys are obtained
		enabled: enableQuery,
	});

	const [story, dispatch] = useImmerReducer<EditStoryDraft, EditStoryAction>(
		editStoryReducer,
		WebstoryToStoryDraft(Webstory.data!)
	);

	useEffect(() => {
		if (Webstory.data) {
			setEnableQuery(
				!(
					Webstory.data.scenes
						?.flatMap((el) => el.videoSegments)
						.every((segment) => !!segment?.videoKey) &&
					Webstory.data.scenes?.flatMap((el) => el.videoSegments)?.length > 0
				)
			);
		}
		setStory(Webstory.data);
	}, [Webstory.data]);

	const isLoading = Webstory.isLoading || !Webstory.data;
	const ImageRatio = GetDisplayImageRatio(Webstory.data.resolution);

	return (
		<div className=" w-full mr-2 rounded-lg bg-secondary h-[calc(100vh-16px)] overflow-hidden">
			{/* Navbar */}
			<Navbar
				ImageRatio={ImageRatio}
				WebstoryData={Webstory.data}
				genre={router.query.genre!.toString()}
			/>

			{/* Stepper */}
			<Stepper step={StepperStep.Preview} />

			{/* MainSection */}
			<div className={`flex p-2 gap-x-1.5 h-screen overflow-y-auto pb-[246px]`}>
				<EditorContainer view="preview">
					<PreviewEditor
						ImageRatio={ImageRatio}
						WebstoryData={Webstory.data}
						isLoading={isLoading}
						isError={Webstory.isError}
					/>
				</EditorContainer>
			</div>

			{/* BottomBar */}
			<Footer
				WebstoryData={Webstory.data}
				story={story}
				dispatch={dispatch}
				view="preview"
			/>
		</div>
	);
}
