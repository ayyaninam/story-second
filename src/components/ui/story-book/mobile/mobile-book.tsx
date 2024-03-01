import React, { useState, useEffect } from "react";
import { WebStory } from "../constants";
import Image from "next/image";
import Format from "@/utils/format";

interface BookProps {
	story: WebStory;
}

type Page = {
	textContent: string;
	imageKey: string;
	pageNumber: number;
};

const MobileBook = ({ story }: BookProps) => {
	const [pageArray, setPageArray] = useState<Page[]>([]);

	useEffect(() => {
		let pNum = 1;

		const pArray: Page[] =
			story.scenes
				?.flatMap((scene) => scene.storySegments)
				.flatMap((item) => {
					if (!item) {
						return [];
					}

					return {
						textContent: item.textContent ?? "",
						imageKey: item.imageKey ?? "",
						pageNumber: pNum++,
					};
				}) ?? [];

		setPageArray(pArray);
	}, [story.scenes]);

	return (
		<div className="w-full gap-4 flex flex-col">
			{pageArray.map((item) => (
				<div
					key={item.pageNumber}
					className="flex flex-col items-center text-center border-4 border-accent-500 rounded-2xl px-4 py-8 gap-8"
				>
					<div>{item.textContent}</div>

					<div className="flex flex-col flex-1 w-full gap-2 min-w-[250px] max-w-[512px]">
						<div className="aspect-square w-full my-auto">
							<Image
								alt="Placeholder image"
								className="aspect-square rounded-lg"
								src={Format.GetImageUrl(item.imageKey)}
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								width={512}
								height={512}
							/>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default MobileBook;
