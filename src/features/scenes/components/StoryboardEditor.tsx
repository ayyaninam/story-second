import { DisplayAspectRatios } from "@/utils/enums";
import { ChevronRight, LayoutList, Plus, Settings2 } from "lucide-react";
import {
  EditStoryAction,
  EditStoryDraft,
  Scene,
  StoryStatus,
  TextStatus,
} from "../reducers/edit-reducer";
import { mainSchema } from "@/api/schema";
import React, { useState } from "react";
import EditSegmentModal from "./EditSegmentModal";
import Editor from "./Editor";
import { cn } from "@/utils";
import Format from "@/utils/format";
import AutosizeInput from "react-input-autosize";
import { GetDisplayImageRatio } from "@/utils/image-ratio";
import SegmentImage from "./SegmentImage";
import CategorySelect from "@/components/ui/CategorySelect";
import { useUpdateCategory } from "../mutations/UpdateCategory";
import { useSubmitEditScenesAndSegments } from "../mutations/SaveScenesAndSegments";

export default function StoryboardEditor({
  WebstoryData,
  ImageRatio,
  isError,
  isLoading,
  story,
  dispatch,
}: {
  ImageRatio: {
    width: number;
    height: number;
    ratio: number;
    enumValue: DisplayAspectRatios;
  };
  WebstoryData?: mainSchema["ReturnVideoStoryDTO"];
  isError?: boolean;
  isLoading?: boolean;
  story: EditStoryDraft;
  dispatch: React.Dispatch<EditStoryAction>;
}) {
  const [imageRegenerationSegmentDetails, setImageRegenerationSegmentDetails] =
    useState<{
      sceneIndex: number;
      segmentIndex: number;
    } | null>(null);

  const [editSegmentsModalState, setEditSegmentsModalState] = useState<{
    open?: boolean;
    scene?: Scene;
    sceneId?: number;
    dispatch: React.Dispatch<EditStoryAction>;
    story: EditStoryDraft;
    sceneIndex?: number;
  }>();

  const SaveEdits = useSubmitEditScenesAndSegments(dispatch);

  const handleSubmitEditSegments = async () => {
    const newStory = await SaveEdits.mutateAsync({
      prevStory: WebstoryData!,
      updatedStory: story,
    });
    return newStory;
  };

  const UpdateCategory = useUpdateCategory();

  return (
    <>
      <div className="relative w-4/5 h-4/5 max-w-[1300px] m-auto overflow-hidden bg-background rounded-md shadow-lg">
        <div className="w-full flex items-center justify-between gap-1 p-1 rounded-tl-lg rounded-tr-lg bg-primary-foreground font-normal text-xs border border-purple-500 bg-purple-100 text-purple-900">
          <div className="flex items-center gap-1">
            <LayoutList className="stroke-accent-600 mr-1 h-4 w-4" />
            <p>Storyboard View</p>
          </div>
          <div className="flex gap-1 items-center">
            <p className="px-1 text-accent-900">
              Pro Tip — You can individually regenerate images in this
              Storyboard.{" "}
            </p>
          </div>
        </div>
        <div className="relative  px-6 pt-6 pb-2">
          <p className="text-2xl font-bold max-w-sm -tracking-[-0.6px]">
            {Format.Title(WebstoryData?.storyTitle)}
          </p>

          <div className="w-full inline-flex text-slate-400 text-xs py-1">
            <CategorySelect
              value={WebstoryData?.topLevelCategory!}
              onChange={(category) => UpdateCategory.mutate({ category })}
            />
            <p className="ms-1">by {WebstoryData?.user?.name}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center h-full w-full">
          <div
            className={cn(
              `w-full pb-6 bg-background  rounded-bl-lg rounded-br-lg lg:rounded-br-lg lg:rounded-bl-lg flex flex-col lg:flex-row justify-stretch h-full`
            )}
          >
            <div
              className={`px-6 flex w-full h-full flex-col-reverse justify-between md:flex-col rounded-t-lg lg:rounded-bl-lg lg:rounded-tl-lg lg:rounded-tr-none lg:rounded-br-none`}
            >
              <div className="space-y-2 h-[80%] overflow-y-scroll">
                <Editor
                  Webstory={WebstoryData!}
                  dispatch={dispatch}
                  story={story}
                >
                  {({ handleEnter, handleInput, refs }) => {
                    return (
                      <div
                        className={cn(
                          "w-full  divide-y divide-dashed space-y-2"
                        )}
                      >
                        {story.scenes.map((scene, sceneIndex) => (
                          <div
                            key={sceneIndex}
                            className="px-1 flex flex-row justify-between w-full rounded-md hover:text-primary hover:bg-primary-foreground group items-center"
                          >
                            <div
                              className={cn("gap-4 flex max-w-1/2 flex-wrap")}
                            >
                              {scene.segments.map((segment, segmentIndex) => {
                                return (
                                  <div
                                    className={cn("flex gap-1 items-center")}
                                    key={segmentIndex}
                                  >
                                    <SegmentImage
                                      segment={segment}
                                      story={story}
                                      imageRegenerationSegmentDetails={
                                        imageRegenerationSegmentDetails
                                      }
                                      setImageRegenerationSegmentDetails={
                                        setImageRegenerationSegmentDetails
                                      }
                                      dispatch={dispatch}
                                      segmentIndex={segmentIndex}
                                      sceneIndex={sceneIndex}
                                      handleSubmitEditSegments={
                                        handleSubmitEditSegments
                                      }
                                    />
                                    {segmentIndex !==
                                      scene.segments.length - 1 && (
                                      <div className="min-w-4 min-h-4">
                                        <ChevronRight
                                          width={16}
                                          height={16}
                                          className="text-slate-500 stroke-1 min-w-4 min-h-4"
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            <div className="w-[55%] min-w-[55%] flex justify-between items-center p-2 ">
                              <div className="flex flex-wrap flex-row ">
                                {scene.segments.map((segment, segmentIndex) => (
                                  <span
                                    key={segmentIndex}
                                    style={{
                                      backgroundColor: "transparent",
                                    }}
                                    className={cn(`flex flex-wrap w-full`)}
                                    onClick={() => {
                                      // handleRegenerateImage(
                                      // 	segment,
                                      // 	sceneIndex,
                                      // 	segmentIndex
                                      // );
                                    }}
                                  >
                                    <AutosizeInput
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          handleEnter(
                                            scene,
                                            sceneIndex,
                                            segment,
                                            segmentIndex
                                          );
                                        }
                                      }}
                                      name={segmentIndex.toString()}
                                      inputClassName={cn(
                                        "active:outline-none bg-transparent text-primary hover:text-slate-950 focus:text-slate-950 focus:!bg-accent-200 hover:text-slate-950 hover:!bg-accent-100 rounded-sm px-1 m-0 focus:outline-none",
                                        segment.textStatus ===
                                          TextStatus.EDITED && "text-slate-500"
                                      )}
                                      inputStyle={{
                                        outline: "none",
                                        backgroundColor: "inherit",
                                      }}
                                      // @ts-ignore
                                      ref={(el) =>
                                        (refs.current[sceneIndex]![
                                          segmentIndex
                                        ] = el)
                                      }
                                      value={segment.textContent}
                                      onChange={(e) => {
                                        handleInput(
                                          e,
                                          scene,
                                          sceneIndex,
                                          segment,
                                          segmentIndex
                                        );
                                      }}
                                    />
                                  </span>
                                ))}
                              </div>
                              <div className="flex gap-x-1 p-2">
                                <span
                                  className="hover:bg-gray-100 cursor-pointer rounded-sm p-1"
                                  onClick={() =>
                                    setEditSegmentsModalState({
                                      open: true,
                                      dispatch: dispatch,
                                      scene: scene,
                                      sceneId: sceneIndex,
                                      story: story,
                                      sceneIndex: sceneIndex,
                                    })
                                  }
                                >
                                  <Settings2 className="w-4 h-4 stroke-slate-500" />
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                </Editor>
              </div>
            </div>
          </div>
        </div>
      </div>
      {editSegmentsModalState?.scene !== undefined &&
        editSegmentsModalState?.sceneId !== undefined && (
          <EditSegmentModal
            open={
              editSegmentsModalState?.open &&
              editSegmentsModalState.scene !== undefined &&
              editSegmentsModalState.sceneId !== undefined
            }
            onClose={() => setEditSegmentsModalState(undefined)}
            scene={editSegmentsModalState?.scene!}
            sceneId={editSegmentsModalState?.sceneId}
            WebstoryData={WebstoryData!}
            dispatch={dispatch}
            story={story}
            onSceneEdit={(scene, index) => {
              dispatch({
                type: "edit_scene",
                scene: scene,
                index: index,
              });
            }}
            sceneIndex={editSegmentsModalState?.sceneIndex!}
            handleSubmitEditSegments={handleSubmitEditSegments}
          />
        )}
    </>
  );
}
