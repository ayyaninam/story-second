import React from "react";
import { TransitionSeries } from "@remotion/transitions";
import { SegmentPage } from "./segments/page";
import { SegmentIntermediate } from "./segments/intermediate";
import { TheEndSegment } from "./segments/the-end";
import { LoadingSegmentPage } from "./segments/loading-page";
import {
	RemotionPlayerInputProps,
	VIDEO_FPS,
	PREMOUNT_FRAMES,
} from "./constants";
import { Premount } from "../components/premount";

const THE_END_DURATION = 5 * VIDEO_FPS; // in seconds

export const Main: React.FC<RemotionPlayerInputProps> = ({
	segments,
	showLoadingVideo,
}) => {
	if (showLoadingVideo) {
		return <LoadingSegmentPage />;
	}

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
			<TransitionSeries.Sequence durationInFrames={THE_END_DURATION}>
				<TheEndSegment />
			</TransitionSeries.Sequence>
		</TransitionSeries>
	);
};
