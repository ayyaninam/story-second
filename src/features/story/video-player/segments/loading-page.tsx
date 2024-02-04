import { AbsoluteFill } from "remotion";
import React, { useMemo, CSSProperties } from "react";
import { useLoadingDots } from "./hooks";

const container: CSSProperties = {
  backgroundColor: "#031926", // slate-900
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
      fontSize: 56,
      fontWeight: 700,
      width: 500,
      color: "#F1F6F9"  // slate-100
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
