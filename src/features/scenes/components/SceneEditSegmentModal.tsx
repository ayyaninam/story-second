import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Settings2 } from "lucide-react";
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
			<div className="absolute w-[50%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-red-400 ">
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
										}}
										showAdvancedSettings={false}
									/>
								))}
							</div>
							<div className="flex mt-2 gap-1 mx-4 justify-end text-sm">
								<Button className="p-2" variant="outline" onClick={onClose}>
									Cancel
								</Button>
								<Button
									className="p-2 bg-purple-600"
									variant="default"
									onClick={() => {
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

export default SceneEditSegmentModal;
