import React, { CSSProperties } from "react";
import { AbsoluteFill, OffthreadVideo } from "remotion";
import { RemotionInterpolationSegment, bigZIndexTrick } from "../constants";

const container: CSSProperties = {
  backgroundColor: "#000000",
};

const imageStyles: CSSProperties = {
  height: "100%",
};

type RenderSegmentProps = {
  segment: RemotionInterpolationSegment;
};

export function SegmentIntermediate({ segment }: RenderSegmentProps) {
  // this trick avoids showing the next segment before it should be
  const zIndex = bigZIndexTrick - segment.index;

  return (
    <AbsoluteFill style={{ ...container, zIndex }}>
      <OffthreadVideo src={segment.visual.videoURL} style={imageStyles} />
    </AbsoluteFill>
  );
}
