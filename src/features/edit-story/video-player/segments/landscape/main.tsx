import React from "react";
import { TransitionSeries } from "@remotion/transitions";
import { SegmentPage as SegmentLandscapePage } from "./page";
import { SegmentIntermediate as SegmentLandscapeIntermediate } from "./intermediate";
import { TheEndSegment } from "./the-end";
import {
	VIDEO_FPS,
	PREMOUNT_FRAMES,
	RemotionPlayerLandscapeInputProps,
} from "../../constants";
import { Premount } from "../../../components/premount";

const THE_END_DURATION = 5 * VIDEO_FPS; // in seconds

const Main: React.FC<RemotionPlayerLandscapeInputProps> = (inputProps) => {
	const { segments } = inputProps;

	return (
		<TransitionSeries>
			{segments.map((segment, index) => {
				switch (segment.type) {
					case "page":
					case "intermediate":
						const segmentPage =
							segment.type === "page" ? (
								<SegmentLandscapePage
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
								<SegmentLandscapeIntermediate segment={segment} />
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
			<TransitionSeries.Sequence durationInFrames={THE_END_DURATION}>
				<TheEndSegment />
			</TransitionSeries.Sequence>
		</TransitionSeries>
	);
};

export default Main;
