import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PropsWithChildren } from "react";
import * as Select from "@radix-ui/react-select";
import React from "react";
import { Segment, StoryStatus } from "../reducers/edit-reducer";
import Format from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { GetDisplayImageRatio } from "@/utils/image-ratio";
import { DisplayAspectRatios } from "@/utils/enums";
import { RefreshCcw } from "lucide-react";

function RegenerateSegmentBar({
	segment,
	onTextContentChange,
	onRegenerateVideo,
	regeneratingImage,
	displayResolution,
}: {
	segment: Segment;
	onTextContentChange: (change: string) => void;
	onRegenerateVideo: () => void;
	regeneratingImage: boolean;
	displayResolution: DisplayAspectRatios;
}) {
	return (
		<div className="flex w-full items-center rounded-sm justify-between">
			<div
				className="h-56"
				style={{
					aspectRatio: GetDisplayImageRatio(displayResolution).ratio,
				}}
			>
				<div className="relative w-full h-full">
					{segment.videoStatus === StoryStatus.PENDING && (
						<RefreshCcw
							className="stroke-purple-500 absolute right-2 top-2 z-10 h-4 w-4 animate-spin"
							style={{ animationDirection: "reverse" }}
						/>
					)}
					{segment.imageStatus === StoryStatus.COMPLETE ? (
						<Image
							alt={segment.textContent}
							src={Format.GetImageUrl(segment.imageKey)}
							className="rounded-sm"
							layout="fill"
							objectFit="cover" // Or use 'cover' depending on the desired effect
							style={{ objectFit: "contain" }}
						/>
					) : (
						<Skeleton>
							<div className="bg-muted w-[66px] h-[42px]"></div>
						</Skeleton>
					)}
				</div>
			</div>

			<p className="text-muted-foreground">{segment.textContent}</p>
			<Button
				className="w-[150px] text-background bg-accent-600"
				disabled={segment.videoStatus === StoryStatus.PENDING}
				onClick={() => onRegenerateVideo()}
			>
				{segment.videoStatus === StoryStatus.PENDING
					? "Loading"
					: "Regenerate Video"}
			</Button>
		</div>
	);
}

export default function EditSegmentModalItem({
	segment,
	onSegmentEdit,
	onSegmentDelete,
	onRegenerateVideo,
	regeneratingImage,
	displayResolution,
}: {
	segment: Segment;
	onSegmentEdit: (updatedSegment: Segment) => void;
	onSegmentDelete?: () => void;
	onRegenerateVideo: () => void;
	regeneratingImage: boolean;
	displayResolution: DisplayAspectRatios;
}) {
	return (
		<div className="flex bg-primary-foreground rounded-md border-border border-[1px] p-2 m-2 gap-2">
			<div className="w-full text-background space-y-2">
				<RegenerateSegmentBar
					segment={segment}
					onRegenerateVideo={onRegenerateVideo}
					regeneratingImage={regeneratingImage}
					onTextContentChange={(change) => {
						onSegmentEdit({
							...segment,
							textContent: change,
						});
					}}
					displayResolution={displayResolution}
				/>
			</div>
		</div>
	);
}
