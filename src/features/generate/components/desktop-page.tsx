import { GenerateHeader } from "@/features/generate/components/header";
import GenerateModalContent from "@/components/create-modal";

export default function DesktopGeneratePage() {
	return (
		<div className="hidden lg:block h-full overflow-y-scroll bg-background lg:rounded-lg flex-grow">
			<GenerateHeader />
			<GenerateModalContent className="mt-24" />
		</div>
	);
}
