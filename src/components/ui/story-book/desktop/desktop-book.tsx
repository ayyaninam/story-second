import React, { useCallback, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedPage } from "./animated-page";
import { PageView } from "./pageView/page-view";
import {
	WebStory,
	TurnDirection,
	Page,
	PAGE_TURN_DURATION,
} from "../constants";
import styles from "./desktop-book.module.css";

interface BookProps {
	story: WebStory;
}

const DesktopBook = ({ story }: BookProps) => {
	const [pageArray, setPageArray] = useState<Page[]>([]);
	const [pageIndex, setPageIndex] = useState(0);
	const [animatedPages, setAnimatedPages] = useState<[Page, Page]>();
	const [currentPages, setCurrentPages] = useState<[Page, Page]>();
	const [turnDirection, setTurnDirection] = useState<TurnDirection>();
	const [loading, setLoading] = useState(false);

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

		const pArray: Page[] =
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

		const pageArray: Page[] = [
			...pArray,
			{
				variant: "the-end-left",
				index: pArray.length,
				pageNumber: pNum++,
			},
			{
				variant: "the-end-right",
				index: pArray.length,
				pageNumber: pNum++,
			},
		];
		setPageArray(pageArray);
		// @ts-ignore
		setCurrentPages([pArray[index], pArray[index + 1]]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [story.scenes]);

	if (!currentPages) {
		return null;
	}

	return (
		<div className="w-[1200px] mb-[200px]">
			<div className="flex aspect-[3/2] flex-1 rounded-2xl px-8 py-2 bg-accent-button border-primary-500">
				<div className={styles.bookWrapper}>
					{loading ? (
						<>
							<div className="w-[50%] flex flex-col gap-2 justify-center items-center bg-white border border-neutral-300">
								<Skeleton className="h-4 w-[400px]" />
								<Skeleton className="h-4 w-[400px]" />
								<Skeleton className="h-4 w-[400px]" />
								<Skeleton className="h-4 w-[400px]" />
							</div>
							<div className="w-[50%] flex justify-center items-center bg-white border border-neutral-300">
								<Skeleton className="w-10/12 aspect-square rounded-xl" />
							</div>
						</>
					) : (
						<>
							<PageView
								story={story}
								page={currentPages[0]}
								changePage={() => changePage(false)}
							/>
							<PageView
								story={story}
								page={currentPages[1]}
								changePage={() => changePage(true)}
							/>

							{animatedPages && (
								<AnimatedPage
									story={story}
									pages={animatedPages}
									turnDirection={turnDirection}
								/>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default DesktopBook;
