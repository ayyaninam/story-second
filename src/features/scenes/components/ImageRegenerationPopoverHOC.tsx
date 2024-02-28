import React from "react";
import {
	EditStoryAction,
	EditStoryDraft,
	Segment,
} from "../reducers/edit-reducer";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import ImageRegenerationPopup from "./ImageRegenerationPopup";

function ImageRegenerationPopoverHOC({
	segment,
	story,
	open,
	onClose,
	dispatch,
	segmentIndex,
	sceneIndex,
	children,
	regenerateOnOpen,
	triggerButtonClassName,
	handleSubmitEditSegments,
}: {
	segment: Segment;
	story: EditStoryDraft;
	open: boolean;
	onClose: () => void;
	dispatch: React.Dispatch<EditStoryAction>;
	segmentIndex: number;
	sceneIndex: number;
	children: React.ReactNode;
	regenerateOnOpen?: boolean;
	triggerButtonClassName?: string;
	handleSubmitEditSegments: () => void;
}) {
	if (segment.id === 2) {
		console.log(
			"testing123 segment",
			segment,
			`imageStatus${segment.imageStatus}`,
			segment.alternateImageKeys
		);
	}
	return (
		<Popover open={open}>
			<PopoverTrigger className={triggerButtonClassName}>
				{children}
			</PopoverTrigger>
			<ImageRegenerationPopup
				segment={segment}
				story={story}
				onClose={onClose}
				dispatch={dispatch}
				segmentIndex={segmentIndex}
				sceneIndex={sceneIndex}
				regenerateOnOpen={regenerateOnOpen}
				open={open}
				handleSubmitEditSegments={handleSubmitEditSegments}
			/>
		</Popover>
	);
}

export default ImageRegenerationPopoverHOC;
