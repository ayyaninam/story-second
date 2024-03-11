import { LandingPrompt } from "@/features/generate/components/LandingPrompt";
import { Suspense } from "react";

/**
 * Prompt component for embedding in the landing page
 */
export default function PromptPage() {
	return (
		<div className="max-w-screen-md h-64 mx-auto">
			<Suspense>
				<LandingPrompt />
			</Suspense>
		</div>
	);
}
