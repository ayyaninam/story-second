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
import useEventLogger, { AnalyticsEvent } from "@/utils/analytics";

interface UpgradeSubscriptionDialogProps {
	children: React.ReactNode;
}

const UpgradeSubscriptionDialog = ({
	children,
}: UpgradeSubscriptionDialogProps) => {
	const [open, setOpen] = useState(false);
	const eventLogger = useEventLogger();

	return (
		<Dialog
			open={open}
			onOpenChange={(state) => {
				const action = ("upgrade_subscription_dialog_" +
					(state ? "opened" : "closed")) as AnalyticsEvent;
				eventLogger(action);
				setOpen(state);
			}}
		>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="left-[50%] max-w-fit py-8 px-0 sm:p-8 overflow-y-scroll max-h-screen">
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
