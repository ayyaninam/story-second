import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Settings2 } from "lucide-react";
import EditVideoSegmentModalitem from "./EditVideoSegmentModalItem";
import { Button } from "@/components/ui/button";
import {
	EditStoryAction,
	EditStoryDraft,
	Scene,
	StoryStatus,
} from "../reducers/edit-reducer";
import api from "@/api";
import useWebstoryContext from "@/features/edit-story/providers/WebstoryContext";

const SceneEditSegmentModal = ({
	open,
	onClose,
	scene,
	sceneId,
	dispatch,
	story,
}: {
	open?: boolean;
	onClose: () => void;
	scene?: Scene;
	sceneId?: number;
	dispatch: React.Dispatch<EditStoryAction>;
	story: EditStoryDraft;
}) => {
	const [webstory] = useWebstoryContext();
	const [regeratingImages, setRegeneratingImages] = useState(
		Array(scene?.segments?.length).fill(false)
	);
	const handleRegenerateVideo = async (segmentIndex: number) => {
		const segment = story.scenes[sceneId ?? 0]?.segments[segmentIndex]!;
		dispatch({
			type: "edit_segment",
			sceneIndex: sceneId!,
			segmentIndex,
			segment: {
				...segment,
				videoStatus: StoryStatus.PENDING,
			},
		});
		await api.video.regenerateVideo({
			segment_idx: segment.id,
			story_id: story.id,
			story_type: webstory.storyType,
		});
	};
	if (scene && sceneId !== undefined) {
		return (
			<div className="absolute w-[50%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 ">
				<Dialog.Root open={open}>
					<Dialog.Portal>
						<Dialog.Overlay className="bg-[#0000000d] fixed inset-0" />
						<Dialog.Content className="bg-white rounded-sm shadow-sm fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 focus:outline-none font-mono">
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
								{story.scenes[sceneId]?.segments?.map((segment, index) => (
									<EditVideoSegmentModalitem
										key={index}
										segment={segment}
										onRegenerateImage={() => handleRegenerateVideo(index)}
										regeneratingImage={regeratingImages[index]}
										onSegmentEdit={(updatedSegment) => {
											dispatch({
												type: "edit_segment",
												sceneIndex: sceneId,
												segmentIndex: index,
												segment: updatedSegment,
											});
										}}
										showAdvancedSettings={false}
									/>
								))}
							</div>
							<div className="flex mt-2 gap-1 mx-4 justify-end text-sm">
								{/* <Button className="p-2" variant="outline" onClick={onClose}>
									Close
								</Button> */}
								<Button className="p-2" variant="outline" onClick={onClose}>
									Close
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

export default SceneEditSegmentModal;
