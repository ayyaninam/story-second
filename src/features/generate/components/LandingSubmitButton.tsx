import React from "react";
import { ArrowRight } from "lucide-react";
import StoryLogo from "../../../../public/auth-prompt/story-logo";

export const LandingSubmitButton: React.FC = () => {
	return (
		<button type="submit" className="flex flex-nowrap prompt-default-button">
			<StoryLogo />
			<span>Generate</span>
			<ArrowRight strokeWidth={1} size={18} className="text-neutral-400" />
		</button>
	);
};
