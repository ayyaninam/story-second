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
import React, { useEffect, useRef } from "react";
import { mainSchema } from "@/api/schema";
import { GenerateStoryDiff, WebstoryToStoryDraft } from "../utils/storydraft";
import { MAX_SEGMENT_LENGTH, MAX_SEGMENT_WORD_LENGTH } from "@/constants";

enum InputStatus {
	UNEDITED,
	EDITED,
	ADDED,
	DELETED,
}

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
		refs: React.MutableRefObject<(HTMLInputElement | null)[][]>;
		handleNavigation: ({
			event,
			totalScenes,
			totalSegments,
			currentScene,
			currentSegment,
			segmentContentLength,
		}: {
			event: React.KeyboardEvent<HTMLInputElement>;
			totalScenes: number;
			totalSegments: number;
			currentScene: number;
			currentSegment: number;
			segmentContentLength: number;
		}) => void;
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
			diff.additions
				.flat()
				.find(
					(el) =>
						el.sceneIndex === sceneIndex && el.segmentIndex === segmentIndex
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
			([" ", "\u00A0"].includes(content.slice(-1)) &&
				content.length > MAX_SEGMENT_WORD_LENGTH) ||
			content.length > MAX_SEGMENT_LENGTH
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
			setTimeout(() => {
				refs.current[sceneIndex]?.[segmentIndex + 1]?.focus();
			}, 0);
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
		// if (segmentIndex === scene.segments.length - 1) {
		if (false) {
			// TODO: uncomment this when scene editor support is added
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
					description: "",
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
			setTimeout(() => {
				refs.current[sceneIndex]?.[segmentIndex + 1]?.focus();
			}, 0);
		}
	};

	const focusInput = (autoSizeInput?: HTMLInputElement, atStart = false) => {
		autoSizeInput?.focus();
		if (atStart) {
			autoSizeInput?.setSelectionRange(0, 0);
		} else {
			autoSizeInput?.setSelectionRange(
				autoSizeInput?.value.length ?? 0,
				autoSizeInput?.value.length ?? 0
			);
		}
	};

	const handleNavigation = ({
		event,
		totalScenes,
		totalSegments,
		currentScene,
		currentSegment,
		segmentContentLength,
	}: {
		event: React.KeyboardEvent<HTMLInputElement>;
		totalScenes: number;
		totalSegments: number;
		currentScene: number;
		currentSegment: number;
		segmentContentLength: number;
	}) => {
		if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
			if (
				event.key === "ArrowRight" &&
				event.currentTarget.selectionStart !== null &&
				event.currentTarget.selectionStart === segmentContentLength
			) {
				const nextSceneIndex =
					currentSegment === totalSegments - 1
						? (currentScene + 1) % totalScenes
						: currentScene;
				const nextSegmentIndex =
					currentSegment === totalSegments - 1 ? 0 : currentSegment + 1;
				focusInput(
					// @ts-ignore
					refs.current[nextSceneIndex]?.[nextSegmentIndex]?.input,
					true
				);
				event.preventDefault();
			} else if (
				event.key === "ArrowLeft" &&
				event.currentTarget.selectionStart !== null &&
				event.currentTarget.selectionStart === 0
			) {
				const nextSceneIndex =
					currentSegment === 0
						? (currentScene - 1) % totalScenes
						: currentScene;
				const nextSegmentIndex =
					currentSegment === 0
						? (story?.scenes?.[nextSceneIndex]?.segments.length || 1) - 1
						: currentSegment - 1;
				focusInput(
					// @ts-ignore
					refs.current[nextSceneIndex]?.[nextSegmentIndex]?.input
				);
				event.preventDefault();
			}
		}

		//  Scene Navigation
		else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
			if (event.key === "ArrowUp") {
				const sceneIndex =
					(currentScene - 1 < 0
						? // Loop back last element if up arrow is pressed on first element
							totalScenes - 1
						: currentScene - 1) % totalScenes;
				focusInput(
					// @ts-ignore
					refs.current[sceneIndex]?.[currentSegment]?.input
				);
			} else if (event.key === "ArrowDown") {
				const sceneIndex = (currentScene + 1) % totalScenes;
				focusInput(
					// @ts-ignore
					refs.current[sceneIndex]?.[currentSegment]?.input
				);
			}
		}
	};

	return children({
		handleEnter,
		handleInput,
		handleNavigation,
		refs: refs,
	});
};

export default Editor;
