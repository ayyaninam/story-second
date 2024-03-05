"use client";
import React, { useState } from "react";
import GenerateModalContent from "@/components/create-modal";
import { LandingSubmitButton } from "./LandingSubmitButton";

/**
 * Prompt component for the landing page
 */
export const LandingPrompt: React.FC = () => {
	const [activated, setActivated] = useState(false);
	return activated ? (
		<GenerateModalContent className="relative h-full" />
	) : (
		<form
			className="bg-white p-2 rounded-md w-full flex items-center cursor-pointer pointer-events-auto "
			onClick={() => {
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
