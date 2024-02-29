import React, { useCallback, useState, useEffect } from "react";
import { AnimatedPage } from "./animated-page";
import { PageView } from "./page-view";
import {
	WebStory,
	TurnDirection,
	Pages,
	PAGE_TURN_DURATION,
} from "./constants";
import styles from "./book.module.css";

interface BookProps {
	story: WebStory;
}

const Book = ({ story }: BookProps) => {
	const [pageArray, setPageArray] = useState<Pages[]>([]);
	const [pageIndex, setPageIndex] = useState(0);
	const [animatedPages, setAnimatedPages] = useState<[Pages, Pages]>();
	const [currentPages, setCurrentPages] = useState<[Pages, Pages]>();
	const [turnDirection, setTurnDirection] = useState<TurnDirection>();

	const changePage = useCallback(
		(isNext: boolean) => {
			if (animatedPages || !pageArray) return;
			const nextIndex = pageIndex + (isNext ? 2 : -2);

			if (nextIndex < 0) return;
			setPageIndex(nextIndex);

			const animIndexes: [number, number] = isNext
				? [nextIndex - 1, nextIndex]
				: [pageIndex, pageIndex - 1];
			const currIndexes: [number, number] = isNext
				? [pageIndex, nextIndex + 1]
				: [nextIndex, pageIndex + 1];

			// @ts-ignore
			setAnimatedPages([pageArray[animIndexes[0]], pageArray[animIndexes[1]]]);
			setTurnDirection(isNext ? "forward" : "backward");
			// @ts-ignore
			setCurrentPages([pageArray[currIndexes[0]], pageArray[currIndexes[1]]]);

			setTimeout(() => {
				setAnimatedPages(undefined);
				setTurnDirection(undefined);
				// @ts-ignore
				setCurrentPages([pageArray[nextIndex], pageArray[nextIndex + 1]]);
			}, PAGE_TURN_DURATION);
		},
		[animatedPages, pageArray, pageIndex]
	);

	useEffect(() => {
		let pNum = 1;
		let index = pageIndex;
		// if (story.storySegments.length <= 1) index = 0; code from storybird
		setPageIndex(index);

		const pArray: Pages[] =
			story.scenes
				?.flatMap((scene) => scene.storySegments)
				.flatMap((item) => {
					if (!item) {
						return [];
					}

					return [
						{
							variant: "text",
							textContent: item.textContent ?? "",
							index: item.index ?? 0,
							pageNumber: pNum++,
						},
						{
							variant: "image",
							textContent: item.textContent ?? "",
							imageKey: item.imageKey ?? "",
							imageRegenerating: item.imageRegenerating ?? false,
							imageAltText: item.imageAltText ?? "",
							index: item.index ?? 0,
							pageNumber: pNum++,
						},
					];
				}) ?? [];

		setPageArray(pArray);
		// @ts-ignore
		setCurrentPages([pArray[index], pArray[index + 1]]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [story.scenes]);

	if (!currentPages) {
		return null;
	}

	return (
		<div className="hidden lg:flex aspect-[3/2] w-full flex-1 rounded-2xl px-8 py-2 bg-accent-button border-primary-500">
			<div className={styles.bookWrapper}>
				<PageView
					changePage={() => changePage(false)}
					page={currentPages[0]}
					story={story}
				/>
				<PageView
					changePage={() => changePage(true)}
					page={currentPages[1]}
					story={story}
				/>

				{animatedPages && (
					<AnimatedPage
						pages={animatedPages}
						turnDirection={turnDirection}
						story={story}
					/>
				)}
			</div>
		</div>
	);
};

export default Book;
