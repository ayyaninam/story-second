import { GenerateHeader } from "@/features/generate/components/header";
import GenerateModalContent from "@/components/create-modal";
import { useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function DesktopGeneratePage() {
	const router = useRouter();
	const { message } = router.query ?? {};

	useEffect(() => {
		if (message) {
			toast.dismiss();
			toast.error(message as string);
		}
	}, []);
	return (
		<div className="hidden lg:block h-full overflow-y-scroll bg-background lg:rounded-lg flex-grow">
			<GenerateHeader />
			<GenerateModalContent />
		</div>
	);
}
