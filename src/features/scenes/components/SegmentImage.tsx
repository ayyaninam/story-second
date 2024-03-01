import Format from "@/utils/format";
import Image from "next/image";
import React, { useRef } from "react";
import {
  EditStoryAction,
  EditStoryDraft,
  Segment,
  Settings,
  StoryStatus,
} from "../reducers/edit-reducer";
import { GetDisplayImageRatio } from "@/utils/image-ratio";
import ImageRegenerationPopoverHOC from "./ImageRegenerationPopoverHOC";
import ImageRegenerationLoader from "./ImageRegenerationLoader";
import { Plus } from "lucide-react";
import { cn } from "@/utils";
import { DisplayAspectRatios } from "@/utils/enums";

function SegmentImage({
  segment,
  story,
  imageRegenerationSegmentDetails,
  setImageRegenerationSegmentDetails,
  dispatch,
  segmentIndex,
  sceneIndex,
  handleSubmitEditSegments,
}: {
  segment: Segment;
  story: EditStoryDraft;
  dispatch: React.Dispatch<EditStoryAction>;
  segmentIndex: number;
  sceneIndex: number;
  imageRegenerationSegmentDetails: {
    sceneIndex: number;
    segmentIndex: number;
    segmentSettings?: Settings;
    disabledHover?: boolean;
  } | null;
  setImageRegenerationSegmentDetails: React.Dispatch<
    React.SetStateAction<{
      sceneIndex: number;
      segmentIndex: number;
      segmentSettings?: Settings;
      disabledHover?: boolean;
    } | null>
  >;
  handleSubmitEditSegments: () => void;
}) {
  const imageAspectRatio = GetDisplayImageRatio(story.displayResolution).ratio;
  const isPopupOpen =
    imageRegenerationSegmentDetails?.segmentIndex === segmentIndex &&
    imageRegenerationSegmentDetails?.sceneIndex === sceneIndex;
  const showPopupTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hidePopupTimerRef = useRef<NodeJS.Timeout | null>(null);
  return (
    <ImageRegenerationPopoverHOC
      segment={segment}
      story={story}
      open={isPopupOpen}
      onClose={() => {
        setImageRegenerationSegmentDetails((prevSegmentDetails) => {
          if (
            prevSegmentDetails?.segmentIndex === segmentIndex &&
            prevSegmentDetails?.sceneIndex === sceneIndex
          ) {
            return null;
          }
          return prevSegmentDetails;
        });
      }}
      dispatch={dispatch}
      segmentIndex={segmentIndex}
      sceneIndex={sceneIndex}
      triggerButtonClassName="max-w-full"
      handleSubmitEditSegments={handleSubmitEditSegments}
      hidePopupTimerRef={hidePopupTimerRef}
      showPopupTimerRef={showPopupTimerRef}
      imageRegenerationSegmentDetails={imageRegenerationSegmentDetails}
      setImageRegenerationSegmentDetails={setImageRegenerationSegmentDetails}
    >
      <div
        className={cn(
          "relative max-w-full flex justify-center items-center",
          story.displayResolution === DisplayAspectRatios["1024x576"]
            ? "w-40"
            : "h-40"
        )}
        style={{
          aspectRatio: imageAspectRatio,
        }}
        onClick={() => {
          setImageRegenerationSegmentDetails({
            sceneIndex,
            segmentIndex,
          });
        }}
        onMouseEnter={() => {
          if (!isPopupOpen && !imageRegenerationSegmentDetails?.disabledHover) {
            showPopupTimerRef.current = setTimeout(() => {
              setImageRegenerationSegmentDetails({
                sceneIndex,
                segmentIndex,
              });
            }, 500);
          }
          if (hidePopupTimerRef.current) {
            clearTimeout(hidePopupTimerRef.current);
          }
        }}
        onMouseLeave={() => {
          if (showPopupTimerRef.current) {
            clearTimeout(showPopupTimerRef.current);
          }
          if (isPopupOpen && !imageRegenerationSegmentDetails?.disabledHover) {
            hidePopupTimerRef.current = setTimeout(() => {
              setImageRegenerationSegmentDetails((prevSegmentDetails) => {
                if (
                  prevSegmentDetails?.segmentIndex === segmentIndex &&
                  prevSegmentDetails?.sceneIndex === sceneIndex
                ) {
                  return null;
                }
                return prevSegmentDetails;
              });
            }, 500);
          }
        }}
      >
        {segment.imageStatus === StoryStatus.PENDING ? (
          <div
            className="w-full"
            style={{
              aspectRatio: imageAspectRatio,
            }}
          >
            <ImageRegenerationLoader
              arcSize={42}
              starSize={16}
              circleSize={48}
            />
          </div>
        ) : segment.imageStatus === StoryStatus.READY ? (
          <div
            className={cn(
              "relative max-w-full",
              story.displayResolution === DisplayAspectRatios["1024x576"]
                ? "w-40"
                : "h-40"
            )}
            style={{
              aspectRatio: GetDisplayImageRatio(story.displayResolution).ratio,
            }}
          >
            <div className="w-full h-full bg-slate-100 rounded-sm border border-slate-300 flex items-center justify-center border-dashed">
              <div className="rounded-full w-6 h-6 bg-slate-200 flex items-center justify-center">
                <Plus
                  className="text-slate-500 stroke-2"
                  width={12}
                  height={12}
                />
              </div>
            </div>
          </div>
        ) : (
          <Image
            alt={"filted to load"}
            src={Format.GetImageUrl(segment.imageKey)}
            className="rounded-sm"
            layout="fill"
            objectFit="cover" // Or use 'cover' depending on the desired effect
            style={{ objectFit: "contain" }}
          />
        )}
      </div>
    </ImageRegenerationPopoverHOC>
  );
}

export default SegmentImage;
