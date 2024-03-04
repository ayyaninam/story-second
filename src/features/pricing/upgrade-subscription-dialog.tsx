import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import PricingCards from "@/features/pricing/pricing-cards";

interface UpgradeSubscriptionDialogProps {
	children: React.ReactNode;
}

const UpgradeSubscriptionDialog = ({
	children,
}: UpgradeSubscriptionDialogProps) => {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="left-[50%] max-w-fit py-8 px-0 sm:p-8 overflow-y-scroll lg:overflow-y-hidden max-h-screen lg:max-h-none">
				<DialogHeader>
					<DialogTitle>Upgrade Subscription</DialogTitle>
					<DialogDescription>
						<PricingCards onClickFreePlan={() => setOpen(false)} />
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default UpgradeSubscriptionDialog;
