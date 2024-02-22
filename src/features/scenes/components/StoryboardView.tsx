import { mainSchema } from "@/api/schema";
import {
	EditStoryAction,
	EditStoryDraft,
	Scene,
	Segment,
	StoryStatus,
} from "../reducers/edit-reducer";
import { Dispatch, MutableRefObject, useState } from "react";
import {
	InputStatus,
	SegmentModifications,
	StoryboardViewType,
} from "@/utils/enums";
import {
	ChevronDown,
	ChevronRight,
	LayoutList,
	MoreHorizontal,
	Settings2,
	Sparkle,
	SparkleIcon,
} from "lucide-react";
import ScriptEditorViewTypes from "./ScriptEditorViewTypesComponent";
import Format from "@/utils/format";
import cn from "@/utils/cn";
import Image from "next/image";
import AutosizeInput from "react-input-autosize";
import StoryboardViewTypes from "./StoryboardViewTypesComponent";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/api";
import { WebstoryToStoryDraft } from "../utils/storydraft";

export default function StoryboardView({
	WebstoryData,
	story,
	dispatch,
	setEditSegmentsModalState,
	getSegmentStatus,
	handleInput,
	handleEnter,
	setPreviousStory,
	refs,
}: {
	WebstoryData?: mainSchema["ReturnVideoStoryDTO"];
	story: EditStoryDraft;
	setPreviousStory: Dispatch<React.SetStateAction<EditStoryDraft>>;
	dispatch: Dispatch<EditStoryAction>;
	setEditSegmentsModalState: Dispatch<
		React.SetStateAction<
			| {
					open?: boolean | undefined;
					scene?: Scene | undefined;
					sceneId?: number | undefined;
					dispatch?: React.Dispatch<EditStoryAction> | undefined;
					story?: EditStoryDraft | undefined;
			  }
			| undefined
		>
	>;
	getSegmentStatus: (sceneIndex: number, segmentIndex: number) => InputStatus;
	handleInput: (
		e: React.ChangeEvent<HTMLInputElement>,
		scene: Scene,
		sceneIndex: number,
		segment: Segment,
		segmentIndex: number
	) => void;
	handleEnter: (
		scene: Scene,
		sceneIndex: number,
		segment: Segment,
		segmentIndex: number
	) => void;
	refs: MutableRefObject<HTMLInputElement[][]>;
}) {
	const [showActionItems, setShowActionItems] = useState<{
		index?: number;
		scene?: number;
	}>();
	return (
		<div className="w-[80%] m-auto">
			<div className="w-full flex items-center justify-between gap-1 p-1 rounded-tl-lg rounded-tr-lg bg-primary-foreground font-normal text-xs border border-purple-500 bg-purple-100 text-purple-900">
				<div className="flex items-center gap-1">
					<LayoutList className="stroke-purple-600 mr-1 h-4 w-4" />
					<p>Storyboard View</p>
					<StoryboardViewTypes type={StoryboardViewType.Outline} />
				</div>
				<div className="flex gap-1 items-center">
					<p className="px-1 text-purple-900">
						Pro Tip — You can individually regenerate images in this Storyboard.{" "}
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
						Storyboard for a <u> 60 Second</u>{" "}
						<ChevronDown className="mr-2 h-4 w-4 text-xs" /> <u>Movie</u>{" "}
						<ChevronDown className="mr-2 h-4 w-4 text-xs" />
					</div>
					<div className="flex">
						<u>No Audio</u> <ChevronDown className="mr-2 h-4 w-4 text-xs" />
					</div>
					<p className="ms-1">by Anthony Deloso</p>
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
							className="space-y-2"
							onMouseLeave={(e) => {
								setShowActionItems({});
							}}
						>
							{story.scenes.map((scene, sceneIndex) => (
								<div key={sceneIndex} className="flex">
									<span className="flex w-[50%] flex-wrap text-sm gap-1 items-center hover:bg-slate-100 rounded-md">
										{scene.segments.map((segment, segmentIndex) => (
											<>
												{!segment.imageKey &&
													segment.imageStatus !== StoryStatus.PENDING && (
														<div
															className="w-[66px] h-[42px] bg-slate-400 text-purple-500"
															onClick={async () => {
																dispatch({
																	type: "edit_segment",
																	sceneIndex: sceneIndex,
																	segmentIndex,
																	segment: {
																		...segment,
																		imageStatus: StoryStatus.PENDING,
																	},
																});

																await api.video.editSegment({
																	edits: [
																		{
																			details: {
																				Ind: segment.id,
																				segments: [
																					{
																						SceneId: scene.id,
																						Text: segment.textContent,
																					},
																				],
																			},
																			operation: SegmentModifications.Add,
																		},
																	],
																	story_id: story.id,
																	story_type: WebstoryData?.storyType,
																});
																const newStory = await api.video.get(
																	WebstoryData?.topLevelCategory!,
																	WebstoryData?.slug!,
																	WebstoryData?.storyType!
																);

																setPreviousStory(
																	WebstoryToStoryDraft(newStory)
																);
															}}
														>
															<div className="flex items-center gap-1">
																<p className="text-xs">Gen Img</p>
																<SparkleIcon width={16} height={16} />
															</div>
														</div>
													)}
												{!segment.imageKey &&
													segment.imageStatus === StoryStatus.PENDING && (
														<Skeleton className="w-[66px] h-[42px]"></Skeleton>
													)}
												{segment.imageKey && (
													<Image
														key={segmentIndex}
														alt="hello"
														src={Format.GetImageUrl(segment.imageKey)}
														width={66}
														height={42}
													/>
												)}

												{segmentIndex !== scene.segments.length - 1 && (
													<ChevronRight width={12} height={12} />
												)}
											</>
										))}
									</span>
									<span className="flex w-[50%] flex-wrap text-sm hover:bg-slate-100 rounded-md">
										{scene.segments.map((segment, segmentIndex) => (
											<span
												key={`${segmentIndex}`}
												style={{ backgroundColor: "transparent" }}
												className={cn(
													`flex flex-wrap justify-between items-center`
												)}
												// onClick={() => {
												// 	setSelectedSegment(
												// 		WebstoryData?.scenes[sceneIndex]?.videoSegments[
												// 			segmentIndex
												// 		]!
												// 	);
												// }}
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
															InputStatus.ADDED && "text-green-500",
														segment.imageStatus === StoryStatus.PENDING &&
															"text-purple-800"
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
											</span>
										))}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* <div
							className={`px-6 flex w-[50%] flex-col-reverse justify-between md:flex-col rounded-t-lg lg:rounded-bl-lg lg:rounded-tl-lg lg:rounded-tr-none lg:rounded-br-none`}
						>
							<div
								className="space-y-2"
								onMouseLeave={() => setShowActionItems({})}
							>
								{story.scenes.map((scene, sceneIndex) => (
									<div key={sceneIndex} className="flex">
										<span className="flex flex-wrap text-sm hover:bg-slate-100 rounded-md">
											{scene.segments.map((segment, segmentIndex) => (
												<span
													key={`${segmentIndex}`}
													style={{ backgroundColor: "transparent" }}
													className={cn(
														`flex flex-wrap w-full justify-between`
													)}
													// onClick={() => {
													// 	setSelectedSegment(
													// 		WebstoryData?.scenes[sceneIndex]?.videoSegments[
													// 			segmentIndex
													// 		]!
													// 	);
													// }}
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
																InputStatus.ADDED && "text-green-500",
															segment.imageStatus === StoryStatus.PENDING &&
																"text-purple-800"
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
												</span>
											))}
										</span>
									</div>
								))}
							</div>
						</div> */}
					{/* <div className="relative w-full rounded-tl-lg rounded-bl-lg m-3"> */}
					{/* NOTE: Incase the above code doesn't work, try replacing it with the following:
					 */}
					{/* <div className="absolute top-0 left-0 w-full lg:max-w-[100%] rounded-tl-lg rounded-bl-lg">
							<Image src={Img} width={500} height={281} />
						</div>
					</div> */}
				</div>
			</div>
		</div>
	);
}
