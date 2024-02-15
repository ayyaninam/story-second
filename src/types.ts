import { mlSchema } from "@/api/schema";
import { StoryLengths } from "./utils/enums";

export type CreateInitialStoryQueryParams = mlSchema["CreateStoryRequest"];

export interface AuthPromptProps {
	onSignUp: () => void;
	onLogIn: () => void;
}
