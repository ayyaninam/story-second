import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import UpgradeSubscriptionDialog from "@/features/pricing/upgrade-subscription-dialog";
import UnsubscribeButton from "@/features/account/components/unsubscribe-button";
import PaymentCard, { getUserHasCard } from "@/features/pricing/payment-card";
import StripeForm from "@/features/pricing/stripe-form";
import { useStripeSetup, useUser } from "@/features/pricing/hooks";
import { pricingValues, PricingDetails } from "@/features/pricing/constants";
import { SubscriptionPeriod } from "@/utils/enums";
import { Skeleton } from "@/components/ui/skeleton";

interface BillingInfoProps {
	userIsEditing: boolean;
	setUserIsEditing: (userIsEditing: boolean) => void;
}

const BillingInfo = ({ userIsEditing, setUserIsEditing }: BillingInfoProps) => {
	const { user, updateUserDataAfter1Second } = useUser();

	const { setupStripe, onAddCard } = useStripeSetup();
	const [stripeLoaded, setStripeLoaded] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const userHasCard = user ? getUserHasCard(user) : false;

	const handleAddCard = async () => {
		setSubmitting(true);
		try {
			await onAddCard();
			updateUserDataAfter1Second();
		} catch (e) {
			toast.error("Error Adding Card");
		} finally {
			setSubmitting(false);
			setUserIsEditing(false);
		}
	};
	const text = userHasCard ? "Edit" : "Add";

	return (
		<>
			{userHasCard && !userIsEditing ? (
				<div className="mt-2 md:w-80 w-full">
					<div className="font-medium text-xl mt-4 mb-2">My card</div>

					<PaymentCard
						editable
						onEdit={() => setUserIsEditing(true)}
						onRemove={() => updateUserDataAfter1Second()}
					/>
				</div>
			) : (
				<div className="flex flex-col items-start">
					<div className="font-medium text-xl mt-4">{text} payment method</div>

					<StripeForm
						setupStripe={setupStripe}
						onLoadStripe={() => setStripeLoaded(true)}
					/>

					<Button
						variant="accent"
						className="w-full max-w-40 mt-4 self-center"
						onClick={() => handleAddCard()}
						disabled={!stripeLoaded || submitting}
					>
						{text} Card
					</Button>
				</div>
			)}
		</>
	);
};

const Billing = () => {
	const { user, userHasPaidSubscription } = useUser();

	const [userIsEditing, setUserIsEditing] = useState(false);

	const subscriptionPlan = user?.subscription?.subscriptionPlan;
	const subscriptionPeriod = user?.subscription?.subscriptionPeriod;
	const plan: PricingDetails | undefined =
		// @ts-ignore
		pricingValues?.[subscriptionPlan]?.[subscriptionPeriod];

	const userHasCard = user ? getUserHasCard(user) : false;

	if (!user) {
		return (
			<div className="flex flex-col gap-2 mt-4">
				<Skeleton className="w-[150px] h-[24px] rounded-md" />
				<Skeleton className="w-[100px] h-[24px] rounded-md" />
				<Skeleton className="w-[125px] h-[24px] rounded-md" />
			</div>
		);
	}

	return (
		<div>
			<span className="font-medium text-[#181d25] text-2xl">
				{userHasPaidSubscription ? plan?.itemMonthly || "$0" : "$0"}
			</span>
			<span className="font-light text-[#485e6a] text-[22px] leading-[33px] ml-1">
				/mo
			</span>

			<div className="font-medium text-[15px] text-accent-500 leading-[20px]">
				{userHasPaidSubscription
					? `${plan?.title || "Custom Plan"} ${subscriptionPeriod === SubscriptionPeriod.Annual ? "Annually" : "Monthly"}`
					: "Free plan"}
			</div>

			{userHasPaidSubscription && (
				<div className="flex flex-row gap-2 mt-2">
					<UpgradeSubscriptionDialog>
						<Button className="font-medium text-white bg-accent-600 hover:bg-accent-700 text-[15px] leading-[20px]">
							Change plan
						</Button>
					</UpgradeSubscriptionDialog>

					<UnsubscribeButton />
				</div>
			)}

			{!userHasPaidSubscription && !userIsEditing && userHasCard && (
				<UpgradeSubscriptionDialog>
					<Button variant="accent" className="w-60 mt-4 self-center">
						Upgrade Subscription
					</Button>
				</UpgradeSubscriptionDialog>
			)}

			<BillingInfo
				userIsEditing={userIsEditing}
				setUserIsEditing={setUserIsEditing}
			/>
		</div>
	);
};

export default Billing;
