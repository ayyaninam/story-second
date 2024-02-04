import { AbsoluteFill } from "remotion";
import { CSSProperties, useMemo } from "react";

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
      fontFamily: "--font-rand",
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
