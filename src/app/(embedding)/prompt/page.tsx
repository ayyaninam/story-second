import { LandingPrompt } from "@/features/generate/components/LandingPrompt";

/**
 * Prompt component for embedding in the landing page
 */
export default function PromptPage() {
	return (
		<div className="max-w-screen-md h-64 mx-auto">
			<LandingPrompt />
		</div>
	);
}
