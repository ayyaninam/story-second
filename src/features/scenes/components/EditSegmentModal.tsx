import React, { useState } from "react";
import { Check, RefreshCw, Settings2, Sparkle } from "lucide-react";
import EditSegmentModalItem from "./EditSegmentModalItem";
import { Button } from "@/components/ui/button";
import {
	EditStoryAction,
	EditStoryDraft,
	Scene,
	StoryStatus,
} from "../reducers/edit-reducer";
import api from "@/api";
import useWebstoryContext from "@/features/edit-story/providers/WebstoryContext";
import {
	Dialog,
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
	dispatch,
	story,
}: {
	open?: boolean;
	onClose: () => void;
	scene?: Scene;
	sceneId?: number;
	onSceneEdit: (scene: Scene, index: number) => void;
	dispatch: React.Dispatch<EditStoryAction>;
	story: EditStoryDraft;
}) => {
	const [webstory] = useWebstoryContext();
	const [regeratingImages, setRegeneratingImages] = useState(
		Array(scene?.segments?.length).fill(false)
	);
	const handleRegenerateImage = async (segmentIndex: number) => {
		setRegeneratingImages((prev) => {
			prev[segmentIndex] = true;
			return prev;
		});
		const segment = story.scenes[sceneId ?? 0]?.segments[segmentIndex]!;
		const settings = segment?.settings;
		const _regeneratedImage = await api.video.regenerateImage({
			// @ts-expect-error not typed properly
			image_style: settings?.style!,
			prompt: settings?.prompt!,
			segment_idx: segment.id,
			story_id: story.id,
			story_type: webstory.storyType,
			cfg_scale: settings?.denoising,
			sampling_steps: settings?.samplingSteps,
			seed: settings?.seed,
		});
		dispatch({
			type: "edit_segment",
			sceneIndex: sceneId!,
			segmentIndex,
			segment: {
				...segment,
				imageStatus: StoryStatus.PENDING,
			},
		});
		setRegeneratingImages((prev) => {
			prev[segmentIndex] = false;
			return prev;
		});
	};
	if (scene && sceneId !== undefined) {
		return (
			<div className="absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
				<Dialog open={open}>
					<DialogContent className="bg-white rounded-sm shadow-sm fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 focus:outline-none">
						<DialogTitle className="m-0 font-semibold text-[#121113] px-3 text-md">
							<div className="flex gap-2 items-center">
								<Settings2 width={16} height={16} />
								<p>Edit Segments</p>
							</div>
						</DialogTitle>
						<DialogDescription className="mt-3 px-3 text-muted-foreground text-sm font-thin">
							Individually edit & regenerate the segments of each scene. For
							more control, used the advanced editing options. When you’re ready
							to see it, click regenerate.
						</DialogDescription>
						<div className="overflow-auto max-h-[70vh] px-3">
							{story.scenes[sceneId]?.segments?.map((segment, index) => (
								<EditSegmentModalItem
									key={index}
									segment={segment}
									onRegenerateImage={() => handleRegenerateImage(index)}
									regeneratingImage={regeratingImages[index]}
									onSegmentEdit={(updatedSegment) => {
										dispatch({
											type: "edit_segment",
											sceneIndex: sceneId,
											segmentIndex: index,
											segment: updatedSegment,
										});
										// setEditedScene(updatedScene);
									}}
									onSegmentDelete={() => {
										dispatch({
											type: "delete_segment",
											sceneIndex: sceneId,
											segmentIndex: index,
										});
									}}
								/>
							))}
						</div>
						<div className="mx-4 justify-center">
							{/* <Button
									className="p-2 w-full text-sm"
									variant="outline"
									onClick={() => {
										if (editedScene) {
											const updatedScene = { ...editedScene };
											const updatedSegments = [...updatedScene.segments];
											updatedSegments.push({
												id: updatedSegments.length,
												textContent: "",
												imageKey: "",
												videoKey: "",
												audioKey: "",
												imageStatus: StoryStatus.PENDING,
												videoStatus: StoryStatus.PENDING,
												audioStatus: StoryStatus.PENDING,
											});
											updatedScene.segments = updatedSegments;
											setEditedScene(updatedScene);
										}
									}}
								>
									Add New Segment
								</Button> */}
						</div>
						<div className="flex mt-2 gap-1 mx-4 justify-end text-sm">
							<Button
								className="w-[50%] p-2 flex gap-1 text-purple-600 items-center"
								variant="outline"
								onClick={onClose}
							>
								<RefreshCw width={16} height={16} />
								<p className="text-sm text-slate-950 font-semibold">
									Regenerate All Images
								</p>
								<p className="text-sm">(5 Credits)</p>
							</Button>
							<Button
								className="w-[50%] p-2 flex gap-1 items-center text-white bg-purple-600"
								variant="default"
								onClick={() => {
									// if (editedScene) {
									// 	onSceneEdit(editedScene, sceneId);
									// }
									onClose();
								}}
							>
								<Check width={16} height={16} />
								<p className="text-sm">Done</p>
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		);
	}

	return null;
};

export default EditSegmentModal;
