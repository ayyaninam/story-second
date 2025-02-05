import { LayoutList, RefreshCcw, Settings2, Sparkle } from "lucide-react";
import {
	EditStoryAction,
	EditStoryDraft,
	Scene,
	StoryStatus,
} from "../reducers/edit-reducer";
import { mainSchema } from "@/api/schema";
import React, { use, useCallback, useMemo, useRef, useState } from "react";
import Editor from "./Editor";
import { cn } from "@/utils";
import Format from "@/utils/format";
import { VideoPlayerHandler } from "@/features/edit-story/components/video-player";
import { DisplayAspectRatios } from "@/utils/enums";
import api from "@/api";
import SceneEditSegmentModal from "./SceneEditSegmentModal";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import CategorySelect from "@/components/ui/CategorySelect";
import { useUpdateCategory } from "../mutations/UpdateCategory";
import StoryScreen from "@/features/edit-story/story-screen";
import { CallbackListener } from "@remotion/player";
import { filterSelectedKeysFromObject } from "../utils/storydraft";
import useEventLogger from "@/utils/analytics";
import { useMediaQuery } from "usehooks-ts";

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
	const eventLogger = useEventLogger();
	const isMobile = useMediaQuery("(max-width: 1024px)");
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

	const UpdateCategory = useUpdateCategory();

	const onPlay = useCallback(() => {
		setIsPlaying(true);
	}, []);
	const onPause = useCallback(() => {
		setIsPlaying(false);
	}, []);
	const onSeeked: CallbackListener<"seeked"> = useCallback((e) => {
		setSeekedFrame(e.detail.frame);
	}, []);
	const onEnded = useCallback(() => {
		setIsPlaying(false);
		setSeekedFrame(0);
	}, []);

	const filteredWebstoryData = useMemo(() => {
		return filterSelectedKeysFromObject({
			originalObject: WebstoryData!,
			keysToBeFiltered: ["renderedVideoKey"],
		});
	}, [
		filterSelectedKeysFromObject({
			originalObject: WebstoryData!,
			keysToBeFiltered: ["renderedVideoKey"],
		}),
	]);

	const isPortrait = ImageRatio.width < ImageRatio.height;
	return (
		<>
			<div className="relative w-full h-full lg:w-4/5 lg:h-4/5 m-auto max-w-[1300px] overflow-hidden bg-background rounded-md shadow-lg">
				<div className="w-full flex items-center justify-between gap-1 p-1 rounded-tl-lg rounded-tr-lg font-normal text-xs border border-accent-500 bg-accent-100 text-accent-900">
					<div className="flex items-center gap-1">
						<LayoutList className="stroke-accent-600 mr-1 h-4 w-4" />
						<p>Scene Editor</p>
					</div>
					<div className="flex gap-1 items-center">
						<p className="px-1 text-accent-900">
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
					<div className="absolute hidden lg:block h-[85%] w-px bg-slate-200 mt-6 ml-5" />

					<div
						className=" flex justify-center flex-col-reverse lg:flex-row lg:justify-between overflow-y-hidden"
						style={{ background: "transparent" }}
					>
						<div className="h-full w-full lg:w-[50%] flex-grow ml-0 lg:ml-2  flex flex-col justify-between overflow-y-auto">
							<div className="flex flex-col my-3 md:flex-row items-center w-full">
								<div className="w-full ml-0 lg:ml-7 h-full bg-background  rounded-bl-lg rounded-br-lg lg:rounded-br-lg lg:rounded-bl-lg flex flex-col items-center lg:items-start lg:flex-row">
									<div className="flex pb-8 w-[calc(100%-100px)] lg:w-full justify-center  h-full space-y-2 flex-col-reverse lg:justify-between md:flex-col rounded-t-lg lg:rounded-bl-lg lg:rounded-tl-lg lg:rounded-tr-none lg:rounded-br-none">
										<Editor
											Webstory={WebstoryData!}
											dispatch={dispatch}
											story={story}
										>
											{() => {
												return (
													<>
														{story.scenes.map((scene, sceneIndex) => (
															<>
																<div
																	key={sceneIndex}
																	className="relative flex group border border-slate-200/0 border-transparent hover:border-slate-200/100 rounded-sm items-center justify-between"
																>
																	{scene.segments.some(
																		(el) =>
																			el.videoStatus === StoryStatus.PENDING
																	) && (
																		<RefreshCcw
																			className="stroke-2 w-4 h-4 text-purple-500 absolute -left-[1.5rem] -top-[${index + 1 / 4}] animate-spin "
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
																						"flex max-w-sm focus:!bg-accent-200 hover:!bg-accent-100 hover:text-slate-950 rounded-sm px-1 cursor-pointer",
																						segment.videoStatus !==
																							StoryStatus.COMPLETE &&
																							"text-accent-800"
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
																			onClick={() => {
																				eventLogger("edit_video_modal_clicked");
																				setEditSegmentsModalState({
																					open: true,
																					scene: scene,
																					sceneId: sceneIndex,
																					dispatch,
																					story,
																				});
																			}}
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

						<div
							className={cn(
								"relative lg:h-full  lg:w-[50%] overflow-hidden m-auto px-4 flex items-center justify-center ",
								isPortrait ? "h-[429px] w-[295px]" : "h-[205px] w-[395px]"
							)}
						>
							<div
								className={`w-full lg:w-auto h-full lg:h-[95%] lg:absolute max-w-[95%] max-h-[95%]`}
								style={{
									aspectRatio: isMobile ? 1 : ImageRatio.ratio,
								}}
							>
								<StoryScreen
									playerClassName="lg:rounded-lg"
									roundedClassName="lg:rounded-lg"
									ref={videoPlayerRef}
									Webstory={filteredWebstoryData}
									isError={isError}
									onPlay={onPlay}
									onPause={onPause}
									onSeeked={onSeeked}
									onEnded={onEnded}
								/>
							</div>
						</div>
					</div>

					<div className="hidden w-[35%] ml-9 mb-[3rem] mt-auto lg:flex justify-end pt-2" />
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

// [REMOVED] Circular loader as per the designs. Removed for now as we can't determine the progress
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
