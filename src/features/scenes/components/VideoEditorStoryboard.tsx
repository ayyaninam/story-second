import { AspectRatios, InputStatus, SegmentModifications } from "@/utils/enums";
import { Film, HelpCircle, Video } from "lucide-react";
import { ModeToggle } from "@/features/edit-story/components/mode-toggle";
import { Badge } from "@/components/ui/badge";

import { useImmerReducer } from "use-immer";
import editStoryReducer, {
	EditStoryAction,
	EditStoryDraft,
	Scene,
	Segment,
	StoryStatus,
} from "../reducers/edit-reducer";
import { GenerateStoryDiff, WebstoryToStoryDraft } from "../utils/storydraft";
import { mainSchema } from "@/api/schema";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api";
import EditSegmentModal from "./EditSegmentModal";
import { SegmentModificationData } from "@/types";
import { QueryKeys } from "@/lib/queryKeys";
import { useRouter } from "next/router";
import { VideoPlayerHandler } from "@/features/edit-story/components/video-player";
import ScriptEditorView from "./ScriptEditorView";
// import StoryboardView from "./StoryboardViewTypesComponent";
import StoryboardView from "./StoryboardView";

const MAX_SUMMARY_LENGTH = 251;

export default function VideoEditorStoryboard({
	WebstoryData,
	ImageRatio,
	isError,
	isLoading,
}: {
	ImageRatio: {
		width: number;
		height: number;
		ratio: number;
		enumValue: AspectRatios;
	};
	WebstoryData?: mainSchema["ReturnVideoStoryDTO"];
	isError?: boolean;
	isLoading?: boolean;
}) {
	const router = useRouter();
	const videoPlayerRef = useRef<VideoPlayerHandler | null>(null);
	const queryClient = useQueryClient();
	const [showFullDescription, setShowFullDescription] = useState(false);
	const [isPlaying, setIsPlaying] = useState<boolean | undefined>();
	const [seekedFrame, setSeekedFrame] = useState<number | undefined>();

	const [editSegmentsModalState, setEditSegmentsModalState] = useState<{
		open?: boolean;
		scene?: Scene;
		sceneId?: number;
		dispatch?: React.Dispatch<EditStoryAction>;
		story?: EditStoryDraft;
	}>();

	const [previousStory, setPreviousStory] = useState<EditStoryDraft>(
		WebstoryToStoryDraft(WebstoryData!)
	);
	const [story, dispatch] = useImmerReducer<EditStoryDraft, EditStoryAction>(
		editStoryReducer,
		WebstoryToStoryDraft(WebstoryData!)
	);

	useEffect(() => {
		dispatch({ type: "reset", draft: WebstoryToStoryDraft(WebstoryData!) });
	}, [WebstoryData]);

	const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);

	const diff = GenerateStoryDiff(previousStory, story);
	const numEdits =
		diff.additions.length + diff.subtractions.length + diff.edits.length;
	const EditScene = useMutation({
		mutationFn: api.video.editScene,
	});
	const EditSegment = useMutation({
		mutationFn: api.video.editSegment,
	});
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

	const handleSubmitEditSegments = async () => {
		const diff = GenerateStoryDiff(previousStory, story);
		const edits: SegmentModificationData[] = diff.edits.map((segment) => ({
			details: { Ind: segment.id, Text: segment.textContent },
			operation: SegmentModifications.Edit,
		}));
		const additions: SegmentModificationData[] = diff.additions.map(
			(segment) => ({
				details: {
					Ind: segment.id,
					segments: [{ Text: segment.textContent, SceneId: segment.sceneId }],
				},
				operation: SegmentModifications.Add,
			})
		);
		const deletions: SegmentModificationData[] = diff.subtractions.map(
			(segment) => ({
				details: {
					Ind: segment.id,
				},
				operation: SegmentModifications.Delete,
			})
		);

		const editedResponse = await EditSegment.mutateAsync({
			story_id: WebstoryData?.id as string,
			story_type: WebstoryData?.storyType,
			edits: [...edits, ...additions, ...deletions],
		});
		queryClient.invalidateQueries({ queryKey: [QueryKeys.STORY] });

		const newStory = await api.video.get(
			WebstoryData?.topLevelCategory!,
			WebstoryData?.slug!,
			WebstoryData?.storyType!
		);

		setPreviousStory(WebstoryToStoryDraft(newStory));
		dispatch({ type: "reset", draft: WebstoryToStoryDraft(newStory) });
	};

	const refs = useRef<HTMLInputElement[][]>(
		// Putting an absurdly high number of arrays to make things simpler
		Array.from({ length: 40 ?? 0 }, () => [])
	);

	const handleInput = (
		e: React.ChangeEvent<HTMLInputElement>,
		scene: Scene,
		sceneIndex: number,
		segment: Segment,
		segmentIndex: number
	) => {
		const content = e.target.value ?? "";
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
				},
				segmentIndex: segmentIndex,
			});
			refs.current[sceneIndex]?.[segmentIndex]?.blur();
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
			refs.current[sceneIndex]?.[segmentIndex]?.blur();
			refs.current[sceneIndex - 1]?.[
				story?.scenes[sceneIndex - 1]?.segments?.length ?? 0 - 1
			]?.focus();
		} else if (segment.textContent.length > 0 && e.target.value.length === 0) {
			dispatch({
				type: "delete_segment",
				sceneIndex: sceneIndex,
				segmentIndex: segmentIndex,
			});
			refs.current[sceneIndex]?.[segmentIndex]?.blur();
			refs.current[sceneIndex]?.[segmentIndex - 1]?.focus();
		} else {
			dispatch({
				type: "edit_segment",
				sceneIndex: sceneIndex,
				segmentIndex: segmentIndex,
				segment: {
					...segment,
					textContent: e.target.value ?? "",
				},
			});
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
						},
					],
					status: StoryStatus.READY,
					id: scene.id,
				},

				index: sceneIndex,
			});
			refs.current[sceneIndex]?.[segmentIndex]?.blur();
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
				},
				segmentIndex: segmentIndex,
			});
			refs.current[sceneIndex]?.[segmentIndex]?.blur();
			refs.current[sceneIndex]?.[segmentIndex + 1]?.focus();
		}
	};

	useEffect(() => {
		if (selectedSegment) {
			console.log();
			videoPlayerRef.current?.seekToSegment(selectedSegment);
		}
	}, [selectedSegment]);

	return (
		<div className="relative rounded-lg border-[1px] w-full h-fit justify-center border-border bg-border bg-blend-luminosity px-2 lg:px-5 py-2">
			{editSegmentsModalState?.scene && editSegmentsModalState?.sceneId && (
				<EditSegmentModal
					open={
						editSegmentsModalState?.open &&
						editSegmentsModalState.scene !== undefined &&
						editSegmentsModalState.sceneId !== undefined
					}
					onClose={() => setEditSegmentsModalState({})}
					scene={editSegmentsModalState?.scene!}
					sceneId={editSegmentsModalState?.sceneId}
					dispatch={dispatch}
					story={story}
					onSceneEdit={(scene, index) => {
						dispatch({
							type: "edit_scene",
							scene: scene,
							index: index,
						});
					}}
				/>
			)}
			<div className="flex justify-center m-10">
				<Badge
					variant="outline"
					className={`bg-primary-foreground font-normal text-sm`}
				>
					<Film className="stroke-purple-600 mr-1 h-4 w-4" />
					Generate & Edit Your Scenes
				</Badge>
			</div>
			<StoryboardView
				refs={refs}
				dispatch={dispatch}
				getSegmentStatus={getSegmentStatus}
				handleEnter={handleEnter}
				handleInput={handleInput}
				setEditSegmentsModalState={setEditSegmentsModalState}
				setPreviousStory={setPreviousStory}
				story={story}
				WebstoryData={WebstoryData}
			/>
			<ScriptEditorView
				WebstoryData={WebstoryData}
				refs={refs}
				dispatch={dispatch}
				getSegmentStatus={getSegmentStatus}
				handleEnter={handleEnter}
				handleInput={handleInput}
				setEditSegmentsModalState={setEditSegmentsModalState}
				setPreviousStory={setPreviousStory}
				story={story}
			/>
			<div className="flex justify-center m-10">
				<Badge
					variant="outline"
					className={`bg-primary-foreground font-normal text-sm`}
				>
					<Video className="stroke-purple-600 mr-1 h-4 w-4" />
					View The Final Cut
				</Badge>
			</div>
			<div className="absolute bottom-4 right-4 flex flex-col gap-y-3">
				<span
					className="rounded-full w-8 h-8 bg-popover p-1.5 flex items-center justify-center"
					style={{ boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.13)" }}
				>
					<ModeToggle />
				</span>

				<span
					className="rounded-full w-8 h-8 bg-popover p-1.5"
					style={{ boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.13)" }}
				>
					<HelpCircle className="h-[18.286px] w-[18.286px] flex-shrink-0 stroke-slate-400" />
				</span>
			</div>
			<div className="absolute w-[1px] h-full bg-purple-600 bottom-[1px] left-1/2 transform -translate-x-1/2 flex flex-row z-[-1]" />
		</div>
	);
}
