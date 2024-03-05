import React, { useState } from "react";
import GenerateModalContent from "@/components/create-modal";
import { LandingSubmitButton } from "./LandingSubmitButton";

/**
 * Prompt component for the landing page
 */
export const LandingPrompt: React.FC = () => {
	const [activated, setActivated] = useState(false);
	return activated ? (
		<GenerateModalContent />
	) : (
		<form
			className="w-full flex items-center cursor-pointer"
			onClick={() => {
				console.log("clicked");
				setActivated(true);
			}}
		>
			<input
				className="cursor-pointer w-full outline-none ring-0 border-none"
				placeholder="Tell your story..."
			/>
			<LandingSubmitButton />
		</form>
	);
};
