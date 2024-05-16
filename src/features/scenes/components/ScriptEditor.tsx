import { DisplayAspectRatios } from "@/utils/enums";
import { LayoutList, RefreshCw } from "lucide-react";
import {
	EditStoryAction,
	EditStoryDraft,
	Segment,
	TextStatus,
} from "../reducers/edit-reducer";
import { mainSchema } from "@/api/schema";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { VideoPlayerHandler } from "@/features/edit-story/components/video-player";

import Editor from "./Editor";
import { cn } from "@/utils";
import Format from "@/utils/format";
import AutosizeInput from "react-input-autosize";
import TextareaAutosize from "react-textarea-autosize";
import TooltipComponent from "@/components/ui/tooltip-component";
import { TooltipProvider } from "@/components/ui/tooltip";
import CategorySelect from "@/components/ui/CategorySelect";
import { useUpdateCategory } from "../mutations/UpdateCategory";
import { useMediaQuery } from "usehooks-ts";

export default function ScriptEditor({
	WebstoryData,
	ImageRatio,
	isError,
	isLoading,
	dispatch,
	story,
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
	const userName = useMemo(() => {
		return WebstoryData?.user?.name;
	}, [WebstoryData?.user?.name]);

	const UpdateCategory = useUpdateCategory();
	const isMobile = useMediaQuery("(max-width: 640px)");
	return (
		<>
			<TooltipProvider>
				<div className="relative w-full lg:w-4/5 h-full lg:h-4/5 max-w-[1300px] m-auto bg-background rounded-lg shadow-lg">
					<div className="w-full flex items-center justify-between gap-1 p-1 rounded-tl-lg rounded-tr-lg bg-primary-foreground font-normal text-xs border border-purple-500 bg-purple-100 text-purple-900">
						<div className="flex items-center gap-1">
							<LayoutList className="stroke-accent-600 mr-1 h-4 w-4" />
							<p>Script View</p>
						</div>
						<div className="flex gap-1 items-center">
							<p className="px-1 text-accent-900">
								{isMobile
									? "Pro Tip — Visit on desktop for granular editing control"
									: "Pro Tip — A script is the foundation of a video. Write expressively."}
							</p>
						</div>
					</div>
					<div className="relative px-6 pt-6 pb-2">
						<p className="text-2xl font-bold max-w-sm -tracking-[-0.6px]">
							{Format.Title(WebstoryData?.storyTitle)}
						</p>
						<div className="w-full inline-flex text-slate-400 text-xs py-1">
							{/* <CategorySelect
								value={WebstoryData?.topLevelCategory!}
								onChange={(category) => UpdateCategory.mutate({ category })}
							/> */}
							<p className="ms-1">by {userName}</p>
						</div>
					</div>
					<div className="flex flex-col md:flex-row items-center justify-center w-full">
						<div
							className={cn(
								`w-full pb-6 bg-background rounded-bl-lg rounded-br-lg lg:rounded-br-lg lg:rounded-bl-lg flex flex-col lg:flex-row justify-stretch h-full`
							)}
						>
							<div
								className={`px-6 flex w-full flex-col-reverse justify-between md:flex-col rounded-t-lg lg:rounded-bl-lg lg:rounded-tl-lg lg:rounded-tr-none lg:rounded-br-none`}
							>
								<div className="space-y-2 max-h-[55vh] lg:max-h-[40vh] overflow-y-auto overflow-x-hidden">
									<Editor
										Webstory={WebstoryData!}
										dispatch={dispatch}
										story={story}
									>
										{({
											handleEnter,
											handleInput,
											handleNavigation,
											handleDelete,
											handleFocus,
											refs,
										}) => {
											return (
												<div className={cn("w-full")}>
													{story.scenes.map((scene, sceneIndex) => (
														<div
															key={sceneIndex}
															className="flex flex-wrap flex-col max-w-full"
														>
															{/*<TooltipComponent*/}
															{/*  align="start"*/}
															{/*  label="You can edit scenes in the storyboard"*/}
															{/*>*/}
															<div className="bg-muted font-normal text-muted-foreground rounded-sm text-sm w-fit my-2 px-1">
																{`Scene ${sceneIndex + 1}: `}
																{scene.description}
															</div>
															{/*</TooltipComponent>*/}

															<div className="flex flex-wrap flex-row max-w-full">
																{scene.segments.map((segment, segmentIndex) => (
																	<span
																		key={segmentIndex}
																		style={{ backgroundColor: "transparent" }}
																		className={cn(`flex flex-wrap w-full`)}
																	>
																		<TextareaAutosize
																			maxRows={10}
																			autoComplete="false"
																			disabled={!WebstoryData?.storyDone}
																			onKeyDown={(e) => {
																				if (e.key.startsWith("Arrow")) {
																					handleNavigation({
																						event: e,
																						totalScenes: story.scenes.length,
																						totalSegments:
																							scene.segments.length,
																						currentScene: sceneIndex,
																						currentSegment: segmentIndex,
																						segmentContentLength:
																							segment.textContent.length,
																					});
																				}

																				if (e.key === "Enter") {
																					e.preventDefault();
																					handleEnter(
																						scene,
																						sceneIndex,
																						segment,
																						segmentIndex
																					);
																				}

																				if (e.key === "Backspace") {
																					handleDelete({
																						event: e,
																						totalScenes: story.scenes.length,
																						currentScene: sceneIndex,
																						currentSegment: segmentIndex,
																					});
																				}
																			}}
																			name={segmentIndex.toString()}
																			className={cn(
																				"flex overflow-hidden resize-none flex-wrap w-full active:outline-none bg-transparent text-primary hover:text-slate-950 focus:text-slate-950 focus:!bg-accent-200 hover:!bg-accent-100 rounded-sm px-1 focus:outline-none",
																				segment.textStatus ===
																					TextStatus.EDITED && "text-purple-500"
																			)}
																			style={{
																				outline: "none",
																				backgroundColor: "inherit",
																			}}
																			// @ts-ignore
																			ref={(el) => {
																				// @ts-ignore
																				if (!refs.current[sceneIndex]) {
																					refs.current[sceneIndex] = [];
																				}
																				// @ts-ignore
																				refs.current[sceneIndex][segmentIndex] =
																					el;
																			}}
																			value={segment.textContent}
																			onChange={(e) =>
																				handleInput(
																					e,
																					scene,
																					sceneIndex,
																					segment,
																					segmentIndex
																				)
																			}
																			onFocus={() => {
																				handleFocus(sceneIndex, segmentIndex);
																			}}
																		/>
																	</span>
																))}
															</div>
														</div>
													))}
													{!WebstoryData?.storyDone && (
														<div className="flex w-full justify-center items-center border-t-2 p-2 gap-1">
															<RefreshCw className="animate-spin stroke-purple-600" />
															<p>Generating your story</p>
														</div>
													)}
												</div>
											);
										}}
									</Editor>
								</div>
							</div>
						</div>
					</div>
				</div>
			</TooltipProvider>
		</>
	);
}
