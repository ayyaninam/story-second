import React from "react";
import { Series } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { SegmentPortraitPage } from "./page";
import {
	PREMOUNT_FRAMES,
	RemotionPlayerPortraitInputProps,
} from "../../constants";
import { SegmentPortraitIntermediate } from "./intermediate";
import { SegmentPortraitPortraitBottomVideo } from "./bottom-video";
import { Premount } from "../../../components/premount";

const Main: React.FC<RemotionPlayerPortraitInputProps> = (inputProps) => {
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
									<SegmentPortraitPage
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
									<SegmentPortraitIntermediate segment={segment} />
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
					<SegmentPortraitPortraitBottomVideo inputProps={inputProps} />
				</Series.Sequence>
			</Series>
		</>
	);
};

export default Main;
