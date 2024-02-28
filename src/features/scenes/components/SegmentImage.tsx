import Format from "@/utils/format";
import Image from "next/image";
import React from "react";
import {
	EditStoryAction,
	EditStoryDraft,
	Segment,
	StoryStatus,
} from "../reducers/edit-reducer";
import { GetDisplayImageRatio } from "@/utils/image-ratio";
import ImageRegenerationPopoverHOC from "./ImageRegenerationPopoverHOC";
import ImageRegenerationLoader from "./ImageRegenerationLoader";

function SegmentImage({
	segment,
	story,
	imageRegenerationSegmentId,
	setImageRegenerationSegmentId,
	dispatch,
	segmentIndex,
	sceneIndex,
}: {
	segment: Segment;
	story: EditStoryDraft;
	dispatch: React.Dispatch<EditStoryAction>;
	segmentIndex: number;
	sceneIndex: number;
	imageRegenerationSegmentId: number | null;
	setImageRegenerationSegmentId: React.Dispatch<
		React.SetStateAction<number | null>
	>;
}) {
	const imageAspectRatio = GetDisplayImageRatio(story.displayResolution).ratio;
	return (
		<ImageRegenerationPopoverHOC
			segment={segment}
			story={story}
			open={imageRegenerationSegmentId === segment.id}
			onClose={() => {
				setImageRegenerationSegmentId((prevSegmentId) => {
					if (prevSegmentId === segment.id) return null;
					return prevSegmentId;
				});
			}}
			dispatch={dispatch}
			segmentIndex={segmentIndex}
			sceneIndex={sceneIndex}
			triggerButtonClassName="max-w-full"
		>
			<div
				className="relative max-w-full h-40"
				style={{
					aspectRatio: imageAspectRatio,
				}}
				onClick={() => setImageRegenerationSegmentId(segment.id)}
			>
				{segment.imageStatus === StoryStatus.PENDING ? (
					<ImageRegenerationLoader arcSize={42} starSize={16} circleSize={48} />
				) : (
					<Image
						alt={segment.textContent}
						src={Format.GetImageUrl(segment.imageKey)}
						className="rounded-sm"
						layout="fill"
						objectFit="cover" // Or use 'cover' depending on the desired effect
						style={{ objectFit: "contain" }}
					/>
				)}
			</div>
		</ImageRegenerationPopoverHOC>
	);
}

export default SegmentImage;
