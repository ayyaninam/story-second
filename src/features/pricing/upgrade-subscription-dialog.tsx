import React from "react";
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
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="left-[50%] max-w-fit p-8 overflow-y-scroll lg:overflow-y-hidden max-h-[1200px] lg:max-h-none">
				<DialogHeader>
					<DialogTitle>Upgrade Subscription</DialogTitle>
					<DialogDescription>
						<PricingCards />
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default UpgradeSubscriptionDialog;
