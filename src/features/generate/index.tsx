import React from "react";
import MobileGeneratePage from "@/features/generate/components/mobile-page";
import DesktopGeneratePage from "@/features/generate/components/desktop-page";
import VerifyDialog from "@/features/generate/components/VerifyDialog";

function GeneratePage() {
	return (
		<>
			<DesktopGeneratePage />
			<MobileGeneratePage />
			<VerifyDialog />
		</>
	);
}

export default GeneratePage;
