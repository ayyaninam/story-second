import { AspectRatios } from "@/utils/enums";
import { cn } from "@/utils";
import StoryScreen from "@/features/edit-story/story-screen";
import { mainSchema } from "@/api/schema";
import {
	ChevronDown,
	Film,
	HelpCircle,
	PlayCircle,
	Plus,
	Sparkle,
	Upload,
	Video,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Format from "@/utils/format";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/features/edit-story/components/mode-toggle";
import StoryScreenBgBlur from "@/components/ui/story-screen-bg-blur";
import { Badge } from "@/components/ui/badge";

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
	const [showFullDescription, setShowFullDescription] = useState(false);
	const [isPlaying, setIsPlaying] = useState<boolean | undefined>();
	const [seekedFrame, setSeekedFrame] = useState<number | undefined>();
	return (
		<div className="relative rounded-lg border-[1px] w-full border-border bg-border bg-blend-luminosity px-2 lg:px-5 py-2">
			<div className="absolute w-[1px] h-full bg-purple-600 bottom-[1px] left-1/2 transform -translate-x-1/2 flex flex-row" />
			<div className="flex justify-center m-10">
				<Badge
					variant="outline"
					className={`bg-primary-foreground font-normal text-sm`}
				>
					<Film className="stroke-purple-600 mr-1 h-4 w-4" />
					Generate & Edit Your Scenes
				</Badge>
			</div>

			<div className="flex flex-col md:flex-row items-center justify-center">
				<div
					className={cn(
						`w-full bg-background border-[1px] rounded-bl-lg rounded-br-lg lg:rounded-br-lg lg:rounded-tr-lg lg:rounded-tl-lg lg:rounded-bl-lg flex flex-col lg:flex-row justify-stretch`,
						// Based on aspect ratio we need to adjust the parent width
						ImageRatio.width === 1 && "md:max-w-[1080px]",
						ImageRatio.width === 3 && "md:max-w-[900px]",
						ImageRatio.width === 4 && "md:max-w-[1280px]",
						ImageRatio.width === 9 && "md:max-w-[780px]",
						ImageRatio.width === 16 && "md:max-w-[1620px]"
					)}
				>
					<div
						className={`p-6 flex flex-col-reverse justify-between md:flex-col lg:max-w-sm bg-description rounded-t-lg lg:rounded-bl-lg lg:rounded-tl-lg lg:rounded-tr-none lg:rounded-br-none`}
					>
						<div className="relative space-y-2">
							{isLoading ? (
								<Skeleton className="min-w-72 h-[24px] rounded-md" />
							) : (
								<p className="text-2xl font-bold max-w-sm -tracking-[-0.6px]">
									{Format.Title(WebstoryData?.storyTitle)}
								</p>
							)}

							<p className="w-full inline-flex border-b-border border-b-2 text-slate-400 text-xs py-1">
								<div className="flex">
									60 Second Movie{" "}
									<ChevronDown className="mr-2 h-4 w-4 text-xs" />
								</div>
								<div className="flex">
									No Audio <ChevronDown className="mr-2 h-4 w-4 text-xs" />
								</div>
								<p className="ms-1">by Anthony Deloso</p>
							</p>
						</div>

						<div className="gap-x-2.5">
							<p className="w-full inline-flex border-t-border border-t-2 text-slate-400 text-xs py-1">
								Use 25 Credits to regenerate.
								<p className="ms-1 text-purple-600">See Plans</p>
							</p>
							<div className="hidden md:block text-muted-foreground space-x-2 items-center">
								<Button className="p-2 bg-purple-600" variant="default">
									<Sparkle className="mr-2 h-4 w-4 text-xs" /> Regenerate 1
									Edited Scene
								</Button>
								<Button className="p-2 text-xs align-top" variant="outline">
									Or, Save Draft
								</Button>
							</div>
						</div>
					</div>

					<div className="relative w-full rounded-tl-lg rounded-bl-lg m-3">
						<StoryScreenBgBlur
							blur="3xl"
							Webstory={WebstoryData}
							isError={isError}
							isPlaying={isPlaying}
							seekedFrame={seekedFrame}
						/>
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
						<div className="absolute top-0 left-0 w-full lg:max-w-[100%] rounded-tl-lg rounded-bl-lg">
							<StoryScreen
								Webstory={WebstoryData}
								isError={isError}
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
		</div>
	);
}
