// variables - time to complete, url, width, height, pixelSize
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

interface IPixelImageLoader {
	duration: number;
	imageSrc: string;
	width: number;
	height: number;
	pixelSize: number;
}

const PixelImageLoader = (props: IPixelImageLoader) => {
	const { duration, imageSrc, width, height, pixelSize } = props;
	const startTime = useRef(dayjs());
	const lastTick = useRef(dayjs());

	const [grid, setGrid] = useState([...Array(width * height)].map(() => 0));
	const [queue, setQueue] = useState<number[]>([50]);
	const [seen, setSeen] = useState<number[]>([]);

	// Resetting the duration if the image source changes
	useEffect(() => {
		startTime.current = dayjs();
	}, [imageSrc]);

	const idx = (i: number, j: number) => {
		return i * width + j;
	};

	const ridx = (i: number) => {
		return { i: Math.floor(i / width), j: i % width };
	};

	const nearestNeighbour = (
		i: number,
		j: number,
		direction: "UP" | "LEFT" | "RIGHT" | "DOWN"
	) => {
		const idiff = direction === "UP" ? -1 : direction === "DOWN" ? 1 : 0;
		const jdiff = direction === "LEFT" ? -1 : direction === "RIGHT" ? 1 : 0;
		while (i >= 0 && i < height && j >= 0 && j < width) {
			i += idiff;
			j += jdiff;
			if (grid[idx(i, j)] === 0) {
				console.log(direction, i, j, idx(i, j));
				return idx(i, j);
			}
		}
		return idx(i, j);
	};

	const update = () => {
		let nQueue = [...queue];
		if (!queue.length) return;

		const idx = queue[0] ?? 0;
		const { i, j } = ridx(idx);

		const direction = Math.floor(Math.random() * 4);

		if (direction === 1 && j > 0) {
			nQueue = [...nQueue, nearestNeighbour(i, j, "LEFT")];
		} else if (direction === 2 && j < width - 1) {
			nQueue = [...nQueue, nearestNeighbour(i, j, "RIGHT")];
		} else if (direction === 3 && i < height - 1) {
			nQueue = [...nQueue, nearestNeighbour(i, j, "DOWN")];
		} else {
			nQueue = [...nQueue, nearestNeighbour(i, j, "UP")];
		}

		nQueue = nQueue.slice(1);
		setQueue(nQueue);
		console.log(nQueue);
		setGrid((prevGrid) => {
			const newGrid = [...prevGrid];
			newGrid[idx] = 1;
			return newGrid;
		});
		setSeen((prevSeen) => [...prevSeen, idx]);
	};

	useEffect(() => {
		setInterval(() => {
			// calculate boxes per second
			const timeElapsed = dayjs().diff(startTime.current, "second");
			console.log("Running interval", timeElapsed);
			const timeLeft = dayjs().diff(
				startTime.current.add(duration, "ms"),
				"second"
			);
			const ticksPerSecond = (grid.length - seen.length) / timeElapsed;
			// if (lastTick.current.diff(dayjs(), "second") > 1 / ticksPerSecond) {
			update();
			// }
		}, 1000);
	}, []);

	return (
		<div>
			{Array.from({ length: height }, (_, i) => (
				<div key={i} className="flex">
					{Array.from({ length: width }, (_, j) => (
						<div
							key={j}
							style={{
								width: pixelSize,
								height: pixelSize,
								backgroundColor: grid[idx(i, j)] === 1 ? "black" : "white",
							}}
						/>
					))}
				</div>
			))}
		</div>
	);
};

export default PixelImageLoader;
