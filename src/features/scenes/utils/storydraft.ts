import { mainSchema } from "@/api/schema";
import {
	EditStoryDraft,
	Segment,
	StoryStatus,
	TextStatus,
} from "../reducers/edit-reducer";
import React from "react";
import { nanoid } from "nanoid";
import { AspectRatios } from "@/utils/enums";

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
								denoising: segment.imageCFGScale!,
								style: segment.imageStyle!,
								seed: segment.imageSeed!,
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
