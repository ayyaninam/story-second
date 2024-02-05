import React from "react";
import { Series } from "remotion";
import { SegmentPage } from "./segments/page";
import { SegmentIntermediate } from "./segments/intermediate";
import { TheEndSegment } from "./segments/the-end";
import { LoadingSegmentPage } from "./segments/loading-page";
import { RemotionPlayerInputProps, VIDEO_FPS } from "./constants";
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
		<Series>
			{segments.map((segment, index) => {
				const segmentPage =
					segment.type === "page" ? (
						<SegmentPage
							segment={segment}
							isLastSegment={index === segments.length - 1}
						/>
					) : (
						<SegmentIntermediate segment={segment} />
					);

				if (index === 0) {
					return (
						<Series.Sequence
							key={segment.id}
							durationInFrames={segment.durationInFrames}
						>
							{segmentPage}
						</Series.Sequence>
					);
				}

				// todo: this might slow down the mp4 rendering on ec2, check if happens
				// if it does then setting this value to 0 only for ec2 will work
				// this is in order to avoid flickering
				// higher value means more video players existing one above other at the same time = more resources?
				// lower value increases the chance of flickering
				const premountFrames = 150;

				return (
					<Series.Sequence
						key={segment.id}
						durationInFrames={segment.durationInFrames + premountFrames}
						offset={-premountFrames}
					>
						<Premount for={premountFrames}>{segmentPage}</Premount>
					</Series.Sequence>
				);
			})}
			<Series.Sequence durationInFrames={THE_END_DURATION}>
				<TheEndSegment />
			</Series.Sequence>
		</Series>
	);
};
