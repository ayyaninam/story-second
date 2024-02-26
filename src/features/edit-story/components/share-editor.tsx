import { mainSchema } from "@/api/schema";
import { env } from "@/env.mjs";
import cn from "@/utils/cn";
import { DisplayAspectRatios } from "@/utils/enums";
import { ChevronRight, Edit2 } from "lucide-react";
import StoryScreen from "../story-screen";
import { Skeleton } from "@/components/ui/skeleton";
import Format from "@/utils/format";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MAX_SUMMARY_LENGTH = 251;

export default function ShareEditor({
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

	return (
		<div
			className={cn(
				`w-full border-[1px] rounded-bl-lg rounded-br-lg lg:rounded-br-lg lg:rounded-tr-lg lg:rounded-tl-sm lg:rounded-bl-sm flex flex-col lg:flex-row m-auto`,
				// Based on aspect ratio we need to adjust the parent width
				// NOTE: taking 65% of the actual size on right (eg: 1080px, etc.)
				ImageRatio.width === 1 && "md:max-w-[702px]", // 1080px
				ImageRatio.width === 3 && "md:max-w-[585px]", // 900px
				ImageRatio.width === 4 && "md:max-w-[832px]", // 1280px
				ImageRatio.width === 9 && "md:max-w-[507px]", // 780px
				ImageRatio.width === 16 && "md:max-w-[1053px]" // 1620px
			)}
		>
			<div
				className="relative w-full rounded-t-lg lg:rounded-tr-none lg:rounded-bl-lg"
				style={{ aspectRatio: ImageRatio.ratio }}
			>
				<StoryScreen Webstory={WebstoryData} isError={isError} />
			</div>
			<div
				className={cn(
					`p-6 flex flex-col-reverse justify-between md:flex-col lg:max-w-sm bg-background rounded-bl-lg lg:rounded-bl-none lg:rounded-tr-lg rounded-br-lg`
				)}
			>
				<div className="relative space-y-2">
					{!env.NEXT_PUBLIC_DISABLE_UNIMPLEMENTED_FEATURES && (
						<Edit2 className="absolute -top-0.5 -right-0.5 w-4 h-4 stroke-muted-foreground" />
					)}
					<div className="flex gap-x-1 text-muted-foreground items-center text-sm">
						<p className="text-purple-500">Video</p>
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
				<div className="flex gap-x-2.5">
					{isLoading ? (
						<Skeleton className="w-[44px] h-[44px] rounded-full" />
					) : (
						<Avatar className="h-11 w-11">
							<AvatarImage
								src={WebstoryData?.user?.profilePicture ?? undefined}
							/>
							<AvatarFallback>
								{Format.AvatarName(WebstoryData?.user?.name)}
							</AvatarFallback>
						</Avatar>
					)}
					{isLoading ? (
						<Skeleton className="w-[168px] h-[44px] rounded-lg" />
					) : (
						<span className="flex flex-col">
							<span>{WebstoryData?.user?.name} </span>
							<span className="flex text-muted-foreground gap-x-1 items-center text-sm">
								<p>
									{(WebstoryData?.user?.videoCount ?? 0) +
										(WebstoryData?.user?.storyCount ?? 0)}{" "}
									Stories
								</p>
								<p className="text-slate-300"> • </p>
							</span>
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
