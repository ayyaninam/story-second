import { mainSchema } from "@/api/schema";

export const PAGE_TURN_DURATION = 700;

interface BasePage {
	index: number;
	pageNumber: number;
}

export interface TextPage extends BasePage {
	variant: "text";
	textContent: string | null;
}

export interface ImagePage extends BasePage {
	variant: "image";
	textContent: string;
	imageKey: string | null;
	imageRegenerating: boolean;
	imageAltText: string | null;
}

export interface TheEndPage extends BasePage {
	variant: "the-end-left" | "the-end-right";
}

export type Page = TextPage | ImagePage | TheEndPage;
export type TurnDirection = "forward" | "backward" | undefined;
export type WebStory = mainSchema["ReturnWebStoryDTO"];
