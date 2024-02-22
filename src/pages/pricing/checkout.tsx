"use client";
import api from "@/api";
import cn from "@/utils/cn";
import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import StripeForm from "@/features/pricing/stripe-form";
import { useStripeSetup } from "@/features/pricing/hooks";

import styles from "./pricing.module.css";
import { SubscriptionPeriod, SubscriptionPlan } from "@/utils/enums";
import { Button } from "@/components/ui/button";
import { mainSchema } from "@/api/schema";
import PaymentCard, { getUserHasCard } from "@/features/pricing/payment-card";
import { useRouter } from "next/router";

const base_url = "http://localhost:3000/";

export default function PricingPage() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const { setupStripe, confirmSetup, confirmPayment } = useStripeSetup();

	// todo: refactor into something like "const [user] = useGetUser();"
	const [user, setUser] = useState<mainSchema["UserInfoDTO"] | null>(null);

	const [userWantsToChangePayment, setUserWantsToChangePayment] =
		useState(false);

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

	const updateUserData = async () => {
		const user = await api.user.get();
		if (user.data) {
			setUser(user.data);
		}
	};

	const updateUserDataAfter1Second = () => {
		setTimeout(() => {
			updateUserData().then();
		}, 1000);
	};

	useEffect(() => {
		updateUserData().then();
	}, []);

	const onAddCard = async () => {
		setSubmitting(true);

		try {
			const { error } = (await confirmSetup(`${base_url}/pricing`)) || {};
			if (error) {
				console.error("Confirm Setup failed: ", error);
				toast.error("Confirm Setup failed");
				return;
			}

			toast.success("Added card successfully");
			updateUserDataAfter1Second();
		} catch (e: any) {
			console.error("Error Adding Card: ", e.message);
			toast.error("Error Adding Card");
		} finally {
			setSubmitting(false);
		}
	};

	const onCreateSubscription = async () => {
		if (submitting || subscriptionPlan === null || subscriptionPeriod === null)
			return;

		setSubmitting(true);

		try {
			const { succeeded, data } = await api.payment.createSubscription({
				subscriptionPlan,
				subscriptionPeriod,
			});
			if (!succeeded) {
				console.error("Create Subscription backend failed: ");
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
					updateUserDataAfter1Second();
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
						subscriptionPlan,
						subscriptionPeriod,
					});

				if (confirmSucceeded) {
					toast.success("Subscription successful!");
					updateUserDataAfter1Second();
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

	const cancelSubscription = () => {
		try {
			api.payment.cancelSubscription().then();

			updateUserDataAfter1Second();
		} catch (e: any) {
			console.error("Error Canceling Subscription: ", e.message);
			toast.error("Error Canceling Subscription");
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
							<div className="hidden">
								{/* setupStripe must run, this is the reason for this trick */}
								<StripeForm setupStripe={setupStripe} />
							</div>
							<PaymentCard
								editable
								onEdit={() => setUserWantsToChangePayment(true)}
								onRemove={() => updateUserDataAfter1Second()}
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
								: "User does not have paid subscription"}
						</div>
						{userHasPaidSubscription && (
							<div>
								<div>
									<span>User plan: {user.subscription?.subscriptionPlan}</span>
								</div>
								<Button onClick={() => cancelSubscription()}>
									Cancel Subscription
								</Button>
							</div>
						)}
					</div>

					<Button className="mt-10" onClick={() => router.back()}>
						go back
					</Button>
				</div>
			</div>
		</div>
	);
}
