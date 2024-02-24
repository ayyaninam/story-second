import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useStripeSetup } from "../hooks";
import CheckoutDialogView from "./view";
import { SubscriptionPlan, SubscriptionPeriod } from "@/utils/enums";

const pricingStructure = {
	[SubscriptionPlan.Basic]: {
		[SubscriptionPeriod.Monthly]: {
			title: "Basic Subscription",
			label: "$10 / Month",
			item: {
				description: "Basic Monthly",
				price: 10,
			},
		},
		[SubscriptionPeriod.Annual]: {
			title: "Basic Subscription",
			label: "$100 / Year",
			item: {
				description: "Basic Annual",
				price: 100,
			},
		},
	},
	[SubscriptionPlan.Pro]: {
		[SubscriptionPeriod.Monthly]: {
			title: "Pro Subscription",
			label: "$20 / Month",
			item: {
				description: "Pro Monthly",
				price: 20,
			},
		},
		[SubscriptionPeriod.Annual]: {
			title: "Pro Subscription",
			label: "$200 / Year",
			item: {
				description: "Pro Annual",
				price: 200,
			},
		},
	},
	[SubscriptionPlan.Premium]: {
		[SubscriptionPeriod.Monthly]: {
			title: "Premium Subscription",
			label: "$30 / Month",
			item: {
				description: "Premium Monthly",
				price: 30,
			},
		},
		[SubscriptionPeriod.Annual]: {
			title: "Premium Subscription",
			label: "$300 / Year",
			item: {
				description: "Premium Annual",
				price: 300,
			},
		},
	},
};

export interface SubscriptionCheckoutDialogProps {
	children: React.ReactNode;
	plan: Exclude<SubscriptionPlan, SubscriptionPlan.Free>;
	period: SubscriptionPeriod;
}

const SubscriptionCheckoutDialog = ({
	children,
	plan,
	period,
}: SubscriptionCheckoutDialogProps) => {
	const { setupStripe, confirmSetup, confirmPayment } = useStripeSetup();
	const { title, label, item } = pricingStructure[plan][period];

	return (
		<CheckoutDialogView
			title={title}
			sideLabel={label}
			items={[
				{
					id: uuidv4(),
					description: item.description,
					price: `$${item.price}`,
				},
			]}
			total={`$${item.price}`}
			setupStripe={setupStripe}
			submitButtonText="Subscribe"
		>
			{children}
		</CheckoutDialogView>
	);
};

export default SubscriptionCheckoutDialog;
