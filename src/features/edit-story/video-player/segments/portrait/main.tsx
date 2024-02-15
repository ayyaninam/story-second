import React from "react";
import { TransitionSeries } from "@remotion/transitions";
import { SegmentPortraitPage } from "./page";
import {
	PREMOUNT_FRAMES,
	RemotionPlayerPortraitInputProps,
	TO_THE_END_OF_VIDEO,
} from "../../constants";
import { SegmentPortraitIntermediate } from "./intermediate";
import TheEndSegment from "./the-end";
import { Premount } from "../../../components/premount";

const Main: React.FC<RemotionPlayerPortraitInputProps> = (inputProps) => {
	const { segments } = inputProps;

	return (
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
