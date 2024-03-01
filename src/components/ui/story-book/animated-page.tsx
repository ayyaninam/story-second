import React, { FC } from "react";
import { cn } from "@/utils";
import { PageView } from "./page-view";
import { TurnDirection, Pages, PAGE_TURN_DURATION } from "./constants";
import styles from "./animated-page.module.css";

export const AnimatedPage: FC<{
	pages: [Pages, Pages];
	turnDirection: TurnDirection;
}> = ({ pages, turnDirection }) => (
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
			<PageView page={pages[0]} />
		</div>
		<div
			className={cn(
				"absolute inset-0 flex",
				styles.backfaceHidden,
				styles.flipVertically
			)}
		>
			<PageView page={pages[1]} />
		</div>
	</div>
);
