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
}) {
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
			/>
		</Popover>
	);
}

export default ImageRegenerationPopoverHOC;
