import React, { FC } from "react";
import ImageView from "./image-view";
import TextView from "./text-view";
import { WebStory, Pages } from "./constants";

interface PageViewProps {
	page: Pages;
	story: WebStory;
	changePage?(): void;
}

export const PageView = ({ page, changePage, story }: PageViewProps) => {
	const handleClick = () => {
		changePage?.();
	};

	return (
		<div
			onClick={handleClick}
			style={{ cursor: page.pageNumber === 1 ? "auto" : "pointer" }}
			className="grid text-center flex-1 w-full bg-white border border-neutral-300 grid-rows-[1fr,_24px] px-8 py-4"
		>
			{page.variant === "image" ? (
				<div className="flex flex-col">
					<ImageView page={page} />
				</div>
			) : page.variant === "text" ? (
				<TextView page={page} />
			) : null}
			{page.pageNumber ? (
				<p className="text-slate-500">{page.pageNumber}</p>
			) : null}
		</div>
	);
};
