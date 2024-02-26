import {
	AspectRatios,
	DisplayAspectRatios,
	SegmentModifications,
	StoryImageStyles,
	StoryboardViewType,
} from "@/utils/enums";
import {
	ChevronDown,
	ChevronRight,
	LayoutList,
	Plus,
	SparkleIcon,
} from "lucide-react";
import { useImmerReducer } from "use-immer";
import editStoryReducer, {
	EditStoryAction,
	EditStoryDraft,
	Scene,
	Segment,
	StoryStatus,
	TextStatus,
} from "../reducers/edit-reducer";
import { GenerateStoryDiff, WebstoryToStoryDraft } from "../utils/storydraft";
import { mainSchema } from "@/api/schema";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { GetImageRatio } from "@/utils/image-ratio";
import { Button } from "@/components/ui/button";
import SegmentImage from "./SegmentImage";

const MAX_SUMMARY_LENGTH = 251;

export default function VideoEditorStoryboard({
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
	}>();

	const [previousStory, setPreviousStory] = useState<EditStoryDraft>(
		WebstoryToStoryDraft(WebstoryData!)
	);

	// useEffect(() => {
	// 	console.log(
	// 		story.scenes.flatMap((el) => el.segments.map((seg) => seg.videoKey))
	// 	);
	// }, [story]);

	const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);

	const diff = GenerateStoryDiff(previousStory, story);

	const EditSegment = useMutation({
		mutationFn: api.video.editSegment,
	});

	const handleSubmitEditSegments = async () => {
		const diff = GenerateStoryDiff(WebstoryToStoryDraft(WebstoryData!), story);
		console.log(diff);
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

	const handleRegenerateImage = async (
		segment: Segment,
		sceneIndex: number,
		segmentIndex: number,
		saveBeforeRegenerating: boolean = false
	) => {
		dispatch({
			type: "edit_segment",
			sceneIndex,
			segmentIndex: segmentIndex,
			segment: { ...segment, imageStatus: StoryStatus.PENDING },
		});

		let newSegment = null;
		if (saveBeforeRegenerating) {
			const newStory = await handleSubmitEditSegments();
			newSegment = newStory?.scenes?.[sceneIndex]?.videoSegments?.find(
				(el) => el.textContent === segment.textContent
			);
		}
		const regeneratedImages = await api.video.regenerateImage({
			// @ts-ignore
			image_style: segment.settings?.style ?? StoryImageStyles.Realistic,
			prompt: segment.settings?.prompt ?? segment.textContent,
			segment_idx: newSegment?.index ?? segment.id,
			story_id: story.id,
			story_type: WebstoryData?.storyType!,
			cfg_scale: segment.settings?.denoising ?? 7,
			sampling_steps: segment.settings?.samplingSteps ?? 8,
			seed: segment.settings?.seed ?? 3121472823,
		});

		if (regeneratedImages.target_paths.length === 1) {
			dispatch({
				type: "edit_segment",
				sceneIndex,
				segmentIndex: segmentIndex,
				segment: {
					...segment,
					imageStatus: StoryStatus.COMPLETE,
					imageKey: regeneratedImages.image_key,
				},
			});
		}
	};

	return (
		<>
			<div
				className="relative w-4/5 h-4/5 m-auto  overflow-hidden"
				style={{
					borderRadius: "8px",
					background: "#FEFEFF",
					boxShadow:
						"0px 0px 0px 1px rgba(18, 55, 105, 0.08), 0px 1px 2px 0px #E1EAEF, 0px 24px 32px -12px rgba(54, 57, 74, 0.24)",
					backdropFilter: "blur(5px)",
				}}
			>
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
				<div className="relative  px-6 pt-6 pb-2 bg-[#FEFEFF]">
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
														className="flex flex-row justify-between w-full rounded-md hover:bg-slate-50 group items-center"
													>
														<div className="flex items-center space-y-1 flex-wrap">
															{scene.segments.map((segment, segmentIndex) => {
																return (
																	<React.Fragment key={segmentIndex}>
																		{segment.imageStatus ===
																			StoryStatus.COMPLETE && (
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
																			StoryStatus.PENDING && (
																			<div
																				className="relative h-32"
																				style={{
																					aspectRatio: GetImageRatio(
																						story.resolution
																					).ratio,
																				}}
																			>
																				<Skeleton className="w-full h-full" />
																			</div>
																		)}
																		{segment.imageStatus ===
																			StoryStatus.READY && (
																			<div
																				className="relative h-32"
																				style={{
																					aspectRatio: GetImageRatio(
																						story.resolution
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
																			<ChevronRight
																				width={16}
																				height={16}
																				className="text-slate-500 stroke-1"
																			/>
																		)}
																	</React.Fragment>
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
																				"active:outline-none bg-transparent focus:!bg-purple-200 hover:!bg-purple-100 rounded-sm px-1 m-0 focus:outline-none",
																				segment.textStatus ===
																					TextStatus.EDITED && "text-slate-500"
																			)}
																			inputStyle={{
																				outline: "none",
																				backgroundColor: "inherit",
																			}}
																			// @ts-ignore
																			ref={(el) =>
																				// @ts-ignore
																				(refs.current[sceneIndex][
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
															<div className="hidden group-hover:block ">
																<OptionsButton
																	onClick={() =>
																		setEditSegmentsModalState({
																			open: true,
																			dispatch: dispatch,
																			scene: scene,
																			sceneId: sceneIndex,
																			story: story,
																		})
																	}
																/>
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
						handleRegenerateImage={handleRegenerateImage}
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
					/>
				)}
		</>
	);
}

const OptionsButton = (props: {
	onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) => (
	<div>
		<div
			onClick={props.onClick}
			className="bg-gradient-to-b from-white to-slate-50 rounded hover:shadow border border-slate-200 flex-col justify-start  hover:cursor-pointer items-center gap-2.5 inline-flex"
		>
			<div className="self-stretch h-8 pl-[5px] pr-1 opacity-50 rounded-[3px] hover:shadow justify-end items-center inline-flex">
				{/* <div className="px-0.5 flex-col justify-start items-start inline-flex">
					<div className="self-stretch justify-between items-center inline-flex">
						<div className="flex-col justify-start items-center inline-flex">
							<svg
								width={16}
								height={16}
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M8 2L6.73333 5.86667C6.66847 6.06748 6.55688 6.25003 6.40772 6.3993C6.25856 6.54858 6.07609 6.66032 5.87533 6.72533L2 8L5.86667 9.26667C6.06748 9.33153 6.25003 9.44312 6.3993 9.59228C6.54858 9.74144 6.66032 9.92391 6.72533 10.1247L8 14L9.26667 10.1333C9.33153 9.93252 9.44312 9.74997 9.59228 9.6007C9.74144 9.45142 9.92391 9.33968 10.1247 9.27467L14 8L10.1333 6.73333C9.93252 6.66847 9.74997 6.55688 9.6007 6.40772C9.45142 6.25856 9.33968 6.07609 9.27467 5.87533L8 2Z"
									stroke="#657D8B"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
					</div>
				</div> */}
				<div className="px-0.5 flex-col justify-start items-start inline-flex ">
					<div className="self-stretch justify-between items-center inline-flex">
						<div className="flex-col justify-start items-center inline-flex ">
							<svg
								width={16}
								height={16}
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M13.3327 4.66667H7.33268M9.33268 11.3333H3.33268M9.33268 11.3333C9.33268 12.4379 10.2281 13.3333 11.3327 13.3333C12.4373 13.3333 13.3327 12.4379 13.3327 11.3333C13.3327 10.2288 12.4373 9.33334 11.3327 9.33334C10.2281 9.33334 9.33268 10.2288 9.33268 11.3333ZM6.66602 4.66667C6.66602 5.77124 5.77059 6.66667 4.66602 6.66667C3.56145 6.66667 2.66602 5.77124 2.66602 4.66667C2.66602 3.5621 3.56145 2.66667 4.66602 2.66667C5.77059 2.66667 6.66602 3.5621 6.66602 4.66667Z"
									stroke="#657D8B"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
					</div>
				</div>
				{/* <div className="px-0.5 flex-col justify-start items-start inline-flex">
					<div className="self-stretch justify-between items-center inline-flex">
						<div
							className="flex-col justify-start items-center inline-flex"
							onClick={props.onExpandClick}
						>
							<svg
								width={16}
								height={16}
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M3.3668 8C3.3668 8.3866 3.0534 8.7 2.6668 8.7C2.2802 8.7 1.9668 8.3866 1.9668 8C1.9668 7.6134 2.2802 7.3 2.6668 7.3C3.0534 7.3 3.3668 7.6134 3.3668 8ZM8.70013 8C8.70013 8.3866 8.38673 8.7 8.00013 8.7C7.61353 8.7 7.30013 8.3866 7.30013 8C7.30013 7.6134 7.61353 7.3 8.00013 7.3C8.38673 7.3 8.70013 7.6134 8.70013 8ZM14.0335 8C14.0335 8.3866 13.72 8.7 13.3335 8.7C12.9469 8.7 12.6335 8.3866 12.6335 8C12.6335 7.61341 12.9469 7.3 13.3335 7.3C13.72 7.3 14.0335 7.61341 14.0335 8Z"
									fill="#657D8B"
									stroke="#657D8B"
								/>
							</svg>
						</div>
					</div>
				</div> */}
			</div>
		</div>
	</div>
);
