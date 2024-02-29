import {
	DisplayAspectRatios,
	SegmentModifications,
	StoryImageStyles,
} from "@/utils/enums";
import { ChevronRight, LayoutList, Plus, Settings2 } from "lucide-react";
import {
	EditStoryAction,
	EditStoryDraft,
	Scene,
	Segment,
	StoryStatus,
	TextStatus,
} from "../reducers/edit-reducer";
import { GenerateStoryDiff, WebstoryToStoryDraft } from "../utils/storydraft";
import { mainSchema } from "@/api/schema";
import React, { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api";
import EditSegmentModal from "./EditSegmentModal";
import { SegmentModificationData } from "@/types";
import { QueryKeys } from "@/lib/queryKeys";
import { useRouter } from "next/router";
import { VideoPlayerHandler } from "@/features/edit-story/components/video-player";
// import ScriptEditorView from "./ScriptEditorView";
// import StoryboardView from "./StoryboardViewTypesComponent";
import Editor from "./Editor";
import { cn } from "@/utils";
import Format from "@/utils/format";
import AutosizeInput from "react-input-autosize";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { GetDisplayImageRatio } from "@/utils/image-ratio";
import { Button } from "@/components/ui/button";
import SegmentImage from "./SegmentImage";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getGenreOptions } from "@/features/library/components/genre-tab-switcher";
import CategorySelect from "@/components/ui/CategorySelect";

const MAX_SUMMARY_LENGTH = 251;

export default function StoryboardEditor({
	WebstoryData,
	ImageRatio,
	isError,
	isLoading,
	story,
	dispatch,
}: {
	ImageRatio: {
		width: number;
		height: number;
		ratio: number;
		enumValue: DisplayAspectRatios;
	};
	WebstoryData?: mainSchema["ReturnVideoStoryDTO"];
	isError?: boolean;
	isLoading?: boolean;
	story: EditStoryDraft;
	dispatch: React.Dispatch<EditStoryAction>;
}) {
	const router = useRouter();
	const videoPlayerRef = useRef<VideoPlayerHandler | null>(null);
	const queryClient = useQueryClient();
	const [showFullDescription, setShowFullDescription] = useState(false);
	const [isPlaying, setIsPlaying] = useState<boolean | undefined>();
	const [seekedFrame, setSeekedFrame] = useState<number | undefined>();
	const [imageRegenerationSegmentId, setImageRegenerationSegmentId] = useState<
		number | null
	>(null);

	const [editSegmentsModalState, setEditSegmentsModalState] = useState<{
		open?: boolean;
		scene?: Scene;
		sceneId?: number;
		dispatch: React.Dispatch<EditStoryAction>;
		story: EditStoryDraft;
		sceneIndex?: number;
	}>();

	const [previousStory, setPreviousStory] = useState<EditStoryDraft>(
		WebstoryToStoryDraft(WebstoryData!)
	);

	const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);

	const diff = GenerateStoryDiff(previousStory, story);

	const EditSegment = useMutation({
		mutationFn: api.video.editSegment,
	});

	const handleSubmitEditSegments = async () => {
		const diff = GenerateStoryDiff(WebstoryToStoryDraft(WebstoryData!), story);
		console.log(diff, "updating diffing");
		const edits: SegmentModificationData[] = diff.edits.map((segment) => ({
			details: { Ind: segment.id, Text: segment.textContent },
			operation: SegmentModifications.Edit,
		}));
		const additions: SegmentModificationData[] = diff.additions
			.filter((segmentSet) => segmentSet.length > 0)
			.map((segmentSet) => ({
				details: {
					// @ts-ignore should be defined though??
					Ind: segmentSet[0].id + 1,
					segments: segmentSet.map((el) => ({
						Text: el.textContent,
						SceneId: el.sceneId,
					})),
				},
				operation: SegmentModifications.Add,
			}));
		const deletions: SegmentModificationData[] = diff.subtractions.map(
			(segment) => ({
				details: {
					Ind: segment.id,
				},
				operation: SegmentModifications.Delete,
			})
		);
		if (!additions.length && !edits.length && !deletions.length) {
			console.log("No edits found");
			return;
		}

		const editedResponse = await EditSegment.mutateAsync({
			story_id: WebstoryData?.id as string,
			story_type: WebstoryData?.storyType,
			edits: [...edits, ...additions, ...deletions],
		});
		queryClient.invalidateQueries({ queryKey: [QueryKeys.STORY] });

		const newStory = await api.video.get(
			WebstoryData?.topLevelCategory!,
			WebstoryData?.slug!,
			WebstoryData?.storyType!
		);

		setPreviousStory(WebstoryToStoryDraft(newStory));
		dispatch({ type: "reset", draft: WebstoryToStoryDraft(newStory) });
		return newStory;
	};

	const handleRegenerateSceneImages = async (sceneIndex: number) => {
		const scene = story.scenes[sceneIndex];
		if (!scene) return;
		// dispatch({
		// 	type: "update_segment_statuses",
		// 	key: "imageStatus",
		// 	segmentIndices:
		// 		scene.segments?.map((el, segmentIndex) => ({
		// 			segmentIndex,
		// 			sceneIndex,
		// 		})) ?? [],
		// 	status: StoryStatus.PENDING,
		// });

		const newStory = await handleSubmitEditSegments();

		const regeneratedImages = await api.video.regenerateAllImages({
			// @ts-expect-error
			image_style: scene.settings?.style ?? StoryImageStyles.Realistic,
			story_id: story.id,
			story_type: story.type,
			scene_id: scene.id,
		});
	};

	return (
		<>
			<div className="relative w-4/5 h-4/5 m-auto overflow-hidden bg-background rounded-md shadow-lg">
				<div className="w-full flex items-center justify-between gap-1 p-1 rounded-tl-lg rounded-tr-lg bg-primary-foreground font-normal text-xs border border-purple-500 bg-purple-100 text-purple-900">
					<div className="flex items-center gap-1">
						<LayoutList className="stroke-purple-600 mr-1 h-4 w-4" />
						<p>Storyboard View</p>
					</div>
					<div className="flex gap-1 items-center">
						<p className="px-1 text-purple-900">
							Pro Tip — You can individually regenerate images in this
							Storyboard.{" "}
							{/* <a href="#">
								<u>Learn how</u>
							</a> */}
						</p>
						{/* <Button
							variant="outline"
							className="flex gap-1 items-center h-fit py-0 text-purple-600 bg-white rounded-sm p-[1px] hover:text-purple-700 hover:cursor-pointer hover:bg-slate-50"
						>
							<SparkleIcon width={"18px"} height={"18px"} />
							<p className="text-xs">Regenerate</p>
							<ChevronDown width={"18px"} height={"18px"} />
						</Button> */}
					</div>
				</div>
				<div className="relative  px-6 pt-6 pb-2">
					<p className="text-2xl font-bold max-w-sm -tracking-[-0.6px]">
						{Format.Title(WebstoryData?.storyTitle)}
					</p>

					<div className="w-full inline-flex text-slate-400 text-xs py-1">
						{/* <div className="flex">
							Storyboard for a <u> 60 Second</u>{" "}
							<ChevronDown className="mr-2 h-4 w-4 text-xs" /> <u>Movie</u>{" "}
							<ChevronDown className="mr-2 h-4 w-4 text-xs" />
						</div>
						<div className="flex">
							<u>No Audio</u> <ChevronDown className="mr-2 h-4 w-4 text-xs" />
						</div> */}
						<CategorySelect />
						<p className="ms-1">by {WebstoryData?.user?.name}</p>
					</div>
				</div>
				<div className="flex flex-col md:flex-row items-center justify-center h-full w-full">
					<div
						className={cn(
							`w-full pb-6 bg-background  rounded-bl-lg rounded-br-lg lg:rounded-br-lg lg:rounded-bl-lg flex flex-col lg:flex-row justify-stretch h-full`
						)}
						// border-[1px]
					>
						<div
							className={`px-6 flex w-full h-full flex-col-reverse justify-between md:flex-col rounded-t-lg lg:rounded-bl-lg lg:rounded-tl-lg lg:rounded-tr-none lg:rounded-br-none`}
						>
							<div
								className="space-y-2 h-[80%] overflow-y-scroll"
								// onMouseLeave={(e) => {
								// 	setShowActionItems({});
								// }}
							>
								<Editor
									Webstory={WebstoryData!}
									dispatch={dispatch}
									story={story}
								>
									{({ handleEnter, handleInput, refs }) => {
										return (
											<div
												className={cn(
													"w-full  divide-y divide-dashed space-y-2"
												)}
											>
												{story.scenes.map((scene, sceneIndex) => (
													<div
														key={sceneIndex}
														className="px-1 flex flex-row justify-between w-full rounded-md hover:text-primary hover:bg-primary-foreground group items-center"
													>
														<div
															className={cn("gap-4 flex max-w-1/2 flex-wrap")}
														>
															{scene.segments.map((segment, segmentIndex) => {
																return (
																	<div
																		className={cn("flex gap-1 items-center")}
																		key={segmentIndex}
																	>
																		{(segment.imageStatus ===
																			StoryStatus.COMPLETE ||
																			segment.imageStatus ===
																				StoryStatus.PENDING) && (
																			<SegmentImage
																				segment={segment}
																				story={story}
																				imageRegenerationSegmentId={
																					imageRegenerationSegmentId
																				}
																				setImageRegenerationSegmentId={
																					setImageRegenerationSegmentId
																				}
																				dispatch={dispatch}
																				segmentIndex={segmentIndex}
																				sceneIndex={sceneIndex}
																			/>
																		)}
																		{segment.imageStatus ===
																			StoryStatus.READY && (
																			<div
																				className="relative max-w-full h-40"
																				style={{
																					aspectRatio: GetDisplayImageRatio(
																						story.displayResolution
																					).ratio,
																				}}
																			>
																				<div className="w-full h-full bg-slate-100 rounded-sm border border-slate-300 flex items-center justify-center border-dashed">
																					<div className="rounded-full w-6 h-6 bg-slate-200 flex items-center justify-center">
																						<Plus
																							className="text-slate-500 stroke-2"
																							width={12}
																							height={12}
																						/>
																					</div>
																				</div>
																			</div>
																		)}
																		{segmentIndex !==
																			scene.segments.length - 1 && (
																			<div className="min-w-4 min-h-4">
																				<ChevronRight
																					width={16}
																					height={16}
																					className="text-slate-500 stroke-1 min-w-4 min-h-4"
																				/>
																			</div>
																		)}
																	</div>
																);
															})}
														</div>
														<div className="w-[55%] flex justify-between items-center p-2 ">
															<div className="flex flex-wrap flex-row ">
																{scene.segments.map((segment, segmentIndex) => (
																	<span
																		key={segmentIndex}
																		style={{ backgroundColor: "transparent" }}
																		className={cn(`flex flex-wrap w-full`)}
																		onClick={() => {
																			// handleRegenerateImage(
																			// 	segment,
																			// 	sceneIndex,
																			// 	segmentIndex
																			// );
																		}}
																	>
																		<AutosizeInput
																			onKeyDown={(e) => {
																				if (e.key === "Enter") {
																					handleEnter(
																						scene,
																						sceneIndex,
																						segment,
																						segmentIndex
																					);
																				}
																			}}
																			name={segmentIndex.toString()}
																			inputClassName={cn(
																				"active:outline-none bg-transparent text-primary hover:text-slate-950 focus:text-slate-950 focus:!bg-purple-200 hover:text-slate-950 hover:!bg-purple-100 rounded-sm px-1 m-0 focus:outline-none",
																				segment.textStatus ===
																					TextStatus.EDITED && "text-slate-500"
																			)}
																			inputStyle={{
																				outline: "none",
																				backgroundColor: "inherit",
																			}}
																			// @ts-ignore
																			ref={(el) =>
																				(refs.current[sceneIndex]![
																					segmentIndex
																				] = el)
																			}
																			value={segment.textContent}
																			onChange={(e) => {
																				handleInput(
																					e,
																					scene,
																					sceneIndex,
																					segment,
																					segmentIndex
																				);
																			}}
																		/>
																	</span>
																))}
															</div>
															<div className="flex gap-x-1 p-2">
																<span
																	className="hover:bg-gray-100 cursor-pointer rounded-sm p-1"
																	onClick={() =>
																		setEditSegmentsModalState({
																			open: true,
																			dispatch: dispatch,
																			scene: scene,
																			sceneId: sceneIndex,
																			story: story,
																			sceneIndex: sceneIndex,
																		})
																	}
																>
																	<Settings2 className="w-4 h-4 stroke-slate-500" />
																</span>
															</div>
														</div>
													</div>
												))}
											</div>
										);
									}}
								</Editor>
							</div>
						</div>
					</div>
				</div>
			</div>
			{editSegmentsModalState?.scene !== undefined &&
				editSegmentsModalState?.sceneId !== undefined && (
					<EditSegmentModal
						open={
							editSegmentsModalState?.open &&
							editSegmentsModalState.scene !== undefined &&
							editSegmentsModalState.sceneId !== undefined
						}
						onClose={() => setEditSegmentsModalState(undefined)}
						handleRegenerateSceneImages={handleRegenerateSceneImages}
						scene={editSegmentsModalState?.scene!}
						sceneId={editSegmentsModalState?.sceneId}
						dispatch={dispatch}
						story={story}
						onSceneEdit={(scene, index) => {
							dispatch({
								type: "edit_scene",
								scene: scene,
								index: index,
							});
						}}
						sceneIndex={editSegmentsModalState?.sceneIndex!}
					/>
				)}
		</>
	);
}
