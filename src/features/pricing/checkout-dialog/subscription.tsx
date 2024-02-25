import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import api from "@/api";
import StripeForm from "@/features/pricing/stripe-form";
import { SubscriptionPlan, SubscriptionPeriod } from "@/utils/enums";
import { useStripeSetup } from "../hooks";
import CheckoutDialogContent from "./view";

const base_url = "http://localhost:3000/";

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
	plan: Exclude<SubscriptionPlan, SubscriptionPlan.Free>;
	period: SubscriptionPeriod;
}

const SubscriptionCheckoutDialog = ({
	plan,
	period,
}: SubscriptionCheckoutDialogProps) => {
	const { setupStripe, confirmSetup, confirmPayment } = useStripeSetup();
	const [stripeLoaded, setStripeLoaded] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const { title, label, item } = pricingStructure[plan][period];

	const onAddCard = async () => {
		try {
			const { error } = (await confirmSetup(`${base_url}/pricing`)) || {};
			if (error) {
				console.error("Confirm Setup failed: ", error);
				toast.error("Confirm Setup failed");
				return;
			}

			toast.success("Added card successfully");
		} catch (e: any) {
			console.error("Error Adding Card: ", e.message);
			toast.error("Error Adding Card");
		}
	};

	const onCreateSubscription = async () => {
		if (submitting) return;

		setSubmitting(true);

		try {
			await onAddCard();

			const { succeeded, data, status } = await api.payment.createSubscription({
				subscriptionPlan: plan,
				subscriptionPeriod: period,
			});
			if (!succeeded) {
				console.error(`Create Subscription backend failed, status = ${status}`);
				toast.error("Create Subscription backend failed");
				return;
			}

			if (!data) {
				toast.error("Purchase failed.");
				return;
			}

			if (data.nextAction?.type !== "use_stripe_sdk") {
				if (data.succeeded && !data.requiresAction) {
					toast.success("Subscription successful!");
				} else {
					toast.error("Purchase failed.");
				}
			} else {
				toast.loading("Waiting for card authentication...");
				const { paymentIntent, error } = await confirmPayment(
					data.clientSecret!
				);
				toast.dismiss();

				if (error) {
					console.error("Stripe Error: ", error);
					toast.error(`Purchase failed: ${error.message}`);
					return;
				}

				if (paymentIntent?.status !== "succeeded") {
					toast.error("Purchase failed.");
					return;
				}

				const { succeeded: confirmSucceeded } =
					await api.payment.confirmSubscription({
						paymentIntentId: paymentIntent.id,
						subscriptionId: data.subscriptionId,
						subscriptionPlan: plan,
						subscriptionPeriod: period,
					});

				if (confirmSucceeded) {
					toast.success("Subscription successful!");
				} else {
					toast.error("Internal Server Error: please contact support.");
				}
			}
		} catch (e: any) {
			console.error("Error Paying Subscription: ", e.message);
			toast.error("Error Paying Subscription");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<CheckoutDialogContent
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
			stripeForm={
				<StripeForm
					setupStripe={setupStripe}
					onLoadStripe={() => setStripeLoaded(true)}
				/>
			}
			submitButtonText="Subscribe"
			buttonProps={{
				disabled: !stripeLoaded || submitting,
				onClick: () => onCreateSubscription(),
			}}
		/>
	);
};

export default SubscriptionCheckoutDialog;
