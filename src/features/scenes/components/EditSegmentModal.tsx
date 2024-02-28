import React, { useState } from "react";
import { Check, RefreshCw, Settings2, Sparkle } from "lucide-react";
import EditSegmentModalItem from "./EditSegmentModalItem";
import { Button } from "@/components/ui/button";
import {
	EditStoryAction,
	EditStoryDraft,
	Scene,
	Segment,
	StoryStatus,
} from "../reducers/edit-reducer";
import api from "@/api";
import useWebstoryContext from "@/features/edit-story/providers/WebstoryContext";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";

const EditSegmentModal = ({
	open,
	onClose,
	scene,
	sceneId,
	onSceneEdit,
	sceneIndex,
	dispatch,
	story,
	handleRegenerateSceneImages,
}: {
	open?: boolean;
	onClose: () => void;
	scene?: Scene;
	sceneId?: number;
	onSceneEdit: (scene: Scene, index: number) => void;
	dispatch: React.Dispatch<EditStoryAction>;
	handleRegenerateSceneImages: (sceneIndex: number) => Promise<void>;
	story: EditStoryDraft;
	sceneIndex: number;
}) => {
	const [webstory] = useWebstoryContext();
	const [regeratingImages, setRegeneratingImages] = useState(
		Array(scene?.segments?.length).fill(false)
	);
	const [imageRegenerationSegmentId, setImageRegenerationSegmentId] = useState<
		number | null
	>(null);

	if (scene && sceneId !== undefined) {
		return (
			<Dialog
				open={open}
				modal
				onOpenChange={(open) => {
					!open && onClose();
				}}
			>
				<DialogContent className="max-w-[1100px] w-2/3 bg-background">
					<DialogTitle className="m-0 font-semibold text-foreground px-3 text-md">
						<div className="flex gap-2 items-center">
							<Settings2 width={16} height={16} />
							<p>Edit Segments</p>
						</div>
					</DialogTitle>
					<DialogDescription className="mt-3 px-3 text-muted-foreground text-sm font-thin">
						Individually edit & regenerate the segments of each scene. For more
						control, used the advanced editing options. When you’re ready to see
						it, click regenerate.
					</DialogDescription>
					<div className="overflow-auto max-h-[70vh] px-3">
						{story.scenes[sceneId]?.segments?.map((segment, index) => (
							<EditSegmentModalItem
								key={index}
								story={story}
								segment={segment}
								dispatch={dispatch}
								onSegmentEdit={(updatedSegment) => {
									dispatch({
										type: "edit_segment",
										sceneIndex: sceneId,
										segmentIndex: index,
										segment: updatedSegment,
									});
								}}
								onSegmentDelete={() => {
									dispatch({
										type: "delete_segment",
										sceneIndex: sceneId,
										segmentIndex: index,
									});
								}}
								segmentIndex={index}
								imageRegenerationSegmentId={imageRegenerationSegmentId}
								setImageRegenerationSegmentId={setImageRegenerationSegmentId}
								sceneIndex={sceneIndex}
							/>
						))}
					</div>
					<div className="flex mt-2 gap-1 mx-4 justify-end text-sm">
						<Button
							className="w-[50%] p-2 flex gap-1 text-purple-600 items-center"
							variant="outline"
							onClick={() => handleRegenerateSceneImages(sceneId)}
						>
							<RefreshCw width={16} height={16} />
							<p className="text-sm text-foreground font-semibold">
								Regenerate All Images
							</p>
							<p className="text-sm">(5 Credits)</p>
						</Button>
						<DialogClose asChild>
							<Button
								className="w-[50%] p-2 flex gap-1 items-center text-white bg-purple-600"
								variant="default"
							>
								<Check width={16} height={16} />
								<p className="text-sm font-semibold">Done</p>
							</Button>
						</DialogClose>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return null;
};

export default EditSegmentModal;
