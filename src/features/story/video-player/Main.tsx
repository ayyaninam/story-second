import React from "react";
import { Series } from "remotion";
import { SegmentPage } from "./segments/page";
import { SegmentIntermediate } from "./segments/intermediate";
import { TheEndSegment } from "./segments/the-end";
import { LoadingSegmentPage } from "./segments/loading-page";
import { RemotionPlayerInputProps, VIDEO_FPS, } from "./constants";

const THE_END_DURATION = 5 * VIDEO_FPS; // in seconds

export const Main: React.FC<RemotionPlayerInputProps> = ({
  segments,
  showLoadingVideo,
}) => {
  if (showLoadingVideo) {
    return <LoadingSegmentPage />;
  }

  return (
    <Series>
      {segments.map((segment, index) => (
        <Series.Sequence key={segment.id} durationInFrames={segment.durationInFrames}>
          {
            segment.type === "page"?
              <SegmentPage
                segment={segment}
                isLastSegment={index === segments.length - 1}
              />
              : <SegmentIntermediate segment={segment} />
          }
        </Series.Sequence>
      ))}
      <Series.Sequence durationInFrames={THE_END_DURATION}>
        <TheEndSegment />
      </Series.Sequence>
    </Series>
  );
};
