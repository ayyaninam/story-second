import React, { useMemo, CSSProperties } from "react";
import { Gif } from "@remotion/gif";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { AbsoluteFill, Img, Audio, Sequence, useVideoConfig, interpolate, useCurrentFrame, Video, } from "remotion";
import { SILENT_DURATION, VIDEO_FPS, INCREASED_LAST_PAGE_DURATION, RemotionSegment, } from "../constants";

const { fontFamily: fontFamilyPoppins } = loadFont();

const container: CSSProperties = {
  backgroundColor: "#000000",
};

const subtitleContainer: CSSProperties = {
  justifyContent: "flex-start",
  alignItems: "center",
  paddingTop: "600px",
  textAlign: "center",
};

const imageStyles: CSSProperties = {
  height: "100%",
};

type RenderSegmentProps = {
  segment: RemotionSegment;
  isLastSegment: boolean;
};

export const SegmentPage = ({ segment, isLastSegment }: RenderSegmentProps) => {
  if (segment.type !== "page") {
    return null
  }

  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const storyTextStyle: CSSProperties = useMemo(
    () => ({
      fontFamily: fontFamilyPoppins,
      fontSize: 24,
      width: 500,
      color: "white",
    }),
    []
  );

  const startAudioFrom = VIDEO_FPS * SILENT_DURATION;

  const percentageTextToShow = interpolate(
    frame,
    [
      startAudioFrom,
      startAudioFrom +
        segment.contentDuration -
        (isLastSegment ? INCREASED_LAST_PAGE_DURATION * VIDEO_FPS : 0),
    ],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const storyText = useMemo(() => {
    if (!segment.storyText) {
      return "";
    }

    const numberOfWordsToShow = 3;

    const blacklist = /[,.-]/g;

    const cleanedText = segment.storyText
      .replace(blacklist, "")
      .toLowerCase();
    const words = cleanedText.split(" ");

    const startIndex =
      Math.floor(percentageTextToShow * (words.length / numberOfWordsToShow)) *
      numberOfWordsToShow;

    return words.slice(startIndex, startIndex + numberOfWordsToShow).join(" ");
  }, [percentageTextToShow, segment.storyText]);

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

      <AbsoluteFill style={subtitleContainer}>
        <p style={storyTextStyle}>{storyText}</p>
      </AbsoluteFill>

      {segment.audioURL && (
        <Sequence from={startAudioFrom}>
          <Audio src={segment.audioURL} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

