import { mainSchema } from "@/api/schema";
import { env } from "@/env.mjs";
import cn from "@/utils/cn";
import { DisplayAspectRatios, StoryOutputTypes } from "@/utils/enums";
import { ChevronRight, Edit2, Upload } from "lucide-react";
import StoryScreen from "../story-screen";
import { Skeleton } from "@/components/ui/skeleton";
import Format from "@/utils/format";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/router";
import Routes from "@/routes";

const MAX_SUMMARY_LENGTH = 251;

export default function PreviewEditor({
	ImageRatio,
	WebstoryData,
	isLoading,
	isError,
}: {
	WebstoryData?: mainSchema["ReturnVideoStoryDTO"];
	ImageRatio: {
		width: number;
		height: number;
		ratio: number;
		enumValue: DisplayAspectRatios;
	};
	isLoading?: boolean;
	isError?: boolean;
}) {
	const [showFullDescription, setShowFullDescription] = useState(false);
	const router = useRouter();

	return (
		<div
			className={cn(
				"relative w-4/5 m-auto",
				`w-full border-[1px] rounded-bl-lg rounded-br-lg lg:rounded-br-lg lg:rounded-tr-lg lg:rounded-tl-sm lg:rounded-bl-sm flex flex-col lg:flex-row m-auto`,
				// Based on aspect ratio we need to adjust the parent width
				// NOTE: taking 65% of the actual size on right (eg: 1080px, etc.)
				ImageRatio.width === 1 && "md:max-w-[1200px]", // 1080px
				ImageRatio.width === 9 && "max-w-[300px] md:max-w-[600px]", // 780px
				ImageRatio.width === 16 && "md:max-w-[1200px]" // 1620px
			)}
		>
			<div className=" rounded-t-lg lg:rounded-tr-none lg:rounded-bl-lg w-full">
				<StoryScreen Webstory={WebstoryData} isError={isError} />
			</div>
			<div
				className={cn(
					`p-6 flex flex-col-reverse w-full min-w-[300px] justify-between md:flex-col lg:max-w-sm bg-background rounded-bl-lg lg:rounded-bl-none lg:rounded-tr-lg rounded-br-lg`
				)}
			>
				<div className="relative space-y-2">
					{!env.NEXT_PUBLIC_DISABLE_UNIMPLEMENTED_FEATURES && (
						<Edit2 className="absolute -top-0.5 -right-0.5 w-4 h-4 stroke-muted-foreground" />
					)}
					<div className="flex gap-x-1 text-muted-foreground items-center text-sm">
						<p className="text-purple-500">
							{WebstoryData?.storyType === StoryOutputTypes.Story
								? "Storybook"
								: "Video"}
						</p>
						<ChevronRight className="w-4 h-4" />
						{isLoading ? (
							<Skeleton className="w-[100px] h-[20px] rounded-full" />
						) : (
							<p>{Format.Title(WebstoryData?.topLevelCategory)}</p>
						)}
					</div>
					{isLoading ? (
						<Skeleton className="min-w-72 h-[24px] rounded-md" />
					) : (
						<p className="text-2xl font-bold max-w-sm -tracking-[-0.6px]">
							{Format.Title(WebstoryData?.storyTitle)}
						</p>
					)}
					<Button
						className={`p-2 text-muted-foreground text-sm shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md `}
						variant="outline"
						onClick={() => {
							router.push(
								Routes.ViewStory(
									WebstoryData?.storyType,
									router.query.genre!.toString(),
									router.query.id!.toString()
								)
							);
						}}
					>
						<Upload className={cn("mr-2 h-4 w-4")} /> Publish{" "}
						{WebstoryData?.storyType === StoryOutputTypes.Story
							? "Story"
							: "Video"}
					</Button>

					{isLoading ? (
						<Skeleton className="min-w-72 h-[220px] rounded-lg" />
					) : (
						<p className="text-sm text-muted-foreground text-wrap text-ellipsis whitespace-nowrap overflow-hidden self-stretch">
							{showFullDescription
								? WebstoryData?.summary
								: Format.TruncateTextWithEllipses(
										WebstoryData?.summary,
										MAX_SUMMARY_LENGTH
									)}
						</p>
					)}

					{(WebstoryData?.summary?.length ?? 0) > MAX_SUMMARY_LENGTH &&
						!showFullDescription && (
							<Button
								variant="link"
								className="text-indigo-500 text-sm font-normal m-0 p-0"
								onClick={() => setShowFullDescription(true)}
							>
								See full description
							</Button>
						)}
				</div>
				<div className="lg:hidden my-2.5 bg-slate-200 self-stretch h-px" />
			</div>
		</div>
	);
}
