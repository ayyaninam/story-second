import {
	AspectRatios,
	SegmentModifications,
	StoryboardViewType,
} from "@/utils/enums";
import { ChevronDown, LayoutList, SparkleIcon } from "lucide-react";
import { useImmerReducer } from "use-immer";
import editStoryReducer, {
	EditStoryAction,
	EditStoryDraft,
	Scene,
	Segment,
	TextStatus,
} from "../reducers/edit-reducer";
import { GenerateStoryDiff, WebstoryToStoryDraft } from "../utils/storydraft";
import { mainSchema } from "@/api/schema";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api";
import { SegmentModificationData } from "@/types";
import { QueryKeys } from "@/lib/queryKeys";
import { useRouter } from "next/router";
import { VideoPlayerHandler } from "@/features/edit-story/components/video-player";

import Editor from "./Editor";
import { cn } from "@/utils";
import Format from "@/utils/format";
import AutosizeInput from "react-input-autosize";

const MAX_SUMMARY_LENGTH = 251;

export default function ScriptEditor({
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
	const videoPlayerRef = useRef<VideoPlayerHandler | null>(null);
	const queryClient = useQueryClient();
	const [showFullDescription, setShowFullDescription] = useState(false);
	const [isPlaying, setIsPlaying] = useState<boolean | undefined>();
	const [seekedFrame, setSeekedFrame] = useState<number | undefined>();

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

	useEffect(() => {
		dispatch({ type: "reset", draft: WebstoryToStoryDraft(WebstoryData!) });
	}, [WebstoryData]);

	const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);

	const diff = GenerateStoryDiff(previousStory, story);

	const EditSegment = useMutation({
		mutationFn: api.video.editSegment,
	});

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
					segments: [{ Text: segment.textContent, SceneId: segment.sceneId }],
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

	useEffect(() => {
		if (selectedSegment) {
			console.log();
			videoPlayerRef.current?.seekToSegment(selectedSegment);
		}
	}, [selectedSegment]);

	const userName = useMemo(() => {
		return WebstoryData?.user?.name;
	}, [WebstoryData?.user?.name]);

	return (
		<>
			<div
				className="w-[80%] m-auto"
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
						<p>Script View</p>
						{/* <StoryboardViewTypes type={StoryboardViewType.Outline} /> */}
					</div>
					<div className="flex gap-1 items-center">
						<p className="px-1 text-purple-900">
							Pro Tip — You can individually regenerate images in this
							Storyboard.{" "}
							<a href="#">
								<u>Learn how</u>
							</a>
						</p>
						<div className="flex gap-1 items-center text-purple-600 bg-white rounded-sm p-[1px] hover:cursor-pointer hover:bg-slate-100">
							<SparkleIcon width={"18px"} height={"18px"} />
							<p className="text-xs">Regenerate</p>
							<ChevronDown width={"18px"} height={"18px"} />
						</div>
					</div>
				</div>
				<div className="relative px-6 pt-6 pb-2 bg-[#FEFEFF]">
					<p className="text-2xl font-bold max-w-sm -tracking-[-0.6px]">
						{Format.Title(WebstoryData?.storyTitle)}
					</p>

					<div className="w-full inline-flex text-slate-400 text-xs py-1">
						<div className="flex">
							Storyboard for a <u>60 Second</u>{" "}
							<ChevronDown className="mr-2 h-4 w-4 text-xs" /> <u>Movie</u>{" "}
							<ChevronDown className="mr-2 h-4 w-4 text-xs" />
						</div>
						<div className="flex">
							<u>No Audio</u> <ChevronDown className="mr-2 h-4 w-4 text-xs" />
						</div>
						<p className="ms-1">by {userName}</p>
					</div>
				</div>
				<div className="flex flex-col md:flex-row items-center justify-center w-full">
					<div
						className={cn(
							`w-full pb-6 bg-background  rounded-bl-lg rounded-br-lg lg:rounded-br-lg lg:rounded-bl-lg flex flex-col lg:flex-row justify-stretch h-full`
						)}
						// border-[1px]
					>
						<div
							className={`px-6 flex w-full flex-col-reverse justify-between md:flex-col rounded-t-lg lg:rounded-bl-lg lg:rounded-tl-lg lg:rounded-tr-none lg:rounded-br-none`}
						>
							<div
								className="space-y-2 max-h-[40vh] overflow-scroll"
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
											<div className={cn("w-full")}>
												{story.scenes.map((scene, sceneIndex) => (
													<div
														key={sceneIndex}
														className="flex flex-wrap flex-row "
													>
														<div className="bg-slate-50 font-normal text-slate-600 text-sm my-2 px-1">
															{`Scene ${sceneIndex + 1}: `}
															{scene.description}
														</div>
														{scene.segments.map((segment, segmentIndex) => (
															<span
																key={segmentIndex}
																style={{ backgroundColor: "transparent" }}
																className={cn(`flex flex-wrap w-full`)}
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
																		segment.textStatus === TextStatus.EDITED &&
																			"text-slate-500"
																	)}
																	inputStyle={{
																		outline: "none",
																		backgroundColor: "inherit",
																	}}
																	// @ts-ignore
																	ref={(el) =>
																		// @ts-ignore
																		(refs.current[sceneIndex][segmentIndex] =
																			el)
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
		</>
	);
}
