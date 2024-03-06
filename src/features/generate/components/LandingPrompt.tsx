"use client";
import React, { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import GenerateModalContent from "@/components/create-modal";
import { LandingSubmitButton } from "./LandingSubmitButton";

/**
 * Prompt component for the landing page
 */
export const LandingPrompt: React.FC = () => {
	const [activated, setActivated] = useState(false);
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 1000 * 60 * 5,
					},
				},
			})
	);
	return activated ? (
		<QueryClientProvider client={queryClient}>
			<GenerateModalContent className="relative h-full" fromLanding />
		</QueryClientProvider>
	) : (
		<div className="px-4 lg:px-0">
			<form
				className="bg-white p-4 rounded-md w-full flex items-center cursor-pointer pointer-events-auto "
				onClick={(e) => {
					setActivated(true);
					e.preventDefault();
				}}
			>
				<input
					className="cursor-pointer w-full outline-none ring-0 border-none"
					placeholder="Tell your story..."
				/>
				<LandingSubmitButton />
			</form>
		</div>
	);
};
