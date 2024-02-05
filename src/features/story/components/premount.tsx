// based on https://www.remotion.dev/docs/troubleshooting/player-flicker#strategies
import React, { useContext, useMemo } from "react";
import { Internals, TimelineContextValue, useVideoConfig } from "remotion";

type PremountProps = {
  for: number;
  children: React.ReactNode;
};

export const Premount: React.FC<PremountProps> = ({
  for: premountFor,
  children,
}) => {
  const { id } = useVideoConfig();
  const sequenceContext = useContext(Internals.SequenceContext);

  const context = useContext(Internals.Timeline.TimelineContext);
  const value: TimelineContextValue = useMemo(() => {
    const contextOffset = sequenceContext
      ? sequenceContext.cumulatedFrom + sequenceContext.relativeFrom
      : 0;

    const currentFrame = (context?.frame[id] ?? 0) - contextOffset;
    const playing = currentFrame < premountFor ? false : context.playing;
    const imperativePlayingValue =
      currentFrame < premountFor ? false : context.imperativePlaying.current;
    const frameValue = Math.max(0, currentFrame - premountFor) + contextOffset;

    return {
      ...context,
      playing,
      imperativePlaying: {
        current: imperativePlayingValue,
      },
      frame: { [id]: frameValue },
    };
  }, [context, premountFor, sequenceContext, id]);

  return (
    <Internals.Timeline.TimelineContext.Provider value={value}>
      {children}
    </Internals.Timeline.TimelineContext.Provider>
  );
};
