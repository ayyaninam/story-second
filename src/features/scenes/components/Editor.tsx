/**
 * Editor Component
 *
 * This component provides functionality for editing scenes and segments of a story.
 * It allows users to input and edit text content, create, edit, and delete segments and scenes,
 * and navigate through the segments and scenes using keyboard shortcuts.
 *
 * Props:
 * - Webstory: The mainSchema ReturnVideoStoryDTO object representing the story fetched from the API.
 * - story: The EditStoryDraft object representing the current state of the story being edited.
 * - dispatch: React.Dispatch<EditStoryAction> function to dispatch edit actions.
 * - onInputChange: Function to handle input change event.
 * - onCreateSegment: Function to handle creation of a new segment.
 * - onEditSegment: Function to handle editing of a segment.
 * - onDeleteSegment: Function to handle deletion of a segment.
 * - onCreateScene: Function to handle creation of a new scene.
 * - onEditScene: Function to handle editing of a scene.
 * - onDeleteScene: Function to handle deletion of a scene.
 * - children: Function that returns JSX for rendering children components.
 *
 * Use:
 * <Editor {...props}>
 * 	{({
 * 		handleEnter,
 * 		handleInput,
 * 		handleNavigation,
 * 		handleDelete,
 * 		refs
 * 	}) => {
 * 		return (
 * 			// The components you want to render inside the Editor Wrapper
 * 		)
 * 	}}
 * </Editor>
 *
 */

import {
	EditStoryAction,
	EditStoryDraft,
	Scene,
	Segment,
	StoryStatus,
	TextStatus,
} from "../reducers/edit-reducer";
import React, { useEffect, useRef } from "react";
import { mainSchema } from "@/api/schema";
import { GenerateStoryDiff, WebstoryToStoryDraft } from "../utils/storydraft";
import {
	MAX_SEGMENT_LENGTH,
	MAX_SEGMENT_LENGTH_BOOK,
	MAX_SEGMENT_WORD_LENGTH,
	MAX_SEGMENT_WORD_LENGTH_BOOK,
} from "@/constants/constants";
import { useSubmitEditScenesAndSegments } from "../mutations/SaveScenesAndSegments";
import toast from "react-hot-toast";
import { StoryOutputTypes } from "@/utils/enums";

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
		e: React.ChangeEvent<HTMLTextAreaElement>,
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
		refs: React.MutableRefObject<(HTMLTextAreaElement | null)[][]>;
		handleNavigation: ({
			event,
			totalScenes,
			totalSegments,
			currentScene,
			currentSegment,
			segmentContentLength,
		}: {
			event: React.KeyboardEvent<HTMLTextAreaElement>;
			totalScenes: number;
			totalSegments: number;
			currentScene: number;
			currentSegment: number;
			segmentContentLength: number;
		}) => void;
		handleDelete: ({
			event,
			totalScenes,
			currentScene,
			currentSegment,
		}: {
			event: React.KeyboardEvent<HTMLTextAreaElement>;
			totalScenes: number;
			currentScene: number;
			currentSegment: number;
		}) => void;
		handleEnter: (
			scene: Scene,
			sceneIndex: number,
			segment: Segment,
			segmentIndex: number
		) => void;
		handleFocus: (sceneIndex: number, segmentIndex: number) => void;
		handleInput: (
			e: React.ChangeEvent<HTMLTextAreaElement>,
			scene: Scene,
			sceneIndex: number,
			segment: Segment,
			segmentIndex: number
		) => void;
	}) => React.ReactNode;
}) => {
	const refs = useRef<HTMLTextAreaElement[][]>(
		// Putting an absurdly high number of scenes to make things simpler
		Array.from({ length: 100 }, () => [])
	);
	const currentSceneIndex = useRef<number>(0);
	const currentSegmentIndex = useRef<number>(-1);

	const diff = GenerateStoryDiff(WebstoryToStoryDraft(Webstory), story);

	const MAX_LENGTH =
		story.type === StoryOutputTypes.Story
			? MAX_SEGMENT_LENGTH_BOOK
			: MAX_SEGMENT_LENGTH;

	const MAX_WORD_LENGTH =
		story.type === StoryOutputTypes.Story
			? MAX_SEGMENT_WORD_LENGTH_BOOK
			: MAX_SEGMENT_WORD_LENGTH;

	const SaveEdits = useSubmitEditScenesAndSegments(dispatch);

	useEffect(() => {
		const handleKeyDown = async (event: KeyboardEvent) => {
			if (event.key === "ArrowDown" || event.key === "ArrowUp") {
				event.preventDefault();
				if (event.key === "ArrowDown") {
					if (
						refs?.current?.[currentSceneIndex?.current]?.[
							currentSegmentIndex.current + 1
						]
					) {
						currentSegmentIndex.current++;
					} else if (refs.current[currentSceneIndex.current + 1]?.length) {
						currentSceneIndex.current++;
						currentSegmentIndex.current = 0;
					}
				} else if (event.key === "ArrowUp") {
					if (
						refs?.current?.[currentSceneIndex?.current]?.[
							currentSegmentIndex.current - 1
						]
					) {
						currentSegmentIndex.current--;
					} else if (refs.current[currentSceneIndex.current - 1]) {
						currentSceneIndex.current--;
						currentSegmentIndex.current =
							(refs?.current?.[currentSceneIndex?.current]?.length ?? 0) - 1;
					}
				}
				refs?.current?.[currentSceneIndex?.current]?.[
					currentSegmentIndex?.current
				]?.focus();
			}
			if ((event.ctrlKey || event.metaKey) && event.key === "s") {
				// Prevent default browser behavior (saving the page)
				event.preventDefault();
				if (!SaveEdits.isPending)
					await toast.promise(
						SaveEdits.mutateAsync({
							prevStory: Webstory,
							updatedStory: story,
						}),
						{
							error: "Error saving your changes",
							loading: "Saving...",
							success: "Changes saved!",
						},
						{
							style: {
								minWidth: "250px",
								marginLeft: "250px", //Equal to the width of the sidebar
							},
						}
					);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	});

	const handleFocus = (sceneIndex: number, segmentIndex: number) => {
		currentSceneIndex.current = sceneIndex;
		currentSegmentIndex.current = segmentIndex;
	};

	const handleInput = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
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
				content.length > MAX_WORD_LENGTH) ||
			content.length > MAX_LENGTH
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
	let timeout: any;
	const handleEnter = (
		scene: Scene,
		sceneIndex: number,
		segment: Segment,
		segmentIndex: number
	) => {
		if (timeout) {
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
					index: scene.index,
				},

				index: sceneIndex,
			});
			setTimeout(() => {
				refs.current[sceneIndex + 1]?.[0]?.focus();
			}, 0);
			clearTimeout(timeout);
			// timeout = null;
		} else {
			timeout = setTimeout(() => {
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
				timeout = null;
				setTimeout(() => {
					refs.current[sceneIndex]?.[segmentIndex + 1]?.focus();
				}, 0);
			}, 300);
		}
	};

	const focusInput = (autoSizeInput?: HTMLTextAreaElement, atStart = false) => {
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
		event: React.KeyboardEvent<HTMLTextAreaElement>;
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

	const handleDelete = ({
		event,
		totalScenes,
		currentScene,
		currentSegment,
	}: {
		event: React.KeyboardEvent<HTMLTextAreaElement>;
		totalScenes: number;
		currentScene: number;
		currentSegment: number;
	}) => {
		if (
			event.key === "Backspace" &&
			event.currentTarget.selectionStart !== null &&
			event.currentTarget.selectionStart === 0
		) {
			const sceneIndex = currentScene;
			const segmentIndex = currentSegment;
			if (segmentIndex === 0 && sceneIndex === 0) {
				return;
			}
			const nextSceneIndex =
				currentSegment === 0 ? (currentScene - 1) % totalScenes : currentScene;
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
	};

	return children({
		handleEnter,
		handleInput,
		handleNavigation,
		handleDelete,
		handleFocus,
		refs: refs,
	});
};

export default Editor;
