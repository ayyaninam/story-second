import React, { useState } from "react";
import { Check, RefreshCw, Settings2 } from "lucide-react";
import EditSegmentModalItem from "./EditSegmentModalItem";
import { Button } from "@/components/ui/button";
import {
  EditStoryAction,
  EditStoryDraft,
  Scene,
  Settings,
} from "../reducers/edit-reducer";
import api from "@/api";
import useWebstoryContext from "@/features/edit-story/providers/WebstoryContext";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { getImageCost } from "@/utils/credit-cost";
import Format from "@/utils/format";
import { useMutation } from "@tanstack/react-query";
import { useSubmitEditScenesAndSegments } from "../mutations/SaveScenesAndSegments";
import { mainSchema } from "@/api/schema";
import { cn } from "@/utils";
import { StoryImageStyles } from "@/utils/enums";

const EditSegmentModal = ({
  open,
  onClose,
  scene,
  sceneId,
  onSceneEdit,
  sceneIndex,
  dispatch,
  story,
  handleSubmitEditSegments,
  WebstoryData,
}: {
  open?: boolean;
  onClose: () => void;
  scene?: Scene;
  sceneId?: number;
  onSceneEdit: (scene: Scene, index: number) => void;
  dispatch: React.Dispatch<EditStoryAction>;
  story: EditStoryDraft;
  sceneIndex: number;
  handleSubmitEditSegments: () => void;
  WebstoryData: mainSchema["ReturnVideoStoryDTO"];
}) => {
  const [webstory] = useWebstoryContext();
  const [regeratingImages, setRegeneratingImages] = useState(
    Array(scene?.segments?.length).fill(false)
  );
  const [imageRegenerationSegmentDetails, setImageRegenerationSegmentDetails] =
    useState<{
      sceneIndex: number;
      segmentIndex: number;
      segmentSettings?: Settings;
    } | null>(null);

  const SaveEdits = useSubmitEditScenesAndSegments(dispatch);
  const RegenerateSceneImages = useMutation({
    mutationFn: async (scene: Scene) => {
      if (!scene) return;

      const newStory = await SaveEdits.mutateAsync({
        prevStory: WebstoryData,
        updatedStory: story,
      });

      const regeneratedImages = await api.video.regenerateAllImages({
        // @ts-expect-error
        image_style: scene.settings?.style ?? StoryImageStyles.Realistic,
        story_id: story.id,
        story_type: story.type,
        scene_id: scene.id,
      });
    },
  });

  if (scene && sceneId !== undefined) {
    return (
      <Dialog
        open={open}
        modal
        onOpenChange={(open) => {
          !open && onClose();
        }}
      >
        <DialogContent className="max-w-[1100px] w-2/3 bg-background">
          <DialogTitle className="m-0 font-semibold text-foreground px-3 text-md">
            <div className="flex gap-2 items-center">
              <Settings2 width={16} height={16} />
              <p>Edit Segments</p>
            </div>
          </DialogTitle>
          <DialogDescription className="mt-3 px-3 text-muted-foreground text-sm font-thin">
            Individually edit & regenerate the segments of each scene. For more
            control, used the advanced editing options. When you’re ready to see
            it, click regenerate.
          </DialogDescription>
          <div className="overflow-auto max-h-[70vh] px-3">
            {story.scenes[sceneId]?.segments?.map((segment, index) => (
              <EditSegmentModalItem
                key={index}
                story={story}
                segment={segment}
                dispatch={dispatch}
                onSegmentEdit={(updatedSegment) => {
                  dispatch({
                    type: "edit_segment",
                    sceneIndex: sceneId,
                    segmentIndex: index,
                    segment: updatedSegment,
                  });
                }}
                segmentIndex={index}
                imageRegenerationSegmentDetails={
                  imageRegenerationSegmentDetails
                }
                setImageRegenerationSegmentDetails={
                  setImageRegenerationSegmentDetails
                }
                sceneIndex={sceneIndex}
                handleSubmitEditSegments={handleSubmitEditSegments}
              />
            ))}
          </div>
          <div className="flex mt-2 gap-1 mx-4 justify-end text-sm">
            <Button
              className="w-[50%] p-2 flex gap-1 text-accent-600 items-center"
              variant="outline"
              disabled={RegenerateSceneImages.isPending}
              onClick={() =>
                RegenerateSceneImages.mutateAsync(story.scenes?.[sceneId]!)
              }
            >
              <RefreshCw
                width={16}
                height={16}
                className={cn(
                  RegenerateSceneImages.isPending && "animate-spin"
                )}
                style={{ animationDirection: "reverse" }}
              />
              {RegenerateSceneImages.isPending ? (
                <p className="text-sm text-foreground font-semibold">
                  Regenerating Images
                </p>
              ) : (
                <>
                  <p className="text-sm text-foreground font-semibold">
                    Regenerate All Images
                  </p>
                  <p className="text-sm">{`(${getImageCost(scene.segments.length)} ${Format.Pluralize("Credit", getImageCost(scene.segments.length))})`}</p>
                </>
              )}
            </Button>
            <DialogClose asChild>
              <Button
                className="w-[50%] p-2 flex gap-1 items-center text-white bg-accent-600"
                variant="default"
              >
                <Check width={16} height={16} />
                <p className="text-sm font-semibold">Done</p>
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
};

export default EditSegmentModal;
