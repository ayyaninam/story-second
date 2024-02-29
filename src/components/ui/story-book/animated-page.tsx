import React, { FC } from "react";
import { cn } from "@/utils";
import { PageView } from "./page-view";
import {
	WebStory,
	TurnDirection,
	Pages,
	PAGE_TURN_DURATION,
} from "./constants";
import styles from "./animated-page.module.css";

export const AnimatedPage: FC<{
	pages: [Pages, Pages];
	turnDirection: TurnDirection;
	story: WebStory;
}> = ({ pages, turnDirection, story }) => {
	const animation =
		turnDirection === "forward"
			? styles.animatePageForward
			: styles.animatePageBackward;

	return (
		<div
			style={
				{
					"--timing": `${PAGE_TURN_DURATION}ms`,
				} as React.CSSProperties
			}
			className={cn(
				"absolute top-0 bottom-0 w-1/2 z-10",
				animation,
				styles.preserve3d
			)}
		>
			<div className={cn("absolute inset-0 flex")}>
				<PageView page={pages[0]} story={story} />
			</div>
			<div
				className={cn(
					"absolute inset-0 flex",
					styles.backfaceHidden,
					styles.flipVertically
				)}
			>
				<PageView page={pages[1]} story={story} />
			</div>
		</div>
	);
};
