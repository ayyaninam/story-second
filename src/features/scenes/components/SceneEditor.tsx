import { LayoutList, RefreshCcw, Settings2, Sparkle } from "lucide-react";
import {
	EditStoryAction,
	EditStoryDraft,
	Scene,
	Segment,
	StoryStatus,
} from "../reducers/edit-reducer";
import { mainSchema } from "@/api/schema";
import React, { useRef, useState } from "react";
import Editor from "./Editor";
import { cn } from "@/utils";
import Format from "@/utils/format";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import VideoPlayer, {
	VideoPlayerHandler,
} from "@/features/edit-story/components/video-player";
import { DisplayAspectRatios } from "@/utils/enums";
import api from "@/api";
import SceneEditSegmentModal from "./SceneEditSegmentModal";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import CategorySelect from "@/components/ui/CategorySelect";
import { useUpdateCategory } from "../mutations/UpdateCategory";
import StoryScreen from "@/features/edit-story/story-screen";

// Circular loader as per the designs. Removed for now as we can't determine the progress
const Loader = ({
	percentage,
	index,
}: {
	percentage: number;
	index: number;
}) => {
	const withOffset = `${60 + percentage}deg`;
	return (
		<span className={`absolute -left-[1.5rem] -top-[${index + 1 / 4}]`}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="19"
				height="19"
				viewBox="0 0 19 19"
				fill="none"
				style={{ transform: `rotate(${withOffset})` }}
			>
				<rect
					x="0.5"
					y="0.5"
					width="18"
					height="18"
					rx="9"
					fill="white"
					stroke="#CE7AFF"
				/>
				<path
					d="M3.87083 6.25C3.1554 7.48917 2.86884 8.92979 3.05561 10.3484C3.24237 11.7671 3.89203 13.0844 4.90381 14.0962C5.91559 15.108 7.23295 15.7576 8.65158 15.9444C10.0702 16.1312 11.5108 15.8446 12.75 15.1292C13.9892 14.4137 14.9576 13.3094 15.5052 11.9874C16.0528 10.6655 16.1489 9.19979 15.7785 7.81768C15.4082 6.43556 14.5921 5.21426 13.4569 4.3432C12.3218 3.47214 10.9309 3 9.5 3L9.5 9.5L3.87083 6.25Z"
					fill="#BB55F7"
				/>
			</svg>
		</span>
	);
};

type HoveredThumbs = {
	thumbs: string[];
	index: number;
};
const ExpandedThumbnails = ({ data }: { data?: HoveredThumbs }) => {
	if (data === undefined) return;

	return (
		<div className="hover:hidden absolute -left-0 flex gap-x-1">
			{data.thumbs.slice(0, 4).map((thumb, index) => (
				<div
					key={index}
					className="w-10 h-6 rounded-[1px]"
					style={{
						border: "0.2px solid rgba(0, 0, 0, 0.40)",
						background: `url(${thumb})`,
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat",
					}}
				/>
			))}
		</div>
	);
};

const SceneEditorView = ({
	WebstoryData,
	ImageRatio,
	story,
	dispatch,
	isError,
}: {
	WebstoryData?: mainSchema["ReturnVideoStoryDTO"];
	ImageRatio: {
		width: number;
		height: number;
		ratio: number;
		enumValue: DisplayAspectRatios;
	};
	story: EditStoryDraft;
	dispatch: React.Dispatch<EditStoryAction>;
	isError?: boolean;
}) => {
	const videoPlayerRef = useRef<VideoPlayerHandler | null>(null);
	const blurredVideoPlayerRef = useRef<VideoPlayerHandler | null>(null);

	const [isPlaying, setIsPlaying] = useState<boolean | undefined>();
	const [seekedFrame, setSeekedFrame] = useState<number | undefined>();

	const [hoveredThumbnails, setHoveredThumbnails] = useState<HoveredThumbs>();
	const [editSegmentsModalState, setEditSegmentsModalState] = useState<{
		open?: boolean;
		scene?: Scene;
		sceneId?: number;
		dispatch?: React.Dispatch<EditStoryAction>;
		story?: EditStoryDraft;
	}>();

	const statuses = story.scenes.flatMap((el) =>
		el.segments.map((el) => el.videoStatus)
	);

	const RegenerateAllVideos = useMutation({
		mutationFn: api.video.regenerateAllVideos,
	});
	const UpdateCategory = useUpdateCategory();
	const handleRegenerateAllVideos = async () => {
		await RegenerateAllVideos.mutateAsync({
			story_id: story.id,
			story_type: story.type,
		});
	};

	const handleRegenerateVideo = async (
		segment: Segment,
		sceneIndex: number,
		segmentIndex: number
	) => {
		dispatch({
			type: "edit_segment",
			sceneIndex,
			segmentIndex: segmentIndex,
			segment: { ...segment, videoStatus: StoryStatus.PENDING },
		});
		await api.video.regenerateVideo({
			story_id: WebstoryData?.id!,
			segment_idx: segment.id,
			story_type: WebstoryData?.storyType,
		});
	};

	return (
		<>
			<div className="relative w-4/5 h-4/5 m-auto overflow-hidden bg-background rounded-md shadow-lg">
				<div className="w-full flex items-center justify-between gap-1 p-1 rounded-tl-lg rounded-tr-lg bg-primary-foreground font-normal text-xs border border-purple-500 bg-purple-100 text-purple-900">
					<div className="flex items-center gap-1">
						<LayoutList className="stroke-purple-600 mr-1 h-4 w-4" />
						<p>Scene Editor</p>
					</div>
					<div className="flex gap-1 items-center">
						<p className="px-1 text-purple-900">
							Pro Tip — You can individually regenerate video subsegments.
						</p>
					</div>
				</div>

				<div className="w-full h-full flex flex-col">
					<div className=" mb-4 w-full mt-6 mx-9">
						<p className="text-2xl font-bold -tracking-[-0.6px]">
							{Format.Title(WebstoryData?.storyTitle)}
						</p>

						<div className="flex gap-1 text-slate-400 text-xs py-1">
							<CategorySelect
								value={WebstoryData?.topLevelCategory!}
								onChange={(category) => UpdateCategory.mutate({ category })}
							/>
							<p>by {WebstoryData?.user?.name}</p>
						</div>
						<Separator className="w-[35%]" />
					</div>
					<div className="absolute h-[85%] w-px bg-slate-200 mt-6 ml-5" />

					<div
						className="h-screen flex justify-between overflow-y-hidden w-full"
						style={{ background: "transparent" }}
					>
						<div className="h-full flex-grow ml-2  flex flex-col justify-between overflow-y-auto">
							<div className="flex flex-col my-3 md:flex-row items-center w-full">
								<div className="w-full ml-7 h-full bg-background  rounded-bl-lg rounded-br-lg lg:rounded-br-lg lg:rounded-bl-lg flex flex-col lg:flex-row">
									<div className="flex w-full h-full space-y-2 flex-col-reverse justify-between md:flex-col rounded-t-lg lg:rounded-bl-lg lg:rounded-tl-lg lg:rounded-tr-none lg:rounded-br-none">
										<Editor
											Webstory={WebstoryData!}
											dispatch={dispatch}
											story={story}
										>
											{({ handleEnter, handleInput, refs }) => {
												return (
													<>
														{story.scenes.map((scene, sceneIndex) => (
															<>
																<div
																	key={sceneIndex}
																	className="relative flex group border border-slate-200/0 border-transparent hover:border-slate-200/100 rounded-sm items-center justify-between"
																>
																	{scene.status === StoryStatus.PENDING && (
																		<RefreshCcw
																			className="stroke-2 w-4 h-4 text-purple-500 absolute -left-[1.5rem] -top-[${index + 1 / 4}] animate-spin animate-s"
																			style={{
																				animationDirection: "reverse",
																			}}
																		/>
																	)}

																	<span className="flex flex-wrap text-sm">
																		{scene.segments.map(
																			(segment, segmentIndex) => (
																				<span
																					key={segmentIndex}
																					style={{
																						backgroundColor: "transparent",
																					}}
																					className={cn(
																						"flex max-w-sm focus:!bg-purple-200 hover:!bg-purple-100 hover:text-slate-950 rounded-sm px-1 cursor-pointer",
																						segment.videoStatus !==
																							StoryStatus.COMPLETE &&
																							"text-purple-800"
																					)}
																					onClick={() => {
																						videoPlayerRef.current?.seekToSegment(
																							{
																								...segment,
																								sceneId: scene.id,
																								index: segment.id,
																							}
																						);
																					}}
																				>
																					{segment.textContent}
																				</span>
																			)
																		)}
																	</span>
																	<div className="visible flex gap-x-1 p-2">
																		<span
																			className="hover:bg-gray-100 cursor-pointer rounded-sm p-1"
																			onClick={() =>
																				setEditSegmentsModalState({
																					open: true,
																					scene: scene,
																					sceneId: sceneIndex,
																					dispatch,
																					story,
																				})
																			}
																		>
																			<Settings2 className="w-4 h-4 stroke-slate-500" />
																		</span>
																	</div>
																</div>
															</>
														))}
													</>
												);
											}}
										</Editor>
									</div>
								</div>
							</div>
						</div>

						<div className="relative h-full w-full px-4 flex items-center justify-center ">
							{/* <div
								className="h-[95%] blur-sm overflow-visible"
								style={{ aspectRatio: ImageRatio.ratio }}
							>
								<VideoPlayer
									playerClassName="rounded-lg"
									ref={blurredVideoPlayerRef}
									Webstory={WebstoryData}
									isError={isError}
									isPlaying={isPlaying}
									seekedFrame={seekedFrame}
								/>
							</div> */}
							<div
								className="absolute h-[95%]"
								style={{ aspectRatio: ImageRatio.ratio }}
							>
								<StoryScreen
									Webstory={WebstoryData}
									isError={isError}
									ref={videoPlayerRef}
									onPlay={() => {
										setIsPlaying(true);
									}}
									onPause={() => {
										setIsPlaying(false);
									}}
									onSeeked={(e) => {
										setSeekedFrame(e.detail.frame);
									}}
									onEnded={() => {
										setIsPlaying(false);
										setSeekedFrame(0);
									}}
								/>
							</div>
						</div>
					</div>

					<div className="w-[35%] ml-9 mb-[3rem] mt-auto flex justify-end pt-2" />
					{/* <span className="font-medium text-slate-400 mx-1.5 mt-1.5 mb-2.5 text-sm">
							Use 25 credits to regenerate ·{" "}
							<Link className="text-purple-600" href="#">
								See plans
							</Link>
						</span>
						<div className="flex gap-2">
							<Button className="w-full text-xs flex gap-2 text-white bg-[#8F22CE] px-3 py-2">
								<Sparkle fill="white" className="w-4 h-4" />
								Regenerate 2 Edited Scenes
							</Button>
							<Button variant="outline" className="w-full text-xs px-3 py-2">
								Or, Save Without Regenerating
							</Button>
						</div> */}
				</div>
			</div>

			<ExpandedThumbnails data={hoveredThumbnails} />

			{editSegmentsModalState?.scene !== undefined &&
				editSegmentsModalState?.sceneId !== undefined && (
					<SceneEditSegmentModal
						open={
							editSegmentsModalState?.open &&
							editSegmentsModalState.scene !== undefined &&
							editSegmentsModalState.sceneId !== undefined
						}
						story={story}
						scene={editSegmentsModalState.scene}
						sceneId={editSegmentsModalState.sceneId}
						onClose={() => setEditSegmentsModalState({})}
						dispatch={dispatch}
					/>
				)}
		</>
	);
};

export default SceneEditorView;
