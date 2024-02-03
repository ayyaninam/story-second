import { AbsoluteFill } from "remotion";
import React, { useMemo, CSSProperties } from "react";
import { loadFont } from "@remotion/google-fonts/Aleo";
import { useLoadingDots } from "./hooks";

const { fontFamily: fontFamilyAleo } = loadFont();

const container: CSSProperties = {
  backgroundColor: "#f1e7d4",
};

const textContainer: CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  padding: "0 32px",
  textAlign: "center",
};

const dotsStyle: CSSProperties = {
  position: "absolute",
  left: "85%",
  top: 0,
}
export const LoadingSegmentPage = () => {
  const textStyle: CSSProperties = useMemo(
    () => ({
      position: "relative",
      fontFamily: fontFamilyAleo,
      fontSize: 56,
      fontWeight: 700,
      width: 500,
    }),
    []
  );

  const dots = useLoadingDots({ dotSpeed: 15 });

  return (
    <AbsoluteFill style={container}>
      <AbsoluteFill style={textContainer}>
        <p style={textStyle}>
          Loading story
          <span style={dotsStyle}>{dots}</span>
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
