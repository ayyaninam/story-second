import { mainSchema } from "@/api/schema";
import { ChevronDown, ScrollText, SparkleIcon } from "lucide-react";
import ScriptEditorViewTypes from "./ScriptEditorViewTypes";
import { ScriptEditorViewType } from "@/utils/enums";
import Format from "@/utils/format";
import cn from "@/utils/cn";
import { scenes } from "./script-editor-dummy-data";

export default function ScriptEditorView({
	WebstoryData,
}: {
	WebstoryData?: mainSchema["ReturnVideoStoryDTO"];
}) {
	return (
		<div className="w-[80%] m-auto">
			<div className="w-full flex items-center justify-between gap-1 p-1 rounded-tl-lg rounded-tr-lg bg-primary-foreground font-normal text-xs border border-purple-500 bg-purple-100 text-purple-900">
				<div className="flex items-center gap-1">
					<ScrollText className="stroke-purple-600 mr-1 h-4 w-4" />
					<p>Script Editor</p>
					<ScriptEditorViewTypes type={ScriptEditorViewType.Title_Scenes} />
				</div>
				<div className="flex gap-1 items-center">
					<p className="px-1 text-purple-900">
						Pro Tip —  A script is the foundation of a video. Write
						expressively.
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
						className={`p-6 gap-2 flex w-full flex-col-reverse justify-between md:flex-col rounded-t-lg lg:rounded-bl-lg lg:rounded-tl-lg lg:rounded-tr-none lg:rounded-br-none`}
					>
						{scenes.map((scene, index) => {
							return (
								<div key={index}>
									<p className="text-xs w-fit font-thin text-slate-600 p-1 bg-slate-50 rounded-sm">
										{scene.scene}
									</p>
									<p className="text-sm text-slate-900">{scene.segments}</p>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
