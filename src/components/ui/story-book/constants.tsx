import { mainSchema } from "@/api/schema";

export const PAGE_TURN_DURATION = 700;

export interface Page {
	index: number;
	pageNumber: number;
}

export interface TextPage extends Page {
	variant: "text";
	textContent: string;
}

export interface ImagePage extends Page {
	variant: "image";
	textContent: string;
	imageKey: string;
	imageRegenerating: boolean;
	imageAltText: string | null;
}

export type Pages = TextPage | ImagePage;
export type TurnDirection = "forward" | "backward" | undefined;
export type WebStory = mainSchema["ReturnWebStoryDTO"];
