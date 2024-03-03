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
      description: string;
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
      label: "$12 / Month",
      description: "When you grow, need more power and flexibility.",
      items: [
        {
          description: "Starter Monthly",
          price: "$12",
        },
      ],
      total: "$12",
    },
    [SubscriptionPeriod.Annual]: {
      title: "Starter Subscription",
      label: "$108 / Year",
      description: "When you grow, need more power and flexibility.",
      items: [
        {
          description: "Monthly",
          price: "$9 / month",
        },
        {
          description: "Billed annually (x12)",
          price: "$108 / year",
        },
      ],
      total: "$108",
    },
  },
  [SubscriptionPlan.Pro]: {
    [SubscriptionPeriod.Monthly]: {
      title: "Creator Subscription",
      label: "$80 / Month",
      description: "More videos. More stories. Faster generation times.",
      items: [
        {
          description: "Creator Monthly",
          price: "$80",
        },
      ],
      total: "$80",
    },
    [SubscriptionPeriod.Annual]: {
      title: "Creator Subscription",
      label: "$720 / Year",
      description: "More videos. More stories. Faster generation times.",
      items: [
        {
          description: "Monthly",
          price: "$60 / month",
        },
        {
          description: "Billed annually (x12)",
          price: "$720 / year",
        },
      ],
      total: "$720",
    },
  },
  [SubscriptionPlan.Premium]: {
    [SubscriptionPeriod.Monthly]: {
      title: "Professional Subscription",
      label: "$1300 / Month",
      description:
        "Maximum power and flexibility for large-scale content generation needs.",
      items: [
        {
          description: "Professional Monthly",
          price: "$1300",
        },
      ],
      total: "$1300",
    },
    [SubscriptionPeriod.Annual]: {
      title: "Professional Subscription",
      label: "$12000 / Year",
      description:
        "Maximum power and flexibility for large-scale content generation needs.",
      items: [
        {
          description: "Monthly",
          price: "$1000 / month",
        },
        {
          description: "Billed annually (x12)",
          price: "$12000 / year",
        },
      ],
      total: "$12000",
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

  const { title, label, items, total, description } =
    pricingStructure[plan][period];

  const submitButtonText = `Pay ${total}`;

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
        disabled: !stripeLoaded || userHasPaidSubscription,
      }}
    />
  );
};

export default SubscriptionCheckoutDialog;
