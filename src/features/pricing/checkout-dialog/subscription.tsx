import React from "react";
import { useStripeSetup } from "../hooks";
import CheckoutDialogView from "./view";
import { SubscriptionPlan, SubscriptionPeriod } from "@/utils/enums";

const pricingStructure = {
	[SubscriptionPlan.Free]: {
		[SubscriptionPeriod.Monthly]: { price: 0, label: "Free" },
		[SubscriptionPeriod.Annual]: { price: 0, label: "Free" },
	},
	[SubscriptionPlan.Basic]: {
		[SubscriptionPeriod.Monthly]: { price: 10, label: "$10 / Month" },
		[SubscriptionPeriod.Annual]: { price: 100, label: "$100 / Year" },
	},
	[SubscriptionPlan.Pro]: {
		[SubscriptionPeriod.Monthly]: { price: 20, label: "$20 / Month" },
		[SubscriptionPeriod.Annual]: { price: 200, label: "$200 / Year" },
	},
	[SubscriptionPlan.Premium]: {
		[SubscriptionPeriod.Monthly]: { price: 30, label: "$30 / Month" },
		[SubscriptionPeriod.Annual]: { price: 300, label: "$300 / Year" },
	},
};

export interface SubscriptionCheckoutDialogProps {
	children: React.ReactNode;
	plan: SubscriptionPlan;
	period: SubscriptionPeriod;
}

const SubscriptionCheckoutDialog = ({
	children,
	plan,
	period,
}: SubscriptionCheckoutDialogProps) => {
	const { setupStripe, confirmSetup, confirmPayment } = useStripeSetup();

	return (
		<CheckoutDialogView
			title={<div>Pro Subscription</div>}
			sideHeader={pricingStructure[plan][period].label}
			setupStripe={setupStripe}
			submitButtonText="Subscribe"
		>
			{children}
		</CheckoutDialogView>
	);
};

export default SubscriptionCheckoutDialog;
