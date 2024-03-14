import React from "react";
import { Series, OffthreadVideo } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { SegmentSplitPage } from "./page";
import {
	PREMOUNT_FRAMES,
	RemotionPlayerSplitInputProps,
	TO_THE_END_OF_VIDEO,
} from "../../constants";
import { Premount } from "../../../components/premount";
import { SegmentSplitIntermediate } from "./intermediate";
import { SegmentSplitSplitBottomVideo } from "./bottom-video";
import TheEndSegment from "./the-end";

const Main: React.FC<RemotionPlayerSplitInputProps> = (inputProps) => {
	const { segments, pagesDurationInFrames, renderedVideoURL } = inputProps;

	if (renderedVideoURL) {
		return <OffthreadVideo src={renderedVideoURL} />;
	}

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

				<TransitionSeries.Sequence
					durationInFrames={TO_THE_END_OF_VIDEO}
					offset={-PREMOUNT_FRAMES}
				>
					<TheEndSegment />
				</TransitionSeries.Sequence>
			</TransitionSeries>

			<Series>
				<Series.Sequence durationInFrames={pagesDurationInFrames}>
					<SegmentSplitSplitBottomVideo inputProps={inputProps} />
				</Series.Sequence>
			</Series>
		</>
	);
};

export default Main;
