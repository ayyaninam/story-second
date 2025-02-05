import React from "react";

import ImageView from "./image-view";
import TextView from "./text-view";
import { Page, WebStory } from "../../constants";
import { TheEndLeftView, TheEndRightView } from "./the-end-view";

interface PageViewProps {
	story: WebStory;
	page: Page;
	canChangePage: boolean;
	changePage?: () => void;
}

export const PageView = ({
	story,
	page,
	canChangePage,
	changePage,
}: PageViewProps) => (
	<div
		onClick={() => (canChangePage ? changePage?.() : null)}
		style={{
			cursor: canChangePage ? "pointer" : "auto",
		}}
		className="grid text-center flex-1 w-full bg-white border border-neutral-300 grid-rows-[1fr,_24px] px-8 py-4"
	>
		{page.variant === "image" ? (
			<ImageView page={page} />
		) : page.variant === "text" ? (
			<TextView page={page} />
		) : page.variant === "the-end-left" ? (
			<TheEndLeftView />
		) : page.variant === "the-end-right" ? (
			<TheEndRightView story={story} />
		) : null}

		{page.pageNumber && page.variant !== "the-end-right" ? (
			<p className="text-slate-500">{page.pageNumber}</p>
		) : null}
	</div>
);
