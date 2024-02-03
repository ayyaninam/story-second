import React, { CSSProperties } from "react";
import { Gif } from "@remotion/gif";
import {
  AbsoluteFill,
  Img,
  useVideoConfig,
  Video,
} from "remotion";
import { RemotionSegment } from "../constants";

const container: CSSProperties = {
  backgroundColor: "#000000",
};

const imageStyles: CSSProperties = {
  height: "100%",
};

type RenderSegmentProps = {
  segment: RemotionSegment;
};

export function SegmentIntermediate({ segment }: RenderSegmentProps) {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={container}>
      <AbsoluteFill>
        {segment.visual.format === "video" ? (
          <Video src={segment.visual.videoURL} style={imageStyles} />
        ) : segment.visual.format === "image" ? (
          <Img src={segment.visual.imageURL} style={imageStyles} />
        ) : (
          <Gif
            src={segment.visual.gifURL}
            width={width}
            height={height}
            fit="fill"
            playbackRate={1}
            loopBehavior="pause-after-finish"
          />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
