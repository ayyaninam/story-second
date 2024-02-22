import { mainSchema } from "@/api/schema";
import { EditStoryDraft, Segment, StoryStatus } from "../reducers/edit-reducer";
import React from "react";
import { nanoid } from "nanoid";

// samplingSteps?: number; // 2-10
// 	denoising?: number; // 0-1,
// 	prompt?: string;
// 	style?: StoryImageStyles;
// 	voice?: string;

export const WebstoryToStoryDraft = (
	Webstory: mainSchema["ReturnWebStoryDTO"]
): EditStoryDraft => {
	return {
		id: Webstory.id!,
		scenes:
			Webstory.scenes?.map((scene) => ({
				id: scene.id!,
				segments:
					scene.videoSegments?.map((segment) => {
						return {
							audioKey: segment.femaleAudioKey!,
							audioStatus: segment.femaleAudioKey
								? StoryStatus.COMPLETE
								: StoryStatus.PENDING,
							id: segment.index!,
							imageKey: segment.imageKey!,
							imageStatus: segment.imageKey
								? StoryStatus.COMPLETE
								: StoryStatus.PENDING,
							textContent: segment.textContent!,
							videoKey: segment.videoKey!,
							videoStatus: segment.videoKey
								? StoryStatus.COMPLETE
								: StoryStatus.PENDING,
						};
					}) ?? [],
				status: scene.videoSegments?.every((el) => el.videoKey && el.imageKey)
					? StoryStatus.COMPLETE
					: StoryStatus.PENDING,
			})) ?? [],
		status: StoryStatus.COMPLETE,
		title: Webstory.storyTitle!,
	};
};

type SegmentWithIndices = Segment & {
	sceneIndex: number;
	segmentIndex: number;
	sceneId: string;
};

export const GenerateStoryDiff = (
	previous: EditStoryDraft,
	current: EditStoryDraft
) => {
	let edits: SegmentWithIndices[] = [];
	let additions: SegmentWithIndices[] = [];
	let subtractions: SegmentWithIndices[] = [];

	//
	const previousMap = new Map<number, SegmentWithIndices[]>();
	const currentMap = new Map<number, SegmentWithIndices[]>();

	// separate previous and current indexes into sets
	const previousSegments = previous.scenes.flatMap((scene, sceneIndex) =>
		scene.segments.map((segment, segmentIndex) => ({
			...segment,
			sceneIndex,
			segmentIndex,
			sceneId: scene.id,
		}))
	);
	const currentSegments = current.scenes.flatMap((scene, sceneIndex) =>
		scene.segments.map((segment, segmentIndex) => ({
			...segment,
			sceneIndex,
			segmentIndex,
			sceneId: scene.id,
		}))
	);

	previousSegments.forEach((el) => {
		if (previousMap.has(el.id)) {
			previousMap.get(el.id)?.push(el);
		} else {
			previousMap.set(el.id, [el]);
		}
	});
	currentSegments.forEach((el) => {
		if (currentMap.has(el.id)) {
			currentMap.get(el.id)?.push(el);
		} else {
			currentMap.set(el.id, [el]);
		}
	});
	const mapArray = Array.from(
		new Set([...previousMap.keys(), ...currentMap.keys()])
	);

	mapArray.forEach((el) => {
		if (previousMap.has(el) && currentMap.has(el)) {
			const initialSegments = previousMap.get(el)!;
			const currentSegments = currentMap.get(el)!;

			if (
				currentSegments[0] &&
				initialSegments[0]?.textContent !== currentSegments[0]?.textContent
			) {
				edits.push(currentSegments[0]); // if initial value is not equal the new value, then it's an edit
			}
			if (currentSegments.length > 1) {
				additions.push(...currentSegments.slice(1)); // any additional segments with the same ids are considered additions
			}
		} else if (!previousMap.has(el)) {
			additions.push(...(currentMap.get(el) ?? [])); // if the id is not in the initial data, then it's an addition
		} else if (!currentMap.has(el)) {
			subtractions.push(...(previousMap.get(el) ?? [])); // if the id is not in the current data, then it's a subtraction
		}
	});

	return { edits, additions, subtractions };
};

// const getDiff = (initialData: Data[], currentData: Data[]) => {
// 	let edits: Data[] = [];
// 	let additions: Data[] = [];
// 	let subtractions: Data[] = [];

// 	// Grouping segments by id while maintaining order
// 	const initialDataMap = new Map<number, Data[]>();
// 	const currentDataMap = new Map<number, Data[]>();

// 	initialData.forEach((el) => {
// 		if (initialDataMap.has(el.id)) {
// 			initialDataMap.get(el.id)?.push(el);
// 		} else {
// 			initialDataMap.set(el.id, [el]);
// 		}
// 	});

// 	currentData.forEach((el) => {
// 		if (currentDataMap.has(el.id)) {
// 			currentDataMap.get(el.id)?.push(el);
// 		} else {
// 			currentDataMap.set(el.id, [el]);
// 		}
// 	});

// 	Array.from(
// 		new Set([...initialDataMap.keys(), ...currentDataMap.keys()])
// 	).forEach((el) => {
// 		if (initialDataMap.has(el) && currentDataMap.has(el)) {
// 			const initialSegments = initialDataMap.get(el)!;
// 			const currentSegments = currentDataMap.get(el)!;

// 			if (
// 				currentSegments[0] &&
// 				initialSegments[0]?.value !== currentSegments[0]?.value
// 			) {
// 				edits.push(currentSegments[0]); // if initial value is not equal the new value, then it's an edit
// 			}
// 			if (currentSegments.length > 1) {
// 				additions.push(...currentSegments.slice(1)); // any additional segments with the same ids are considered additions
// 			}
// 		} else if (!initialDataMap.has(el)) {
// 			additions.push(...currentDataMap.get(el)); // if the id is not in the initial data, then it's an addition
// 		} else if (!currentDataMap.has(el)) {
// 			subtractions.push(...initialDataMap.get(el)); // if the id is not in the current data, then it's a subtraction
// 		}
// 	});

// 	return { edits, additions, subtractions };
// };
