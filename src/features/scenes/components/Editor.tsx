import AutosizeInput from "react-input-autosize";
import {
	EditStoryAction,
	EditStoryDraft,
	Scene,
	Segment,
	StoryStatus,
	TextStatus,
} from "../reducers/edit-reducer";
import { cn } from "@/utils";
import React, { useRef } from "react";
import { mainSchema } from "@/api/schema";
import { GenerateStoryDiff, WebstoryToStoryDraft } from "../utils/storydraft";

enum InputStatus {
	UNEDITED,
	EDITED,
	ADDED,
	DELETED,
}
// onChange;
// onMouseOverScene;
// onMouseOverSegment;
// sceneOptionsComponent;
// onCreateSegment;
// onDeleteSegment;
// onCreateScene;
// onDeleteScene;

const Editor = ({
	Webstory,
	story,
	dispatch,
	onInputChange,
	onCreateSegment,
	onDeleteSegment,
	onEditSegment,
	onCreateScene,
	onDeleteScene,
	onEditScene,
	children,
}: {
	Webstory: mainSchema["ReturnVideoStoryDTO"];
	story: EditStoryDraft;
	dispatch: React.Dispatch<EditStoryAction>;
	segmentClassName?: string;
	sceneClassName?: string;
	className?: string;
	onInputChange?: (
		e: React.ChangeEvent<HTMLInputElement>,
		segmentIndex: number,
		sceneIndex: number
	) => void;
	onCreateSegment?: (
		segment: Segment,
		segmentIndex: number,
		sceneIndex: number
	) => void;
	onEditSegment?: (
		segment: Segment,
		segmentIndex: number,
		sceneIndex: number
	) => void;
	onDeleteSegment?: (
		segment: Segment,
		segmentIndex: number,
		sceneIndex: number
	) => void;
	onCreateScene?: (scene: Scene, sceneIndex: number) => void;
	onEditScene?: (scene: Scene, sceneIndex: number) => void;
	onDeleteScene?: (scene: Scene, sceneIndex: number) => void;
	children: (props: {
		refs: React.MutableRefObject<HTMLInputElement[][]>;
		handleEnter: (
			scene: Scene,
			sceneIndex: number,
			segment: Segment,
			segmentIndex: number
		) => void;
		handleInput: (
			e: React.ChangeEvent<HTMLInputElement>,
			scene: Scene,
			sceneIndex: number,
			segment: Segment,
			segmentIndex: number
		) => void;
	}) => React.ReactNode;
}) => {
	const refs = useRef<HTMLInputElement[][]>(
		// Putting an absurdly high number of scenes to make things simpler
		Array.from({ length: 100 ?? 0 }, () => [])
	);

	const diff = GenerateStoryDiff(WebstoryToStoryDraft(Webstory), story);

	const getSegmentStatus = (sceneIndex: number, segmentIndex: number) => {
		if (
			diff.edits.find(
				(el) => el.sceneIndex === sceneIndex && el.segmentIndex === segmentIndex
			)
		) {
			return InputStatus.EDITED;
		} else if (
			diff.additions.find(
				(el) => el.sceneIndex === sceneIndex && el.segmentIndex === segmentIndex
			)
		) {
			return InputStatus.ADDED;
		} else if (
			diff.subtractions.find(
				(el) => el.sceneIndex === sceneIndex && el.segmentIndex === segmentIndex
			)
		) {
			// Deletions not yet implemented
			return InputStatus.DELETED;
		} else return InputStatus.UNEDITED;
	};

	const handleInput = (
		e: React.ChangeEvent<HTMLInputElement>,
		scene: Scene,
		sceneIndex: number,
		segment: Segment,
		segmentIndex: number
	) => {
		const content = e.target.value ?? "";
		onInputChange?.(e, segmentIndex, sceneIndex);

		if (
			// (No break) space or punctuation
			([" ", "\u00A0"].includes(content.slice(-1)) && content.length > 40) ||
			content.length > 50
		) {
			dispatch({
				type: "edit_segment",
				sceneIndex: sceneIndex,
				segmentIndex: segmentIndex,
				segment: {
					...segment,
					textContent: e.target.value.slice(0, -1),
				},
			});
			dispatch({
				type: "create_segment",
				sceneIndex: sceneIndex,
				segment: {
					audioKey: "",
					textContent: content.slice(-1),
					audioStatus: StoryStatus.READY,
					id: segment.id,
					imageKey: "",
					imageStatus: StoryStatus.READY,
					videoKey: "",
					videoStatus: StoryStatus.READY,
					textStatus: TextStatus.ADDED,
				},
				segmentIndex: segmentIndex,
			});
			onCreateScene?.(scene, sceneIndex);
			refs.current[sceneIndex]?.[segmentIndex + 1]?.focus();
		} else if (
			segment.textContent.length > 0 &&
			e.target.value.length === 0 &&
			scene.segments.length === 1
		) {
			dispatch({
				type: "delete_scene",
				index: sceneIndex,
			});
			onDeleteScene?.(scene, sceneIndex);
			refs.current[sceneIndex - 1]?.[
				story?.scenes[sceneIndex - 1]?.segments?.length ?? 0 - 1
			]?.focus();
		} else if (segment.textContent.length > 0 && e.target.value.length === 0) {
			dispatch({
				type: "delete_segment",
				sceneIndex: sceneIndex,
				segmentIndex: segmentIndex,
			});
			onDeleteSegment?.(segment, segmentIndex, sceneIndex);
			refs.current[sceneIndex]?.[segmentIndex - 1]?.focus();
		} else {
			dispatch({
				type: "edit_segment",
				sceneIndex: sceneIndex,
				segmentIndex: segmentIndex,
				segment: {
					...segment,
					textContent: e.target.value ?? "",
					textStatus: TextStatus.EDITED,
				},
			});
			onEditSegment?.(segment, segmentIndex, sceneIndex);
		}
	};
	const handleEnter = (
		scene: Scene,
		sceneIndex: number,
		segment: Segment,
		segmentIndex: number
	) => {
		// If the segment is the last segment in the scene, create a new scene
		if (segmentIndex === scene.segments.length - 1) {
			dispatch({
				type: "create_scene",
				scene: {
					segments: [
						{
							audioKey: "",
							textContent: " ",
							audioStatus: StoryStatus.READY,
							id: scene.segments.slice(-1)[0]?.id!,
							imageKey: "",
							imageStatus: StoryStatus.READY,
							videoKey: "",
							videoStatus: StoryStatus.READY,
							textStatus: TextStatus.ADDED,
						},
					],
					status: StoryStatus.READY,
					id: scene.id,
				},

				index: sceneIndex,
			});
			refs.current[sceneIndex + 1]?.[0]?.focus();
		}
		// Else, create a new segment
		else {
			dispatch({
				type: "create_segment",
				sceneIndex: sceneIndex,
				segment: {
					audioKey: "",
					textContent: " ",
					audioStatus: StoryStatus.READY,
					id: segment.id,
					imageKey: "",
					imageStatus: StoryStatus.READY,
					videoKey: "",
					videoStatus: StoryStatus.READY,
					textStatus: TextStatus.ADDED,
				},
				segmentIndex: segmentIndex,
			});
			refs.current[sceneIndex]?.[segmentIndex + 1]?.focus();
		}
	};

	return children({
		handleEnter: handleEnter,
		handleInput: handleInput,
		refs: refs,
	});
};

export default Editor;
