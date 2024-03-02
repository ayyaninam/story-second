import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { SubscriptionConstants } from "@/constants/subscription-constants";

import UpgradeSubscriptionDialog from "@/features/pricing/upgrade-subscription-dialog";
import UnsubscribeButton from "@/features/account/components/unsubscribe-button";
import PaymentCard, { getUserHasCard } from "@/features/pricing/payment-card";
import StripeForm from "@/features/pricing/stripe-form";
import { useStripeSetup, useUser } from "@/features/pricing/hooks";

type View = "no-subscription" | "has-subscription" | null;

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
				<div className="mt-2 w-80">
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
	const { user } = useUser();
	const [view, setView] = useState<View>(null);

	const [userIsEditing, setUserIsEditing] = useState(false);

	const subscriptionPlan = user?.subscription?.subscriptionPlan ?? 0;
	const userHasPaidSubscription = subscriptionPlan !== 0;
	const plan = SubscriptionConstants[subscriptionPlan]!;

	useEffect(() => {
		setView(userHasPaidSubscription ? "has-subscription" : "no-subscription");
	}, [userHasPaidSubscription]);

	if (!view) {
		return null;
	}

	return (
		<div>
			{view === "has-subscription" && (
				<>
					<span className="font-medium text-[#181d25] text-2xl">$20.00</span>
					<span className="font-light text-[#485e6a] text-[22px] leading-[33px] ml-1">
						/mo
					</span>

					<div className="font-medium text-[15px] text-accent-500 leading-[20px]">
						{plan.name} Monthly/Annual Subscription
					</div>

					<div className="flex flex-row gap-2 mt-2">
						<UpgradeSubscriptionDialog>
							<Button
								variant="outline"
								className="font-medium text-accent-600 text-[15px] leading-[20px]"
							>
								Change plan
							</Button>
						</UpgradeSubscriptionDialog>

						<UnsubscribeButton />
					</div>
				</>
			)}
			{view === "no-subscription" && !userIsEditing && (
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
