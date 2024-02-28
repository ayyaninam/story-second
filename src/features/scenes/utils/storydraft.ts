import { mainSchema } from "@/api/schema";
import {
	EditStoryDraft,
	Scene,
	Segment,
	StoryStatus,
	TextStatus,
} from "../reducers/edit-reducer";
import React from "react";
import { nanoid } from "nanoid";
import { AspectRatios, StoryImageStyles, VoiceType } from "@/utils/enums";

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
		type: Webstory.storyType,
		settings: {
			// @ts-expect-error types not working
			voice: VoiceType.GenericFemale,
			style: StoryImageStyles.Realistic,
		},
		slug: Webstory.slug!,
		topLevelCategory: Webstory.topLevelCategory!,
		// @ts-ignore
		displayResolution: Webstory.resolution,
		resolution:
			Webstory.scenes?.[0]?.videoSegments?.[0]?.imageResolution ??
			AspectRatios["576x1024"],
		scenes:
			Webstory.scenes?.map((scene) => ({
				id: scene.id!,
				index: scene.index!,
				segments:
					scene.videoSegments?.map((segment) => {
						let imageStatus = StoryStatus.READY;
						if (segment.imageKey && !segment.imageRegenerating)
							imageStatus = StoryStatus.COMPLETE;
						else if (segment.imageRegenerating)
							imageStatus = StoryStatus.PENDING;
						else if (!segment.imageKey) imageStatus = StoryStatus.READY;

						let videoStatus = StoryStatus.READY;
						if (segment.videoKey && !segment.videoRegenerating)
							videoStatus = StoryStatus.COMPLETE;
						else if (segment.videoRegenerating)
							videoStatus = StoryStatus.PENDING;
						else if (!segment.videoKey) videoStatus = StoryStatus.READY;
						return {
							settings: {
								prompt: segment.imagePrompt!,
								denoising: segment.imageCFGScale ?? 2,
								style: segment.imageStyle!,
								seed: segment.imageSeed!,
								samplingSteps: segment.imageSamplingSteps ?? 8,
							},
							audioKey: segment.femaleAudioKey!,
							audioStatus: segment.femaleAudioKey
								? StoryStatus.COMPLETE
								: StoryStatus.PENDING,
							id: segment.index!,
							imageKey: segment.imageKey!,
							imageStatus,
							textContent: segment.textContent!,
							textStatus: TextStatus.UNEDITED,
							videoKey: segment.videoKey!,
							videoStatus,
						};
					}) ?? [],
				status: scene.videoSegments?.every(
					(el) => el.videoKey && !el.videoRegenerating && el.imageKey
				)
					? StoryStatus.COMPLETE
					: StoryStatus.PENDING,
				description: scene.sceneDescription!,
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

type StoryDiff = {
	edits: SegmentWithIndices[];
	additions: SegmentWithIndices[][];
	subtractions: SegmentWithIndices[];
};

export const GenerateStoryDiff = (
	previous: EditStoryDraft,
	current: EditStoryDraft
) => {
	let edits: SegmentWithIndices[] = [];
	let additions: SegmentWithIndices[][] = [];
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
			const currentSegments = currentMap
				.get(el)
				?.filter((seg) => seg.textContent.trim().length > 0)!;
			if (
				currentSegments[0] &&
				initialSegments[0]?.textContent !== currentSegments[0]?.textContent
			) {
				edits.push(currentSegments[0]); // if initial value is not equal the new value, then it's an edit
			}
			if (currentSegments.length > 1) {
				additions.push(currentSegments.slice(1)); // any additional segments with the same ids are considered additions
			}
		} else if (!previousMap.has(el) && currentMap.has(el)) {
			// @ts-expect-error Not detecting that currentMap<el> is defined
			additions.push(currentMap.get(el)); // if the id is not in the initial data, then it's an addition
		} else if (!currentMap.has(el)) {
			subtractions.push(...(previousMap.get(el) ?? [])); // if the id is not in the current data, then it's a subtraction
		}
	});

	return { edits, additions, subtractions };
};

export const GenerateSceneDiff = (
	previous: EditStoryDraft,
	current: EditStoryDraft
) => {
	let additions: Scene[][] = [];
	let edits: Scene[] = [];
	let subtractions: Scene[] = [];
	const previousMap = new Map<string, Scene[]>();
	const currentMap = new Map<string, Scene[]>();

	previous.scenes.forEach((el) => {
		if (previousMap.has(el.id)) {
			previousMap.get(el.id)?.push(el);
		} else {
			previousMap.set(el.id, [el]);
		}
	});

	current.scenes.forEach((el) => {
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
			const initialScene = previousMap.get(el)?.[0];
			const newScenes = currentMap.get(el);
			if (newScenes?.length && newScenes.length) {
				const firstNewScene = newScenes[0]!;
				if (initialScene?.description !== firstNewScene?.description)
					edits.push(firstNewScene);
				if (newScenes?.length > 1) additions.push(newScenes?.slice(1));
			}
		} else if (previousMap.has(el) && !currentMap.has(el)) {
			const initialScene = previousMap.get(el)?.[0];
			if (initialScene) subtractions.push(initialScene);
		}
	});
	return { edits, subtractions, additions };
};

export function recursivelyUpdateOverlappingKeys<T extends object>(
	oldObject: T,
	newObject: Partial<T>
): T {
	Object.keys(newObject).forEach((key) => {
		const newKeyValue = newObject[key as keyof typeof newObject];
		if (key in oldObject) {
			if (
				Array.isArray(oldObject[key as keyof T]) &&
				Array.isArray(newKeyValue)
			) {
				oldObject[key as keyof T] = updateArray(
					oldObject[key as keyof T] as unknown as any[],
					newKeyValue as unknown as any[]
				) as unknown as T[keyof T];
			} else if (
				typeof oldObject[key as keyof T] === "object" &&
				typeof newKeyValue === "object" &&
				oldObject[key as keyof T] !== null &&
				newKeyValue !== null
			) {
				oldObject[key as keyof T] = recursivelyUpdateOverlappingKeys(
					oldObject[key as keyof T] as unknown as object,
					newKeyValue as unknown as Partial<object>
				) as T[keyof T];
			} else {
				oldObject[key as keyof T] = newKeyValue as T[keyof T];
			}
		} else {
			oldObject[key as keyof T] = newKeyValue as T[keyof T];
		}
	});

	return oldObject;
}

export function updateArray(oldArray: any[], newArray: any[]): any[] {
	// Trim or expand the oldArray to match the length of newArray
	oldArray.length = newArray.length;
	for (let i = 0; i < newArray.length; i++) {
		if (
			typeof oldArray[i] === "object" &&
			typeof newArray[i] === "object" &&
			oldArray[i] !== null &&
			newArray[i] !== null
		) {
			// Recursively update objects within arrays
			oldArray[i] = recursivelyUpdateOverlappingKeys(oldArray[i], newArray[i]);
		} else {
			// Directly update with new value
			oldArray[i] = newArray[i];
		}
	}
	return oldArray;
}
