import React, { useState, useEffect } from "react";

export default function CustomImageSuspense({
	width,
	height,
}: {
	width: number;
	height: number;
}) {
	const [grid, setGrid] = useState<number[]>([]);
	const [queue, setQueue] = useState<number[]>([]);
	const [seen, setSeen] = useState<number[]>([]);

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

	// useEffect(() => {
	// 	if (queue.length > 0) {
	// 		let newQueue = [...queue];
	// 		let newSeen = [...seen];
	// 		let newGrid = [...grid];

	// 		let curr: number = newQueue[Math.random() * newQueue.length]!;
	// 		let { i, j } = ridx(curr);
	// 		newQueue = newQueue.filter((x) => x !== curr);

	// 		if (i < 0 || i >= height || j < 0 || j >= width) {
	// 			return;
	// 		}

	// 		if (newSeen.includes(curr)) {
	// 			return;
	// 		}

	// 		newSeen.push(curr);
	// 		newGrid[curr] = 1;

	// 		setSeen(newSeen);
	// 		setGrid(newGrid);

	// 		newQueue.push(idx(i + 1, j));
	// 		newQueue.push(idx(i - 1, j));
	// 		newQueue.push(idx(i, j + 1));
	// 		newQueue.push(idx(i, j - 1));

	// 		setTimeout(() => {
	// 			setQueue(newQueue);
	// 		}, 1000);
	// 	}
	// }, [queue]);

	const twoDArray = [];

	for (let i = 0; i < height; i++) {
		let row = [];
		for (let j = 0; j < width; j++) {
			row.push(grid[idx(i, j)]);
		}
		twoDArray.push(row);
	}

	return (
		<div className="grid w-full h-full bg-white" style={{ height: "500px" }}>
			{
				// @ts-ignore
				twoDArray.map((row, rowIdx) => {
					return row.map((col, colIdx) => {
						return (
							<div
								key={idx(rowIdx, colIdx)}
								className={`${col === 1 ? "bg-black" : "bg-white"}`}
							></div>
						);
					});
				})
			}
		</div>
	);
}
