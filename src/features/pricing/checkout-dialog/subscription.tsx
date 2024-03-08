import toast from "react-hot-toast";
import { capitalize } from "lodash";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import api from "@/api";
import StripeForm from "@/features/pricing/stripe-form";
import PaymentCard, { getUserHasCard } from "@/features/pricing/payment-card";
import { SubscriptionPlan, SubscriptionPeriod } from "@/utils/enums";
import { useStripeSetup, useUser } from "../hooks";
import CheckoutDialogContent from "./content";
import { pricingValues } from "@/features/pricing/constants";
import useEventLogger from "@/utils/analytics";

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
	Exclude<SubscriptionPlan, SubscriptionPlan.Free | SubscriptionPlan.Custom>,
	Record<SubscriptionPeriod, SubscriptionDetail>
>;

const generateSubscriptionDetail = (
	plan: Exclude<
		SubscriptionPlan,
		SubscriptionPlan.Free | SubscriptionPlan.Custom
	>,
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
	plan: Exclude<
		SubscriptionPlan,
		SubscriptionPlan.Free | SubscriptionPlan.Custom
	>;
	period: SubscriptionPeriod;
	isUpgradePlan?: boolean;
	onClose: () => void;
}

const SubscriptionCheckoutDialog = ({
	plan,
	period,
	isUpgradePlan,
	onClose,
}: SubscriptionCheckoutDialogProps) => {
	const { user, updateUserDataAfter1Second } = useUser();
	const eventLogger = useEventLogger();
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

	const onUpdateSubscription = async ({
		name,
		createOrUpgradeEndpoint,
	}: {
		name: "create" | "upgrade";
		createOrUpgradeEndpoint: typeof api.payment.upgradeSubscription;
	}) => {
		eventLogger(`${name}_subscription_initiated`, {
			subscriptionPlan: plan,
			subscriptionPeriod: period,
		});
		if (submitting) return;

		setSubmitting(true);

		const handleSubscriptionSuccessful = () => {
			toast.success("Subscription successful!");
			updateUserDataAfter1Second();
			onClose();
		};

		try {
			if (!userHasCard || userWantsToChangePayment) {
				eventLogger("add_card_initiated");
				const response = await onAddCard();
				if (!response) {
					eventLogger("add_card_failed");
					console.error("Add Card failed");
					toast.error("Add Card failed");
					return;
				}
				eventLogger("add_card_successful");
			}

			const { succeeded, data, status } = await createOrUpgradeEndpoint({
				subscriptionPlan: plan,
				subscriptionPeriod: period,
			});
			if (!succeeded) {
				eventLogger(`${name}_subscription_failed`);
				console.error(
					`${capitalize(name)} Subscription backend failed, status = ${status}`
				);
				toast.error(`${capitalize(name)} Subscription backend failed`);
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
					eventLogger(`${name}_subscription_successful`, {
						subscriptionPlan: plan,
						subscriptionPeriod: period,
					});
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

	const onSubmit = async () => {
		if (isUpgradePlan) {
			await onUpdateSubscription({
				name: "upgrade",
				createOrUpgradeEndpoint: api.payment.upgradeSubscription,
			});
		} else {
			await onUpdateSubscription({
				name: "create",
				createOrUpgradeEndpoint: api.payment.createSubscription,
			});
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
				onClick: () => onSubmit(),
				disabled: !stripeLoaded || submitting,
			}}
		/>
	);
};

export default SubscriptionCheckoutDialog;
