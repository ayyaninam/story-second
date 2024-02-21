import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Settings2 } from "lucide-react";
import EditSegmentModalItem from "./EditSegmentModalItem";
import { Button } from "@/components/ui/button";
import { Scene, Segment, StoryStatus } from "../reducers/edit-reducer";

const EditSegmentModal = ({
	open,
	onClose,
	scene,
	sceneId,
	onSceneEdit,
}: {
	open?: boolean;
	onClose: () => void;
	scene?: Scene;
	sceneId?: number;
	onSceneEdit: (scene: Scene, index: number) => void;
}) => {
	console.log(">>>> isModalOpen", open, scene, sceneId);
	const [editedScene, setEditedScene] = useState(scene);

	if (scene && sceneId !== undefined) {
		return (
			<div className="absolute w-[50%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-red-400">
				<Dialog.Root open={open}>
					<Dialog.Portal>
						<Dialog.Overlay className="bg-[#0000000d] fixed inset-0" />
						<Dialog.Content className="bg-white rounded-sm shadow-sm fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 focus:outline-none">
							<Dialog.Title className="m-0 font-semibold text-[#121113] px-3 text-md">
								<div className="flex gap-2 items-center">
									<Settings2 width={16} height={16} />
									<p>Edit Segments</p>
								</div>
							</Dialog.Title>
							<Dialog.Description className="mt-3 mb-6 px-3 text-muted-foreground text-sm font-thin">
								Individually edit & regenerate the segments of each scene. For
								more control, used the advanced editing options. When you’re
								ready to see it, click regenerate.
							</Dialog.Description>
							<div className="overflow-auto max-h-[70vh] px-3">
								{editedScene?.segments?.map((segment, index) => (
									<EditSegmentModalItem
										key={index}
										segment={segment}
										onSegmentEdit={(updatedSegment) => {
											const updatedScene = { ...editedScene };
											const updatedSegments = [...updatedScene.segments];
											updatedSegments[index] = updatedSegment;
											updatedScene.segments = updatedSegments;
											setEditedScene(updatedScene);
										}}
										onSegmentDelete={() => {
											const updatedScene = { ...editedScene };
											const updatedSegments = [...updatedScene.segments];
											updatedScene.segments = updatedSegments.filter(
												(_, deleteIndex) => deleteIndex !== index
											);
											setEditedScene(updatedScene);
										}}
									/>
								))}
							</div>
							<div className="mx-4 justify-center">
								<Button
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
								</Button>
							</div>
							<div className="flex mt-2 gap-1 mx-4 justify-end text-sm">
								<Button className="p-2" variant="outline" onClick={onClose}>
									Cancel
								</Button>
								<Button
									className="p-2 bg-purple-600"
									variant="default"
									onClick={() => {
										if (editedScene) {
											onSceneEdit(editedScene, sceneId);
										}
										onClose();
									}}
								>
									Save Changes
								</Button>
							</div>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			</div>
		);
	}

	return null;
};

export default EditSegmentModal;
