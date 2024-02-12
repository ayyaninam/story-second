import React from "react";
import { Series } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { SegmentSplitPage } from "./page";
import {
	PREMOUNT_FRAMES,
	RemotionPlayerSplitInputProps,
} from "../../constants";
import { Premount } from "../../../components/premount";
import { SegmentSplitIntermediate } from "./intermediate";
import { SegmentSplitSplitBottomVideo } from "./bottom-video";

const Main: React.FC<RemotionPlayerSplitInputProps> = (inputProps) => {
	const { segments, durationInFrames } = inputProps;

	return (
		<>
			<TransitionSeries>
				{segments.map((segment, index) => {
					switch (segment.type) {
						case "page":
						case "intermediate":
							const segmentPage =
								segment.type === "page" ? (
									<SegmentSplitPage
										segment={segment}
										prevSegment={
											index - 1 < segments.length
												? segments[index - 1]
												: undefined
										}
										nextSegment={
											index + 1 < segments.length
												? segments[index + 1]
												: undefined
										}
										inputProps={inputProps}
									/>
								) : (
									<SegmentSplitIntermediate segment={segment} />
								);

							if (index === 0) {
								return (
									<TransitionSeries.Sequence
										key={segment.id}
										durationInFrames={segment.durationInFrames}
									>
										{segmentPage}
									</TransitionSeries.Sequence>
								);
							}

							return (
								<TransitionSeries.Sequence
									key={segment.id}
									durationInFrames={segment.durationInFrames + PREMOUNT_FRAMES}
									offset={-PREMOUNT_FRAMES}
								>
									<Premount for={PREMOUNT_FRAMES}>{segmentPage}</Premount>
								</TransitionSeries.Sequence>
							);
					}
				})}
			</TransitionSeries>

			<Series>
				<Series.Sequence durationInFrames={durationInFrames}>
					<SegmentSplitSplitBottomVideo inputProps={inputProps} />
				</Series.Sequence>
			</Series>
		</>
	);
};

export default Main;
