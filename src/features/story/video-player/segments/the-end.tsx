import { AbsoluteFill } from "remotion";
import { CSSProperties, useMemo } from "react";
import { loadFont } from "@remotion/google-fonts/Aleo";

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

export const TheEndSegment = () => {
  const textStyle: CSSProperties = useMemo(() => {
    return {
      fontFamily: fontFamilyAleo,
      fontSize: 56,
      fontWeight: 700,
      width: 500,
    };
  }, []);

  return (
    <AbsoluteFill style={container}>
      <AbsoluteFill style={textContainer}>
        <p style={textStyle}>The End.</p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
