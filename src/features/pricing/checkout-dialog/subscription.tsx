import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import api from "@/api";
import { Button } from "@/components/ui/button";
import StripeForm from "@/features/pricing/stripe-form";
import PaymentCard, { getUserHasCard } from "@/features/pricing/payment-card";
import { SubscriptionPlan, SubscriptionPeriod } from "@/utils/enums";
import { useStripeSetup, useUser } from "../hooks";
import CheckoutDialogContent from "./content";

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
			label: "$120 / Year",
			item: {
				description: "Basic Annual",
				price: 120,
			},
		},
	},
	[SubscriptionPlan.Pro]: {
		[SubscriptionPeriod.Monthly]: {
			title: "Pro Subscription",
			label: "$80 / Month",
			item: {
				description: "Pro Monthly",
				price: 80,
			},
		},
		[SubscriptionPeriod.Annual]: {
			title: "Pro Subscription",
			label: "$960 / Year",
			item: {
				description: "Pro Annual",
				price: 960,
			},
		},
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
	const userHasPaidSubscription =
		user?.subscription?.subscriptionPlan !== SubscriptionPlan.Free;

	const { title, label, item } = pricingStructure[plan][period];

	const onCreateSubscription = async () => {
		if (submitting) return;

		setSubmitting(true);

		const handleSubscriptionSuccessful = () => {
			toast.success("Subscription successful!");
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

	const cancelSubscription = () => {
		try {
			api.payment.cancelSubscription().then();

			updateUserDataAfter1Second();
		} catch (e: any) {
			console.error("Error Canceling Subscription: ", e.message);
			toast.error("Error Canceling Subscription");
		}
	};

	// testing code
	const [hideOnlyForTestingPart, setHideOnlyForTestingPart] = useState(true);
	useEffect(() => {
		setTimeout(() => {
			setHideOnlyForTestingPart(false);
		}, 2000);
	}, []);

	const showPaymentCard = userHasCard && !userWantsToChangePayment;

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

					{!userWantsToChangePayment && !hideOnlyForTestingPart && (
						<div className="mt-20">
							<div className="mb-2">
								<div>
									<strong>Only for testing</strong>
									<br />
									<button onClick={() => setHideOnlyForTestingPart(true)}>
										Click to hide
									</button>
								</div>
								User plan:{" "}
								{user?.subscription?.subscriptionPlan === SubscriptionPlan.Free
									? "Free"
									: user
										? pricingStructure[
												user.subscription?.subscriptionPlan as Exclude<
													SubscriptionPlan,
													SubscriptionPlan.Free
												>
											][
												user.subscription
													?.subscriptionPeriod as SubscriptionPeriod
											].title
										: null}
							</div>

							{user?.subscription?.subscriptionPlan !==
								SubscriptionPlan.Free && (
								<Button onClick={() => cancelSubscription()}>
									Cancel Subscription
								</Button>
							)}
						</div>
					)}
				</>
			}
			submitButtonText="Subscribe"
			buttonProps={{
				onClick: () => onCreateSubscription(),
				disabled: !stripeLoaded || userHasPaidSubscription,
			}}
		/>
	);
};

export default SubscriptionCheckoutDialog;
