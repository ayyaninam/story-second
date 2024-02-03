import { useCurrentFrame, interpolate } from "remotion";

// if dotSpeed is bigger then the speed is slower
export const useLoadingDots = ({ dotSpeed }: { dotSpeed: number }) => {
  const frame = useCurrentFrame();
  const dotCount = interpolate(
    frame % (dotSpeed * 4),
    [0, dotSpeed, dotSpeed * 2, dotSpeed * 3],
    [0, 1, 2, 3],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return ".".repeat(dotCount);
};
