import React, { FC } from "react";
import { cn } from "@/utils";
import { PageView } from "@/components/ui/story-book/desktop/pageView/page-view";
import {
	TurnDirection,
	Page,
	PAGE_TURN_DURATION,
	WebStory,
} from "../constants";
import styles from "./animated-page.module.css";

interface AnimatedPageProps {
	story: WebStory;
	pages: [Page, Page];
	turnDirection: TurnDirection;
}

export const AnimatedPage = ({
	story,
	pages,
	turnDirection,
}: AnimatedPageProps) => (
	<div
		style={
			{
				"--timing": `${PAGE_TURN_DURATION}ms`,
			} as React.CSSProperties
		}
		className={cn(
			"absolute top-0 bottom-0 w-1/2 z-10",
			turnDirection === "forward"
				? styles.animatePageForward
				: styles.animatePageBackward,
			styles.preserve3d
		)}
	>
		<div className={cn("absolute inset-0 flex")}>
			<PageView story={story} canChangePage={false} page={pages[0]} />
		</div>
		<div
			className={cn(
				"absolute inset-0 flex",
				styles.backfaceHidden,
				styles.flipVertically
			)}
		>
			<PageView story={story} canChangePage={false} page={pages[1]} />
		</div>
	</div>
);
