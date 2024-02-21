"use client";
import api from "@/api";
import cn from "@/utils/cn";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import StripeForm from "@/features/pricing/stripe-form";
import { useStripeSetup } from "@/features/pricing/hooks";

import styles from "./pricing.module.css";
import { SubscriptionPeriod, SubscriptionPlan } from "@/utils/enums";
import { Button } from "@/components/ui/button";
import { mainSchema } from "@/api/schema";
import PaymentCard, { getUserHasCard } from "@/features/pricing/payment-card";

const base_url = "http://localhost:3000/";

export default function PricingPage() {
	const searchParams = useSearchParams();
	const { setupStripe, confirmSetup, confirmPayment } = useStripeSetup();

	// todo: refactor into something like "const [user] = useGetUser();"
	const [user, setUser] = useState<mainSchema["UserInfoDTO"] | null>(null);

	const [userWantsToChangePayment, setUserWantsToChangePayment] =
		useState<boolean>(false);

	const queryPlan = searchParams.get("plan");
	const queryPeriod = searchParams.get("period");

	const [submitting, setSubmitting] = useState(false);
	const [subscriptionPlan, setSubscriptionPlan] =
		useState<SubscriptionPlan | null>(null);
	const [subscriptionPeriod, setSubscriptionPeriod] =
		useState<SubscriptionPeriod | null>(null);

	useEffect(() => {
		const plan = Number(queryPlan);
		const period = Number(queryPeriod);

		if (plan !== null && period !== null) {
			setSubscriptionPlan(plan);
			setSubscriptionPeriod(period);
		} else {
			console.error("Invalid subscription plan or period");
		}
	}, [queryPlan, queryPeriod]);

	useEffect(() => {
		(async () => {
			const user = await api.user.get();
			if (user.data) {
				setUser(user.data);
			}
		})();
	}, []);

	const onAddCard = async () => {
		setSubmitting(true);

		try {
			const { error } = (await confirmSetup(`${base_url}/pricing`)) || {};
			if (error) {
				console.error("Confirm Setup failed: ", error);
				return;
			}
		} finally {
			setSubmitting(false);
		}
	};

	const onCreateSubscription = async () => {
		if (submitting || subscriptionPlan === null || subscriptionPeriod === null)
			return;

		setSubmitting(true);

		try {
			const { error } = (await confirmSetup(`${base_url}/pricing`)) || {};
			if (error) {
				console.error("Confirm Setup failed: ", error);
				return;
			}

			const { succeeded } = await api.payment.createSubscription({
				subscriptionPlan,
				subscriptionPeriod,
			});
			if (!succeeded) {
				console.error("Create Subscription backend failed: ");
				return;
			}

			const { error: stripeError } = await confirmPayment();
			if (stripeError) {
				console.error("Stripe failed confirming payment: ", stripeError);
				return;
			}
		} catch (e: any) {
			console.error("Error Paying Subscription: ", e.message);
		} finally {
			setSubmitting(false);
		}
	};

	if (subscriptionPlan === null || subscriptionPeriod === null || !user) {
		return null;
	}

	const userHasCard = getUserHasCard(user);
	const userHasPaidSubscription =
		user.subscription?.subscriptionPlan !== SubscriptionPlan.Free;

	return (
		<div
			className={cn("flex flex-col w-full items-center", styles.fancyOverlay)}
		>
			<div className="w-full flex flex-col items-center">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center">
					<div className="w-full lg:w-auto mx-auto max-w-4xl lg:text-center">
						<h1 className="text-black dark:text-white text-4xl font-semibold max-w-xs sm:max-w-none md:text-6xl !leading-tight">
							Checkout
						</h1>
					</div>

					<div>Subscription plan: {SubscriptionPlan[subscriptionPlan]}</div>
					<div>
						Subscription period: {SubscriptionPeriod[subscriptionPeriod]}
					</div>

					{!userHasCard || userWantsToChangePayment ? (
						<div>
							<StripeForm setupStripe={setupStripe} />
							<Button
								size="lg"
								disabled={submitting}
								className={cn(
									"w-full text-black dark:text-white bg-purple-300 hover:bg-purple-400 dark:bg-purple-600 dark:hover:bg-purple-700 mt-5",
									submitting
										? "bg-white dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-black"
										: ""
								)}
								onClick={onAddCard}
								variant="default"
							>
								Add card
							</Button>
						</div>
					) : (
						<div>
							<PaymentCard
								editable
								onEdit={() => setUserWantsToChangePayment(true)}
							/>
							<Button
								size="lg"
								disabled={submitting}
								className={cn(
									"w-full text-black dark:text-white bg-purple-300 hover:bg-purple-400 dark:bg-purple-600 dark:hover:bg-purple-700 mt-5",
									submitting
										? "bg-white dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-black"
										: ""
								)}
								onClick={onCreateSubscription}
								variant="default"
							>
								Create subscription
							</Button>
						</div>
					)}

					<div className="mt-20">
						<div>
							{userHasPaidSubscription
								? "User have paid subscription"
								: "User have free subscription"}
						</div>
						{userHasPaidSubscription && (
							<div>
								<div>
									<span>User plan: {user.subscription?.subscriptionPlan}</span>
								</div>
								<Button onClick={() => api.payment.cancelSubscription()}>
									Cancel Subscription
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
