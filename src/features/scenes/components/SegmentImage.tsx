import Format from "@/utils/format";
import Image from "next/image";
import React from "react";
import {
	EditStoryAction,
	EditStoryDraft,
	Segment,
} from "../reducers/edit-reducer";
import { GetImageRatio } from "@/utils/image-ratio";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import ImageRegenerationPopup from "./ImageRegenerationPopup";

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
	imageRegenerationSegmentId: number | null;
	setImageRegenerationSegmentId: React.Dispatch<
		React.SetStateAction<number | null>
	>;
	dispatch: React.Dispatch<EditStoryAction>;
	segmentIndex: number;
	sceneIndex: number;
}) {
	const imageAspectRatio = GetImageRatio(story.resolution).ratio;

	return (
		<Popover open={imageRegenerationSegmentId === segment.id}>
			<PopoverTrigger onClick={() => setImageRegenerationSegmentId(segment.id)}>
				<div
					className="relative h-40"
					style={{
						aspectRatio: imageAspectRatio,
					}}
				>
					<Image
						alt={segment.textContent}
						src={Format.GetImageUrl(segment.imageKey)}
						className="rounded-sm"
						layout="fill"
						objectFit="cover" // Or use 'cover' depending on the desired effect
						style={{ objectFit: "contain" }}
					/>
				</div>
			</PopoverTrigger>
			<ImageRegenerationPopup
				segment={segment}
				story={story}
				onClose={() =>
					setImageRegenerationSegmentId((prevSegmentId) => {
						if (prevSegmentId === segment.id) return null;
						return prevSegmentId;
					})
				}
				imageRegenerationSegmentId={imageRegenerationSegmentId}
				dispatch={dispatch}
				segmentIndex={segmentIndex}
				sceneIndex={sceneIndex}
			/>
		</Popover>
	);
}

export default SegmentImage;
