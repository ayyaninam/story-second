import toast from "react-hot-toast";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import api from "@/api";
import StripeForm from "@/features/pricing/stripe-form";
import PaymentCard, { getUserHasCard } from "@/features/pricing/payment-card";
import { SubscriptionPlan, SubscriptionPeriod } from "@/utils/enums";
import { useStripeSetup, useUser } from "../hooks";
import CheckoutDialogContent from "./content";
import { pricingValues } from "@/features/pricing/constants";

type Item = {
	description: string;
	price: string;
};

type SubscriptionDetail = {
	title: string;
	label: string;
	description: string;
	items: Item[];
	total: string;
};

type SubscriptionStructure = Record<
	Exclude<SubscriptionPlan, SubscriptionPlan.Free>,
	Record<SubscriptionPeriod, SubscriptionDetail>
>;

const generateSubscriptionDetail = (
	plan: Exclude<SubscriptionPlan, SubscriptionPlan.Free>,
	period: SubscriptionPeriod,
	description: string
): SubscriptionDetail => {
	const pricingDetail = pricingValues[plan][period];
	const title = pricingDetail.title;
	const monthlyPrice = pricingDetail.itemMonthly;

	let items: Item[];
	let label: string;

	if (period === SubscriptionPeriod.Monthly) {
		items = [
			{
				description: `${title} Monthly`,
				price: monthlyPrice,
			},
		];
		label = `${monthlyPrice} / Month`;
	} else {
		// @ts-ignore
		const yearlyPrice = pricingDetail.itemYearly;
		items = [
			{
				description: `${title} Monthly`,
				price: monthlyPrice,
			},
			{
				description: "Billed annually (x12)",
				price: yearlyPrice,
			},
		];
		label = `${yearlyPrice} / Year`;
	}

	return {
		title,
		label,
		description,
		items,
		total:
			period === SubscriptionPeriod.Monthly
				? monthlyPrice
				: // @ts-ignore
					pricingDetail.itemYearly,
	};
};

const pricingStructure: SubscriptionStructure = {
	[SubscriptionPlan.Basic]: {
		[SubscriptionPeriod.Monthly]: generateSubscriptionDetail(
			SubscriptionPlan.Basic,
			SubscriptionPeriod.Monthly,
			"When you grow, need more power and flexibility."
		),
		[SubscriptionPeriod.Annual]: generateSubscriptionDetail(
			SubscriptionPlan.Basic,
			SubscriptionPeriod.Annual,
			"When you grow, need more power and flexibility."
		),
	},
	[SubscriptionPlan.Pro]: {
		[SubscriptionPeriod.Monthly]: generateSubscriptionDetail(
			SubscriptionPlan.Pro,
			SubscriptionPeriod.Monthly,
			"More videos. More stories. Faster generation times."
		),
		[SubscriptionPeriod.Annual]: generateSubscriptionDetail(
			SubscriptionPlan.Pro,
			SubscriptionPeriod.Annual,
			"More videos. More stories. Faster generation times."
		),
	},
	[SubscriptionPlan.Premium]: {
		[SubscriptionPeriod.Monthly]: generateSubscriptionDetail(
			SubscriptionPlan.Premium,
			SubscriptionPeriod.Monthly,
			"Maximum power and flexibility for large-scale content generation needs."
		),
		[SubscriptionPeriod.Annual]: generateSubscriptionDetail(
			SubscriptionPlan.Premium,
			SubscriptionPeriod.Annual,
			"Maximum power and flexibility for large-scale content generation needs."
		),
	},
};

export interface SubscriptionCheckoutDialogProps {
	plan: Exclude<SubscriptionPlan, SubscriptionPlan.Free>;
	period: SubscriptionPeriod;
	onClose: () => void;
}

const SubscriptionCheckoutDialog = ({
	plan,
	period,
	onClose,
}: SubscriptionCheckoutDialogProps) => {
	const { user, updateUserDataAfter1Second } = useUser();
	const { setupStripe, onAddCard, confirmPayment } = useStripeSetup();

	const [stripeLoaded, setStripeLoaded] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [userWantsToChangePayment, setUserWantsToChangePayment] =
		useState(false);

	const userHasCard = user ? getUserHasCard(user) : false;
	const showPaymentCard = userHasCard && !userWantsToChangePayment;

	const { title, label, items, total, description } =
		pricingStructure[plan][period];

	const submitButtonText = `Pay ${total}`;

	const onCreateSubscription = async () => {
		if (submitting) return;

		setSubmitting(true);

		const handleSubscriptionSuccessful = () => {
			toast.success("Subscription successful!");
			updateUserDataAfter1Second();
			onClose();
		};

		try {
			if (!userHasCard || userWantsToChangePayment) {
				await onAddCard();
			}

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
				handleSubscriptionSuccessful();
				return;
			}

			// using 3d secure authentication
			// https://docs.stripe.com/testing#regulatory-cards
			if (data.nextAction?.type !== "use_stripe_sdk") {
				if (data.succeeded && !data.requiresAction) {
					handleSubscriptionSuccessful();
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
					handleSubscriptionSuccessful();
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
			items={items.map(({ description, price }) => ({
				id: uuidv4(),
				description,
				price,
			}))}
			total={total}
			description={description}
			stripeForm={
				<>
					{showPaymentCard && (
						<div className="mt-2">
							<PaymentCard
								editable
								onEdit={() => setUserWantsToChangePayment(true)}
								onRemove={() => updateUserDataAfter1Second()}
							/>
						</div>
					)}
					<div hidden={showPaymentCard}>
						<StripeForm
							setupStripe={setupStripe}
							onLoadStripe={() => setStripeLoaded(true)}
						/>
					</div>
				</>
			}
			submitButtonText={submitButtonText}
			buttonProps={{
				onClick: () => onCreateSubscription(),
				disabled: !stripeLoaded || submitting,
			}}
		/>
	);
};

export default SubscriptionCheckoutDialog;
