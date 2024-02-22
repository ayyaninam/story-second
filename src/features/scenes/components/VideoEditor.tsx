import { AspectRatios, SegmentModifications } from "@/utils/enums";
import { cn } from "@/utils";
import StoryScreen from "@/features/edit-story/story-screen";
import {
	ChevronDown,
	Film,
	HelpCircle,
	PlayCircle,
	Plus,
	Sparkle,
	Upload,
	Video,
	Settings2,
	MoreHorizontal,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Format from "@/utils/format";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/features/edit-story/components/mode-toggle";
import StoryScreenBgBlur from "@/components/ui/story-screen-bg-blur";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Img from "../../../../public/images/temp/video-player.png";
import * as Dialog from "@radix-ui/react-dialog";

import { useImmerReducer } from "use-immer";
import editStoryReducer, {
	EditStoryAction,
	EditStoryDraft,
	Scene,
	Segment,
	StoryStatus,
} from "../reducers/edit-reducer";
import { StoryImageStyles } from "@/utils/enums";
import { GenerateStoryDiff, WebstoryToStoryDraft } from "../utils/storydraft";
import { mainSchema, mlSchema } from "@/api/schema";
import React, { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import AutosizeInput from "react-input-autosize";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api";
import EditSegmentModalItem from "./EditSegmentModalItem";
import EditSegmentModal from "./EditSegmentModal";
import { SegmentModificationData } from "@/types";
import { QueryKeys } from "@/lib/queryKeys";
import { useRouter } from "next/router";

enum InputStatus {
	UNEDITED,
	EDITED,
	ADDED,
	DELETED,
}

const MAX_SUMMARY_LENGTH = 251;

export default function VideoEditor({
	WebstoryData,
	ImageRatio,
	isError,
	isLoading,
}: {
	ImageRatio: {
		width: number;
		height: number;
		ratio: number;
		enumValue: AspectRatios;
	};
	WebstoryData?: mainSchema["ReturnVideoStoryDTO"];
	isError?: boolean;
	isLoading?: boolean;
}) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [showFullDescription, setShowFullDescription] = useState(false);
	const [isPlaying, setIsPlaying] = useState<boolean | undefined>();
	const [seekedFrame, setSeekedFrame] = useState<number | undefined>();
	const [showActionItems, setShowActionItems] = useState<{
		index?: number;
		scene?: number;
	}>();
	const [editSegmentsModalState, setEditSegmentsModalState] = useState<{
		open?: boolean;
		scene?: Scene;
		sceneId?: number;
		dispatch?: React.Dispatch<EditStoryAction>;
		story?: EditStoryDraft;
	}>();

	const [previousStory, setPreviousStory] = useState<EditStoryDraft>(
		WebstoryToStoryDraft(WebstoryData!)
	);
	const [story, dispatch] = useImmerReducer<EditStoryDraft, EditStoryAction>(
		editStoryReducer,
		WebstoryToStoryDraft(WebstoryData!)
	);

	const diff = GenerateStoryDiff(previousStory, story);
	const numEdits =
		diff.additions.length + diff.subtractions.length + diff.edits.length;
	const EditScene = useMutation({
		mutationFn: api.video.editScene,
	});
	const EditSegment = useMutation({
		mutationFn: api.video.editSegment,
	});
	const getSegmentStatus = (sceneIndex: number, segmentIndex: number) => {
		if (
			diff.edits.find(
				(el) => el.sceneIndex === sceneIndex && el.segmentIndex === segmentIndex
			)
		) {
			return InputStatus.EDITED;
		} else if (
			diff.additions.find(
				(el) => el.sceneIndex === sceneIndex && el.segmentIndex === segmentIndex
			)
		) {
			return InputStatus.ADDED;
		} else if (
			diff.subtractions.find(
				(el) => el.sceneIndex === sceneIndex && el.segmentIndex === segmentIndex
			)
		) {
			// Deletions not yet implemented
			return InputStatus.DELETED;
		} else return InputStatus.UNEDITED;
	};

	const handleSubmitEditSegments = async () => {
		const diff = GenerateStoryDiff(previousStory, story);
		const edits: SegmentModificationData[] = diff.edits.map((segment) => ({
			details: { Ind: segment.id, Text: segment.textContent },
			operation: SegmentModifications.Edit,
		}));
		const additions: SegmentModificationData[] = diff.additions.map(
			(segment) => ({
				details: {
					Ind: segment.id,
					segments: [{ text: segment.textContent, sceneId: segment.sceneId }],
				},
				operation: SegmentModifications.Add,
			})
		);
		const deletions: SegmentModificationData[] = diff.subtractions.map(
			(segment) => ({
				details: {
					Ind: segment.id,
				},
				operation: SegmentModifications.Delete,
			})
		);

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
	};

	const refs = useRef<HTMLInputElement[][]>(
		// Putting an absurdly high number of arrays to make things simpler
		Array.from({ length: 40 ?? 0 }, () => [])
	);

	const handleInput = (
		e: React.ChangeEvent<HTMLInputElement>,
		scene: Scene,
		sceneIndex: number,
		segment: Segment,
		segmentIndex: number
	) => {
		const content = e.target.value ?? "";
		if (
			// (No break) space or punctuation
			([" ", "\u00A0"].includes(content.slice(-1)) && content.length > 40) ||
			content.length > 50
		) {
			dispatch({
				type: "edit_segment",
				sceneIndex: sceneIndex,
				segmentIndex: segmentIndex,
				segment: {
					...segment,
					textContent: e.target.value.slice(0, -1),
				},
			});
			dispatch({
				type: "create_segment",
				sceneIndex: sceneIndex,
				segment: {
					audioKey: "",
					textContent: content.slice(-1),
					audioStatus: StoryStatus.READY,
					id: segment.id,
					imageKey: "",
					imageStatus: StoryStatus.READY,
					videoKey: "",
					videoStatus: StoryStatus.READY,
				},
				segmentIndex: segmentIndex,
			});
			refs.current[sceneIndex]?.[segmentIndex]?.blur();
			refs.current[sceneIndex]?.[segmentIndex + 1]?.focus();
		} else if (
			segment.textContent.length > 0 &&
			e.target.value.length === 0 &&
			scene.segments.length === 1
		) {
			dispatch({
				type: "delete_scene",
				index: sceneIndex,
			});
			refs.current[sceneIndex]?.[segmentIndex]?.blur();
			refs.current[sceneIndex - 1]?.[
				story?.scenes[sceneIndex - 1]?.segments?.length ?? 0 - 1
			]?.focus();
		} else if (segment.textContent.length > 0 && e.target.value.length === 0) {
			dispatch({
				type: "delete_segment",
				sceneIndex: sceneIndex,
				segmentIndex: segmentIndex,
			});
			refs.current[sceneIndex]?.[segmentIndex]?.blur();
			refs.current[sceneIndex]?.[segmentIndex - 1]?.focus();
		} else {
			dispatch({
				type: "edit_segment",
				sceneIndex: sceneIndex,
				segmentIndex: segmentIndex,
				segment: {
					...segment,
					textContent: e.target.value ?? "",
				},
			});
		}
	};

	const handleEnter = (
		scene: Scene,
		sceneIndex: number,
		segment: Segment,
		segmentIndex: number
	) => {
		// If the segment is the last segment in the scene, create a new scene
		if (segmentIndex === scene.segments.length - 1) {
			dispatch({
				type: "create_scene",
				scene: {
					segments: [
						{
							audioKey: "",
							textContent: " ",
							audioStatus: StoryStatus.READY,
							id: scene.segments.slice(-1)[0]?.id!,
							imageKey: "",
							imageStatus: StoryStatus.READY,
							videoKey: "",
							videoStatus: StoryStatus.READY,
						},
					],
					status: StoryStatus.READY,
					id: scene.id,
				},

				index: sceneIndex,
			});
			refs.current[sceneIndex]?.[segmentIndex]?.blur();
			refs.current[sceneIndex + 1]?.[0]?.focus();
		}
		// Else, create a new segment
		else {
			dispatch({
				type: "create_segment",
				sceneIndex: sceneIndex,
				segment: {
					audioKey: "",
					textContent: " ",
					audioStatus: StoryStatus.READY,
					id: segment.id,
					imageKey: "",
					imageStatus: StoryStatus.READY,
					videoKey: "",
					videoStatus: StoryStatus.READY,
				},
				segmentIndex: segmentIndex,
			});
			refs.current[sceneIndex]?.[segmentIndex]?.blur();
			refs.current[sceneIndex]?.[segmentIndex + 1]?.focus();
		}
	};

	return (
		<div className="relative rounded-lg border-[1px] w-full justify-center border-border bg-border bg-blend-luminosity px-2 lg:px-5 py-2">
			{editSegmentsModalState?.scene !== undefined &&
				editSegmentsModalState?.sceneId !== undefined && (
					<EditSegmentModal
						open={
							editSegmentsModalState?.open &&
							editSegmentsModalState.scene !== undefined &&
							editSegmentsModalState.sceneId !== undefined
						}
						onClose={() => setEditSegmentsModalState({})}
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
			<div className="flex justify-center m-10 ">
				<Badge
					variant="outline"
					className={`bg-primary-foreground font-normal text-sm`}
				>
					<Film className="stroke-purple-600 mr-1 h-4 w-4" />
					Generate & Edit Your Scenes
				</Badge>
			</div>

			<div className="flex flex-col md:flex-row items-center justify-center w-full">
				<div
					className={cn(
						`w-[90%] bg-background border-[1px] rounded-bl-lg rounded-br-lg lg:rounded-br-lg lg:rounded-tr-lg lg:rounded-tl-lg lg:rounded-bl-lg flex flex-col lg:flex-row justify-stretch h-full`
					)}
				>
					<div
						className={`p-6 flex w-[50%] flex-col-reverse justify-between md:flex-col bg-description rounded-t-lg lg:rounded-bl-lg lg:rounded-tl-lg lg:rounded-tr-none lg:rounded-br-none`}
					>
						<div className="relative space-y-2">
							<p className="text-2xl font-bold max-w-sm -tracking-[-0.6px]">
								{Format.Title(WebstoryData?.storyTitle)}
							</p>

							<div className="w-full inline-flex border-b-border border-b-2 text-slate-400 text-xs py-1">
								<div className="flex">
									60 Second Movie{" "}
									<ChevronDown className="mr-2 h-4 w-4 text-xs" />
								</div>
								<div className="flex">
									No Audio <ChevronDown className="mr-2 h-4 w-4 text-xs" />
								</div>
								<p className="ms-1">by Anthony Deloso</p>
							</div>
						</div>
						<div
							className="space-y-2"
							onMouseLeave={() => setShowActionItems({})}
						>
							{story.scenes.map((scene, sceneIndex) => (
								<div key={sceneIndex} className="">
									<span className="flex flex-wrap text-sm hover:bg-slate-100 rounded-md">
										{scene.segments.map((segment, segmentIndex) => (
											<div
												key={`${segmentIndex}`}
												style={{ backgroundColor: "transparent" }}
												className={cn(`flex flex-wrap w-full justify-between`)}
												onMouseEnter={() => {
													setShowActionItems({
														index: segmentIndex,
														scene: sceneIndex,
													});
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
														"active:outline-none bg-transparent focus:!bg-purple-200 hover:!bg-purple-100 rounded-sm px-1 focus:outline-none",
														getSegmentStatus(sceneIndex, segmentIndex) ===
															InputStatus.EDITED && "text-slate-500",
														getSegmentStatus(sceneIndex, segmentIndex) ===
															InputStatus.ADDED && "text-green-500"
													)}
													inputStyle={{
														outline: "none",
														backgroundColor: "inherit",
													}}
													// @ts-ignore
													ref={(el) =>
														// @ts-ignore
														(refs.current[sceneIndex][segmentIndex] = el)
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
												{showActionItems?.index === segmentIndex &&
													showActionItems.scene === sceneIndex && (
														<div className="flex items-center gap-1 text-slate-950 text-xs">
															{" "}
															<Sparkle
																width={16}
																height={16}
																color="#A734EA"
																className="hover:cursor-pointer"
															/>{" "}
															<Settings2
																width={16}
																height={16}
																className="hover:cursor-pointer"
																onClick={() =>
																	setEditSegmentsModalState({
																		open: true,
																		scene: scene,
																		sceneId: sceneIndex,
																		dispatch,
																		story,
																	})
																}
															/>{" "}
															<MoreHorizontal
																width={16}
																height={16}
																className="hover:cursor-pointer"
															/>{" "}
														</div>
													)}
											</div>
										))}
									</span>
								</div>
							))}
						</div>

						<div className="gap-x-2.5">
							<div className="w-full inline-flex border-t-border border-t-2 text-slate-400 text-xs py-1">
								Use 25 Credits to regenerate.
								<p className="ms-1 text-purple-600">See Plans</p>
							</div>
							<div className="hidden md:block text-muted-foreground space-x-2 items-center">
								<Button
									className="p-2 bg-purple-600"
									variant="default"
									onClick={handleSubmitEditSegments}
								>
									<Sparkle className="mr-2 h-4 w-4 text-xs" />{" "}
									{EditSegment.isPending ? "Loading" : `Make ${numEdits} Edits`}
								</Button>
								<Button className="p-2 text-xs align-top" variant="outline">
									Or, Save Draft
								</Button>
							</div>
						</div>
					</div>

					{/* <div className="relative w-full rounded-tl-lg rounded-bl-lg m-3"> */}
					{/* NOTE: Incase the above code doesn't work, try replacing it with the following:
								 <div
									className={`relative w-full lg:max-w-[100%] rounded-tl-lg rounded-bl-lg blur-3xl`}
								>
									<StoryScreen
										Webstory={Webstory.data}
										isError={Webstory.isError}
										isPlaying={isPlaying}
										seekedFrame={seekedFrame}
										isMuted={true}
									/>
								</div> */}
					{/* <div className="absolute top-0 left-0 w-full lg:max-w-[100%] rounded-tl-lg rounded-bl-lg">
							<Image src={Img} width={500} height={281} />
						</div>
					</div> */}
				</div>
			</div>

			<div className="flex justify-center m-10">
				<Badge
					variant="outline"
					className={`bg-primary-foreground font-normal text-sm`}
				>
					<Video className="stroke-purple-600 mr-1 h-4 w-4" />
					View The Final Cut
				</Badge>
			</div>
			<div className="absolute bottom-4 right-4 flex flex-col gap-y-3">
				<span
					className="rounded-full w-8 h-8 bg-popover p-1.5 flex items-center justify-center"
					style={{ boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.13)" }}
				>
					<ModeToggle />
				</span>

				<span
					className="rounded-full w-8 h-8 bg-popover p-1.5"
					style={{ boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.13)" }}
				>
					<HelpCircle className="h-[18.286px] w-[18.286px] flex-shrink-0 stroke-slate-400" />
				</span>
			</div>
			<div className="absolute w-[1px] h-full bg-purple-600 bottom-[1px] left-1/2 transform -translate-x-1/2 flex flex-row z-[-1]" />
		</div>
	);
}
