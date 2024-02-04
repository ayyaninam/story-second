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
	const sequenceContext = useContext(Internals.SequenceContext);
	const { id } = useVideoConfig();
	if (typeof premountFor === "undefined") {
		throw new Error(
			`The <Premount /> component requires a 'for' prop, but none was passed.`
		);
	}

	if (typeof premountFor !== "number") {
		throw new Error(
			`The 'for' prop of <Premount /> must be a number, but is of type ${typeof premountFor}`
		);
	}

	if (Number.isNaN(premountFor)) {
		throw new Error(
			`The 'for' prop of <Premount /> must be a real number, but it is NaN.`
		);
	}

	if (!Number.isFinite(premountFor)) {
		throw new Error(
			`The 'for' prop of <Premount /> must be a finite number, but it is ${premountFor}.`
		);
	}

	const context = useContext(Internals.Timeline.TimelineContext);
	const value: TimelineContextValue = useMemo(() => {
		const contextOffset = sequenceContext
			? sequenceContext.cumulatedFrom + sequenceContext.relativeFrom
			: 0;

		// v3
		// const currentFrame = context.frame - contextOffset;
		// v4
		const currentFrame = (context?.frame[id] ?? 0) - contextOffset;
		return {
			...context,
			playing: currentFrame < premountFor ? false : context.playing,
			imperativePlaying: {
				current:
					currentFrame < premountFor
						? false
						: context.imperativePlaying.current,
			},
			// Remotion v4
			frame: { [id]: Math.max(0, currentFrame - premountFor) + contextOffset },
			// Remotion v3
			// frame: Math.max(0, currentFrame - premountFor) + contextOffset,
		};
	}, [context, premountFor, sequenceContext, id]);

	return (
		<Internals.Timeline.TimelineContext.Provider value={value}>
			{children}
		</Internals.Timeline.TimelineContext.Provider>
	);
};
