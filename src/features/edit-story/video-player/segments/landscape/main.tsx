import React from "react";
import { TransitionSeries } from "@remotion/transitions";

import SegmentPage from "./page";
import SegmentIntermediate from "./intermediate";
import TheEndSegment from "./the-end";

import {
	PREMOUNT_FRAMES,
	RemotionPlayerLandscapeInputProps,
	TO_THE_END_OF_VIDEO,
} from "../../constants";
import { Premount } from "../../../components/premount";

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
								<SegmentPage
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
								<SegmentIntermediate segment={segment} />
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
			<TransitionSeries.Sequence
				offset={-PREMOUNT_FRAMES}
				durationInFrames={TO_THE_END_OF_VIDEO}
			>
				<Premount for={PREMOUNT_FRAMES}>
					<TheEndSegment />
				</Premount>
			</TransitionSeries.Sequence>
		</TransitionSeries>
	);
};

export default Main;
