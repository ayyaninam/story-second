import { useImmerReducer } from "use-immer";
import editStoryReducer, {
	EditStoryAction,
	EditStoryDraft,
	Scene,
	Segment,
	StoryStatus,
} from "../reducers/edit-reducer";
import { StoryImageStyles } from "@/utils/enums";
import { WebstoryToStoryDraft } from "../utils/storydraft";
import { mainSchema } from "@/api/schema";
import React, { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import AutosizeInput from "react-input-autosize";

const SceneEditor = (props: {
	initialData: mainSchema["ReturnWebStoryDTO"];
}) => {
	const [story, dispatch] = useImmerReducer<EditStoryDraft, EditStoryAction>(
		editStoryReducer,
		WebstoryToStoryDraft(props.initialData)
	);
	const [currentFocus, setCurrentFocus] = useState<{
		scene: number;
		segment: number;
	}>({ scene: 0, segment: 0 });
	const refs = useRef<HTMLDivElement[][]>(
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
			refs.current[sceneIndex][segmentIndex]?.blur();
			refs.current[sceneIndex][segmentIndex + 1]?.focus();
		} else if (
			segment.textContent.length > 0 &&
			e.target.value.length === 0 &&
			scene.segments.length === 1
		) {
			dispatch({
				type: "delete_scene",
				index: sceneIndex,
			});
			refs.current[sceneIndex][segmentIndex]?.blur();
			refs.current[sceneIndex - 1][
				story.scenes[sceneIndex - 1]?.segments.length - 1
			]?.focus();
		} else if (segment.textContent.length > 0 && e.target.value.length === 0) {
			dispatch({
				type: "delete_segment",
				sceneIndex: sceneIndex,
				segmentIndex: segmentIndex,
			});
			refs.current[sceneIndex][segmentIndex]?.blur();
			refs.current[sceneIndex][segmentIndex - 1]?.focus();
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
							id: scene.segments.slice(-1)[0]?.id,
							imageKey: "",
							imageStatus: StoryStatus.READY,
							videoKey: "",
							videoStatus: StoryStatus.READY,
						},
					],
					id: scene.id,
				},

				index: sceneIndex,
			});
			refs.current[sceneIndex][segmentIndex]?.blur();
			refs.current[sceneIndex + 1][0]?.focus();
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
			refs.current[sceneIndex][segmentIndex]?.blur();
			refs.current[sceneIndex][segmentIndex + 1]?.focus();
		}
	};
	// console.log(
	// 	story.scenes.flatMap((el) => el.segments).map((el) => el.textContent)
	// );
	// useEffect(() => {
	// 	refs.current[currentFocus.scene][currentFocus.segment]?.focus();
	// 	console.log("Changed focus", currentFocus);
	// }, [currentFocus, story.scenes]);

	return (
		<div className="space-y-2">
			{story.scenes.map((scene, sceneIndex) => (
				<div key={sceneIndex} className="">
					<span className="flex flex-wrap text-sm">
						{scene.segments.map((segment, segmentIndex) => (
							<div
								key={`${segmentIndex}`}
								style={{ backgroundColor: "transparent" }}
								className=""
							>
								<AutosizeInput
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleEnter(scene, sceneIndex, segment, segmentIndex);
										}
									}}
									name={segmentIndex.toString()}
									inputClassName="active:outline-none bg-transparent focus:!bg-purple-200 hover:!bg-purple-100 rounded-md px-1 focus:outline-none"
									inputStyle={{
										outline: "none",
										backgroundColor: "inherit",
									}}
									ref={(el) => (refs.current[sceneIndex][segmentIndex] = el)}
									value={segment.textContent}
									onChange={(e) => {
										handleInput(e, scene, sceneIndex, segment, segmentIndex);
									}}
								/>
								<span> </span>
							</div>
						))}
					</span>
				</div>
			))}
		</div>
	);
};

export default SceneEditor;

// const EditableComponent = (props: { onChange: Function; value: string }) => {
// 	const ref = useRef<HTMLDivElement>(null);
// 	const [content, setContent] = useState<string>("");

// 	useEffect(() => {
// 		if (ref.current && content !== ref.current.innerHTML) {
// 			ref.current.innerHTML = content;
// 		}
// 	}, [content]);

// 	const handleInput = () => {
// 		const html = ref.current?.innerHTML || "";
// 		setContent(html);
// 	};
// 	return (
// 		<div
// 			contentEditable
// 			suppressContentEditableWarning
// 			dangerouslySetInnerHTML={{ __html: content }}
// 			ref={ref}
// 			onInput={handleInput}
// 			onBlur={handleInput}
// 			style={{
// 				height: "80px",
// 				overflow: "auto",
// 				border: "1px solid #ccc", // Added for visual clarity
// 				padding: "4px", // Added for visual clarity
// 			}}
// 		/>
// 	);
// };

/**
<div
contentEditable
//
ref={(el) => (refs.current[sceneIndex][segmentIndex] = el)}
onInput={(e) => {
  const content = e.currentTarget.textContent ?? "";
  if (
    // (No break) space or punctuation
    ([" ", ".", ",", ":", ";", "\u00A0"].includes(
      content.slice(-1)
    ) &&
      content.length > 50) ||
    content.length > 70
  ) {
    dispatch({
      type: "create_segment",
      sceneId: scene.id,
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
      segmentId: segment.id,
    });
    refs.current[sceneIndex][segmentIndex + 1]?.focus();
    setCurrentFocus({
      scene: sceneIndex,
      segment: segmentIndex + 1,
    });
  } else {
    dispatch({
      type: "edit_segment",
      sceneId: scene.id,
      segmentId: segment.id,
      segment: {
        ...segment,
        textContent: e.currentTarget.textContent ?? "",
      },
    });
  }
}}
suppressContentEditableWarning
className="active:outline-none focus:bg-purple-200 hover:bg-purple-100 rounded-md px-1 focus:outline-none"
>
{/* Setting an initial value 
{
  props?.initialData?.scenes?.[sceneIndex]?.videoSegments?.[
    segmentIndex
  ]?.textContent
}
</div> */
