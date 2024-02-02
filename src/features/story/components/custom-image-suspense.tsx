import dayjs from "dayjs";
import React, { useState, useEffect, useRef } from "react";
import { useMap, useReadLocalStorage } from "usehooks-ts";

export default function CustomImageSuspense({
	imageSrc,
	pixelSize = 40,
	loadingDuration = 10000,
	width,
	height,
}: {
	loadingDuration: number;
	imageSrc: string;
	width: number;
	height: number;
	pixelSize: number;
}) {
	const startTime = useRef(dayjs());
	const lastTick = useRef(dayjs());
	const [grid, setGrid] = useState<number[]>([]);
	const [queue, setQueue] = useState<number[]>([]);
	const [seen, seenActions] = useMap<number, number>();

	useEffect(() => {
		startTime.current = dayjs();
		setGrid([]);
		setQueue([]);
		seenActions.reset();
		let tmp = [];
		for (let i = 0; i < width * height; i++) {
			tmp.push(0);
		}
		setGrid(tmp);

		let initialQueue = [];

		// all edges are 1
		for (let i = 0; i < width; i++) {
			initialQueue.push(idx(0, i));
			initialQueue.push(idx(height - 1, i));
		}

		for (let i = 0; i < height; i++) {
			initialQueue.push(idx(i, 0));
			initialQueue.push(idx(i, width - 1));
		}

		setQueue(initialQueue);
	}, [imageSrc]);

	const idx = (i: number, j: number) => {
		return i * width + j;
	};

	const ridx = (i: number) => {
		return { i: Math.floor(i / width), j: i % width };
	};

	useEffect(() => {
		let tmp = [];
		for (let i = 0; i < width * height; i++) {
			tmp.push(0);
		}
		setGrid(tmp);

		let initialQueue = [];

		// all edges are 1
		for (let i = 0; i < width; i++) {
			initialQueue.push(idx(0, i));
			initialQueue.push(idx(height - 1, i));
		}

		for (let i = 0; i < height; i++) {
			initialQueue.push(idx(i, 0));
			initialQueue.push(idx(i, width - 1));
		}

		setQueue(initialQueue);
	}, [width, height]);

	const update = () => {
		if (queue.length > 0) {
			let newQueue = [...queue];
			let newGrid = [...grid];

			const isValidIndex = (i: number, j: number) => {
				return (
					i >= 0 && i < height && j >= 0 && j < width && !seen.has(idx(i, j))
				);
			};

			let curr: number = newQueue[Math.floor(Math.random() * newQueue.length)]!;
			let { i, j } = ridx(curr);
			// console.log(curr);
			newQueue = newQueue.filter((x) => x !== curr);

			if (i < 0 || i >= height || j < 0 || j >= width) {
				console.log("OOB", curr);
				return;
			}

			if (seen.has(curr)) {
				console.log("Seen", curr);
				return;
			}

			newGrid[curr] = 1;
			seenActions.set(curr, curr);
			setGrid(newGrid);

			if (isValidIndex(i + 1, j)) newQueue.push(idx(i + 1, j));
			if (isValidIndex(i - 1, j)) newQueue.push(idx(i - 1, j));
			if (isValidIndex(i, j + 1)) newQueue.push(idx(i, j + 1));
			if (isValidIndex(i, j - 1)) newQueue.push(idx(i, j - 1));

			setQueue(newQueue);
		}
	};

	// 20 ticks left and 10 seconds left, 2 ticks per second. ticks left/time left

	useEffect(() => {
		const interval = setInterval(() => {
			const now = dayjs();
			const timeLeft = startTime.current
				.add(loadingDuration - 750, "ms")
				.diff(now, "ms");
			const ticksPerSecond = ((grid.length - seen.size) / timeLeft) * 1000;
			if (now.diff(lastTick.current, "ms") / 1.5 > ticksPerSecond) {
				update();
				lastTick.current = dayjs();
			}
		}, 10);
		return () => clearInterval(interval);
	});
	let twoDArray = [];

	for (let i = 0; i < height; i++) {
		let row = [];
		for (let j = 0; j < width; j++) {
			row.push(grid[idx(i, j)]);
		}
		twoDArray.push(row);
	}
	return (
		<div
			style={{
				width: width * pixelSize,
				height: height * pixelSize,
				backgroundImage: `url(${imageSrc})`,
			}}
		>
			{queue.length > 0
				? twoDArray.map((row, rowIdx) => {
						return (
							<div key={rowIdx} className="flex m-0 leading-none p-0 ">
								{row.map((col, colIdx) => {
									return (
										<div
											key={idx(rowIdx, colIdx)}
											className={`h-10 w-10 ${col === 1 ? "opacity-0" : "bg-yellow-200"} m-0 p-0 transition-all`}
										></div>
									);
								})}
							</div>
						);
					})
				: null}
		</div>
	);
}
