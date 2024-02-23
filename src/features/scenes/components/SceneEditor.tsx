import { StoryboardViewType } from "@/utils/enums";
import {
	ChevronDown,
	Film,
	HelpCircle,
	LayoutList,
	SparkleIcon,
	ScrollText,
} from "lucide-react";
import { ModeToggle } from "@/features/edit-story/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { useImmerReducer } from "use-immer";
import editStoryReducer, {
	EditStoryAction,
	EditStoryDraft,
	TextStatus,
} from "../reducers/edit-reducer";
import { WebstoryToStoryDraft } from "../utils/storydraft";
import { mainSchema } from "@/api/schema";
import React from "react";
import Editor from "./Editor";
import { cn } from "@/utils";
import Format from "@/utils/format";
import StoryboardViewTypes from "./StoryboardViewTypesComponent";
import AutosizeInput from "react-input-autosize";

export default function VideoEditorStoryboard({
	WebstoryData,
}: {
	WebstoryData?: mainSchema["ReturnVideoStoryDTO"];
}) {
	const [story, dispatch] = useImmerReducer<EditStoryDraft, EditStoryAction>(
		editStoryReducer,
		WebstoryToStoryDraft(WebstoryData!)
	);

	return (
		<div className="relative z-0 w-full items-center justify-center flex flex-col h-full px-2 lg:px-5 py-2">
			<div className="flex justify-center mt-auto">
				<Badge
					variant="outline"
					className={`bg-primary-foreground font-normal text-sm`}
				>
					<ScrollText className="stroke-purple-600 mr-1 h-4 w-4" />
					Generate & Edit Your Scenes
				</Badge>
			</div>
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
						<p>Scene Editor View</p>
						<StoryboardViewTypes type={StoryboardViewType.Outline} />
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
														className="flex flex-wrap flex-row hover:bg-slate-50"
													>
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

			<div className="flex justify-center mb-auto">
				<Badge
					variant="outline"
					className={`bg-primary-foreground font-normal text-sm`}
				>
					<Film className="stroke-purple-600 mr-1 h-4 w-4" />
					View & Share The Final Cut
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
			<div className="absolute w-[1px] h-screen bg-purple-300 z-[-1] mix-blend-multiply" />
		</div>
	);
}
