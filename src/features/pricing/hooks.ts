import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import api from "@/api";
import { Stripe, StripeElements } from "@stripe/stripe-js";
import { mainSchema } from "@/api/schema";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";
import { SubscriptionPlan } from "@/utils/enums";
import {env} from "@/env.mjs";

export const useStripeSetup = () => {
	const [stripe, setStripe] = useState<Stripe>();
	const [elements, setElements] = useState<StripeElements>();

	const setupStripe = (stripe: Stripe, elements: StripeElements) => {
		setStripe(stripe);
		setElements(elements);
	};

	const confirmPayment = async (paymentIntentClientSecret: string) => {
		if (!stripe || !paymentIntentClientSecret) {
			throw new Error("Stripe.js has not loaded yet.");
		}

		return await stripe.confirmCardPayment(paymentIntentClientSecret);
	};

	const confirmSetup = async (return_url: string) => {
		if (!stripe || !elements) {
			throw new Error("Stripe.js has not loaded yet.");
		}

		const { error, setupIntent } = await stripe.confirmSetup({
			elements,
			confirmParams: {
				return_url,
			},
			redirect: "if_required",
		});

		await api.payment.syncCards();

		return { error, setupIntent };
	};

	const onAddCard = async () => {
		try {
			const base_url = env.NEXT_PUBLIC_BASE_URL;
			const { error } = (await confirmSetup(`${base_url}/pricing`)) || {};
			if (error) {
				console.error("Confirm Setup failed: ", error);
				toast.error("Confirm Setup failed");
				return;
			}

			toast.success("Added card successfully");
		} catch (e: any) {
			console.error("Error Adding Card: ", e.message);
			toast.error("Error Adding Card");
		}
	};

	return { setupStripe, confirmPayment, onAddCard, confirmSetup };
};

export const useUser = () => {
	const {
		data,
		isPending: isLoading,
		refetch,
	} = useQuery({
		queryKey: [QueryKeys.USER],
		queryFn: () => api.user.get(),
	});

	const [user, setUser] = useState<mainSchema["UserInfoDTO"] | null>(null);
	const [error, setError] = useState<unknown>(null);

	const userHasPaidSubscription =
		user?.subscription?.subscriptionPlan !== SubscriptionPlan.Free &&
		user?.subscription?.subscriptionPlan !== undefined;

	const updateUserDataAfter1Second = () => {
		setTimeout(() => {
			refetch().then();
		}, 1000);
	};

	useEffect(() => {
		setUser(data?.data ?? null);
	}, [data]);

	return {
		user,
		updateUserDataAfter1Second,
		userHasPaidSubscription,
		isLoading,
		error,
	};
};
