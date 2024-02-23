import { ChevronDown, MoreHorizontal, Settings2, Sparkle } from "lucide-react";
import { useImmerReducer } from "use-immer";
import editStoryReducer, {
	EditStoryAction,
	EditStoryDraft,
	TextStatus,
} from "../reducers/edit-reducer";
import { WebstoryToStoryDraft } from "../utils/storydraft";
import { mainSchema } from "@/api/schema";
import React, { useRef } from "react";
import Editor from "./Editor";
import { cn } from "@/utils";
import Format from "@/utils/format";
import AutosizeInput from "react-input-autosize";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import VideoPlayer, {
	VideoPlayerHandler,
} from "@/features/edit-story/components/video-player";
import { AspectRatios } from "@/utils/enums";

const Dropdown = ({
	items,
}: {
	items: Array<{ label: string; value: string }>;
}) => {
	return (
		<Select>
			<SelectTrigger className="border-0 w-fit p-0 h-fit focus:ring-0">
				<span className="underline">
					<SelectValue placeholder="Select" />
				</span>
			</SelectTrigger>
			<SelectContent>
				{items.map((item, index) => (
					<SelectItem key={index} value={item.value}>
						{item.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

const Loader = ({ percentage }: { percentage: number }) => {
	const withOffset = `${60 + percentage}deg`;
	return (
		<span className="absolute -left-2.5 top-1/4">
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

const SceneEditorView = ({
	WebstoryData,
	ImageRatio,
}: {
	WebstoryData?: mainSchema["ReturnVideoStoryDTO"];
	ImageRatio: {
		width: number;
		height: number;
		ratio: number;
		enumValue: AspectRatios;
	};
}) => {
	const videoPlayerRef = useRef<VideoPlayerHandler | null>(null);
	const [story, dispatch] = useImmerReducer<EditStoryDraft, EditStoryAction>(
		editStoryReducer,
		WebstoryToStoryDraft(WebstoryData!)
	);

	return (
		<div
			className="w-4/5 h-4/5 m-auto"
			style={{
				borderRadius: "8px",
				background: "#FEFEFF",
				boxShadow:
					"0px 0px 0px 1px rgba(18, 55, 105, 0.08), 0px 1px 2px 0px #E1EAEF, 0px 24px 32px -12px rgba(54, 57, 74, 0.24)",
				backdropFilter: "blur(5px)",
			}}
		>
			<div className="w-full flex justify-between py-1.5 px-3.5 rounded-tl-lg rounded-tr-lg bg-primary-foreground font-normal text-xs border border-purple-200 bg-purple-100 text-purple-600">
				<div className="flex items-center gap-1">
					<p className="font-medium text-sm">Scene Editor • Playing Scene 3</p>
					<ChevronDown className="w-4 h-4 opacity-50" />
				</div>
				<p className="font-medium text-sm">
					Pro Tip — You can individually regenerate images in this Storyboard.{" "}
					<a className="underline" href="#">
						Learn how
					</a>
				</p>
			</div>
			<div className="relative border-l border-slate-200 pl-4 flex flex-row m-6 gap-x-24 items-start">
				<Loader percentage={20} />
				<div className="relative items-start flex flex-col max-w-sm">
					<div className="border-b pb-4 bg-[#FEFEFF]">
						<p className="text-2xl font-bold max-w-sm -tracking-[-0.6px]">
							{Format.Title(WebstoryData?.storyTitle)}
						</p>

						<div className="w-full flex gap-1 text-slate-600 text-sm py-1">
							<Dropdown
								items={[
									{ label: "60 Second", value: "60" },
									{ label: "90 Second", value: "90" },
								]}
							/>
							<Dropdown
								items={[
									{ label: "Adventure", value: "adventure" },
									{ label: "Suspense", value: "suspense" },
									{ label: "Thriller", value: "thriller" },
								]}
							/>
							<Dropdown
								items={[
									{ label: "Video", value: "video" },
									{ label: "Audio", value: "audio" },
									{ label: "None", value: "none" },
								]}
							/>
							<p>by Anthony Deloso</p>
						</div>
					</div>
					<div className="flex h-full flex-col justify-between">
						<div className="flex flex-col my-3 md:flex-row items-center w-full">
							<div
								className="w-full bg-background  rounded-bl-lg rounded-br-lg lg:rounded-br-lg lg:rounded-bl-lg flex flex-col lg:flex-row justify-stretch h-full"
								// border-[1px]
							>
								<div className="flex w-full space-y-2 flex-col-reverse justify-between md:flex-col rounded-t-lg lg:rounded-bl-lg lg:rounded-tl-lg lg:rounded-tr-none lg:rounded-br-none">
									<Editor
										Webstory={WebstoryData!}
										dispatch={dispatch}
										story={story}
									>
										{({ handleEnter, handleInput, refs }) => {
											return (
												<>
													{story.scenes.map((scene, sceneIndex) => (
														<div
															key={sceneIndex}
															className="flex group hover:border rounded-sm justify-between"
														>
															<div className="flex flex-wrap">
																{scene.segments.map((segment, segmentIndex) => (
																	<span
																		key={segmentIndex}
																		style={{ backgroundColor: "transparent" }}
																		className="flex max-w-sm"
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
															<div className="hidden group-hover:flex gap-x-1 p-2">
																<Settings2 className="w-4 h-4 stroke-slate-500" />
																<MoreHorizontal className="w-4 h-4 stroke-slate-500" />
															</div>
														</div>
													))}
												</>
											);
										}}
									</Editor>
								</div>
							</div>
						</div>

						<div className="flex flex-col justify-end border-t">
							<span className="font-medium text-slate-400 mx-1.5 mt-1.5 mb-2.5 text-sm">
								Use 25 credits to regenerate ·{" "}
								<Link className="text-purple-600" href="#">
									See plans
								</Link>
							</span>
							<div className="flex gap-2">
								<Button className="flex gap-2 text-white bg-[#8F22CE] px-4 py-2">
									<Sparkle fill="white" className="w-4 h-4" />
									Regenerate 2 Edited Scenes
								</Button>
								<Button variant="outline" className="px-4 py-2">
									Or, Save Without Regenerating
								</Button>
							</div>
						</div>
					</div>
				</div>

				<div
					className={cn(
						"absolute right-0 mr-20 rounded-none",
						ImageRatio.width === 16 ? "w-[420px]" : "w-[220px]"
					)}
				>
					<VideoPlayer ref={videoPlayerRef} Webstory={WebstoryData} />
				</div>
			</div>
		</div>
	);
};

export default SceneEditorView;
