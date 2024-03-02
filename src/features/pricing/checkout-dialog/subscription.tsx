import toast from "react-hot-toast";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import api from "@/api";
import StripeForm from "@/features/pricing/stripe-form";
import PaymentCard, { getUserHasCard } from "@/features/pricing/payment-card";
import { SubscriptionPlan, SubscriptionPeriod } from "@/utils/enums";
import { useStripeSetup, useUser } from "../hooks";
import CheckoutDialogContent from "./content";

type PricingStructure = Record<
  Exclude<SubscriptionPlan, SubscriptionPlan.Free>,
  Record<
    SubscriptionPeriod,
    {
      title: string;
      label: string;
      items: {
        description: string;
        price: string;
      }[];
      total: string;
    }
  >
>;

const pricingStructure: PricingStructure = {
  [SubscriptionPlan.Basic]: {
    [SubscriptionPeriod.Monthly]: {
      title: "Starter Subscription",
      label: "$11.99 / Month",
      items: [
        {
          description: "Starter Monthly",
          price: "$11.99",
        },
      ],
      total: "$11.99",
    },
    [SubscriptionPeriod.Annual]: {
      title: "Starter Subscription",
      label: "$119.99 / Year",
      items: [
        {
          description: "Monthly",
          price: "$9.99 / month",
        },
        {
          description: "Billed annually (x12)",
          price: "$119.99",
        },
      ],
      total: "$120",
    },
  },
  [SubscriptionPlan.Pro]: {
    [SubscriptionPeriod.Monthly]: {
      title: "Creator Subscription",
      label: "$79.99 / Month",
      items: [
        {
          description: "Creator Monthly",
          price: "$79.99",
        },
      ],
      total: "$79.99",
    },
    [SubscriptionPeriod.Annual]: {
      title: "Creator Subscription",
      label: "$719.99 / Year",
      items: [
        {
          description: "Monthly",
          price: "$59.99 / month",
        },
        {
          description: "Creator Annual",
          price: "$719.99",
        },
      ],
      total: "$719.99",
    },
  },
  [SubscriptionPlan.Premium]: {
    [SubscriptionPeriod.Monthly]: {
      title: "Enterprise Subscription",
      label: "$999.99 / Month",
      items: [
        {
          description: "Enterprise Monthly",
          price: "$999.99",
        },
      ],
      total: "$999.99",
    },
    [SubscriptionPeriod.Annual]: {
      title: "Enterprise Subscription",
      label: "$9599.99 / Year",
      items: [
        {
          description: "Monthly",
          price: "$799.99 / month",
        },
        {
          description: "Enterprise Annual",
          price: "$9599.99",
        },
      ],
      total: "$9599.99",
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
  const showPaymentCard = userHasCard && !userWantsToChangePayment;

  const { title, label, items, total } = pricingStructure[plan][period];

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
      submitButtonText="Subscribe"
      buttonProps={{
        onClick: () => onCreateSubscription(),
        disabled: !stripeLoaded || userHasPaidSubscription,
      }}
    />
  );
};

export default SubscriptionCheckoutDialog;
