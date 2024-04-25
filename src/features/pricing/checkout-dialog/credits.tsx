import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import React, { useState, useEffect, useMemo } from "react";

import api from "@/api";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import StripeForm from "@/features/pricing/stripe-form";
import PaymentCard, { getUserHasCard } from "@/features/pricing/payment-card";
import { SubscriptionPlan, AllowanceType } from "@/utils/enums";

import { useStripeSetup, useUser } from "../hooks";
import CheckoutDialogContent from "./content";
import useUpdateUser from "@/hooks/useUpdateUser";

const getCost = {
	[SubscriptionPlan.Free]: {
		[AllowanceType.Videos]: 5,
		[AllowanceType.StoryBooks]: 3,
		[AllowanceType.Credits]: 0.01,
	},
	[SubscriptionPlan.Basic]: {
		[AllowanceType.Videos]: 4,
		[AllowanceType.StoryBooks]: 2,
		[AllowanceType.Credits]: 0.01,
	},
	[SubscriptionPlan.Pro]: {
		[AllowanceType.Videos]: 3,
		[AllowanceType.StoryBooks]: 1.5,
		[AllowanceType.Credits]: 0.01,
	},
	[SubscriptionPlan.Premium]: {
		[AllowanceType.Videos]: 2,
		[AllowanceType.StoryBooks]: 1,
		[AllowanceType.Credits]: 0.01,
	},
	// Ideally this never occurs
	[SubscriptionPlan.Custom]: {
		[AllowanceType.Videos]: 2,
		[AllowanceType.StoryBooks]: 1,
		[AllowanceType.Credits]: 0.01,
	},
};

const allowanceStructure = {
	[AllowanceType.Credits]: {
		name: "",
	},
	[AllowanceType.Videos]: {
		name: "Video",
	},
	[AllowanceType.StoryBooks]: {
		name: "StoryBooks",
	},
};

const storyBooksQuantityValues = [1, 2, 5, 10] as const;
const videoQuantityValues = [1, 2, 5, 10] as const;
const creditQuantityValues = [100, 200, 500, 1000] as const;

// type QuantityValue = (typeof quantityValues)[number];

export interface CreditsCheckoutDialogProps {
	allowanceType: AllowanceType;
	defaultQuantity?: number;
	onClose: () => void;
	skipSubscriptionCheck?: boolean;
}

const CreditsCheckoutDialog = ({
	allowanceType,
	defaultQuantity,
	onClose,
	skipSubscriptionCheck = false,
}: CreditsCheckoutDialogProps) => {
	const { user, updateUserDataAfter1Second } = useUser();
	const { setupStripe, onAddCard, confirmPayment } = useStripeSetup();

	const [quantity, setQuantity] = useState(
		defaultQuantity ??
			(allowanceType === AllowanceType.StoryBooks
				? 1
				: allowanceType === AllowanceType.Videos
					? 1
					: 200)
	);
	const [amount, setAmount] = useState(0);
	const [itemCost, setItemCost] = useState(0);

	const [submitting, setSubmitting] = useState(false);
	const [stripeLoaded, setStripeLoaded] = useState(false);
	const [userWantsToChangePayment, setUserWantsToChangePayment] =
		useState(false);

	const quantityValues = useMemo(() => {
		let values =
			allowanceType === AllowanceType.StoryBooks
				? storyBooksQuantityValues
				: allowanceType === AllowanceType.Videos
					? videoQuantityValues
					: creditQuantityValues;

		if (defaultQuantity) {
			// @ts-ignore
			values = [...values, defaultQuantity];
		}

		return values;
	}, [allowanceType, defaultQuantity]);

	const userHasCard = user ? getUserHasCard(user) : false;
	const userSubscriptionPlan: SubscriptionPlan | undefined =
		user?.subscription?.subscriptionPlan;
	if (
		userSubscriptionPlan === SubscriptionPlan.Free &&
		!skipSubscriptionCheck
	) {
		throw new Error(
			"The user shouldn't open the credits modal when using the free plan"
		);
	}

	const showPaymentCard = userHasCard && !userWantsToChangePayment;
	const { invalidateUser } = useUpdateUser();

	const onRefillAllowance = async () => {
		if (submitting) return;

		setSubmitting(true);

		const handleCreditsSuccessful = () => {
			invalidateUser();
			toast.success("Credits Added successfully!");
			onClose();
		};

		try {
			if (!userHasCard || userWantsToChangePayment) {
				await onAddCard();
			}

			const { succeeded, data, status } = await api.payment.refillAllowance({
				allowanceType,
				quantity: quantity,
			});
			if (!succeeded) {
				console.error(`Create Credits backend failed, status = ${status}`);
				toast.error("Create Credits backend failed");
				return;
			}

			if (!data?.nextAction) {
				handleCreditsSuccessful();
				return;
			}

			// using 3d secure authentication
			// https://docs.stripe.com/testing#regulatory-cards
			if (data.nextAction.type !== "use_stripe_sdk") {
				if (data.succeeded && !data.requiresAction) {
					handleCreditsSuccessful();
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
					await api.payment.verifyPurchaseCredits({
						paymentIntentId: paymentIntent.id,
						allowanceType,
						quantity,
						amount,
					});

				if (confirmSucceeded) {
					handleCreditsSuccessful();
				} else {
					toast.error("Internal Server Error: please contact support.");
				}
			}
		} catch (e: any) {
			console.error("Error Paying Credits: ", e.message);
			toast.error("Error Paying Credits");
		} finally {
			setSubmitting(false);
		}
	};

	useEffect(() => {
		if (userSubscriptionPlan === undefined) {
			return;
		}
		setItemCost(getCost[userSubscriptionPlan][allowanceType]);
	}, [userSubscriptionPlan, allowanceType]);

	useEffect(() => {
		setAmount(quantity * itemCost);
	}, [quantity, itemCost]);

	const structure = allowanceStructure[allowanceType];

	return (
		<CheckoutDialogContent
			title={
				<>
					<span>Buy</span>
					<Select
						value={String(quantity)}
						onValueChange={(newValue) => setQuantity(Number(newValue))}
					>
						<SelectTrigger className="w-[75px] font-normal">
							<SelectValue aria-label={String(quantity)}>
								{quantity}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{quantityValues.map((value) => (
								<SelectItem key={value} value={String(value)}>
									{value}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<span>{structure.name} Credits</span>
				</>
			}
			sideLabel="Order #40950"
			description=""
			items={[
				{
					id: uuidv4(),
					description: `$${itemCost} x ${quantity} ${structure.name} credits`,
					price: `$${amount}`,
				},
			]}
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
			total={`$${amount}`}
			submitButtonText="Submit Payment"
			buttonProps={{
				disabled: !stripeLoaded || submitting,
				onClick: () => onRefillAllowance(),
			}}
		/>
	);
};

export default CreditsCheckoutDialog;
