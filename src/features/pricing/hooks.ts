import api from "@/api";
import { useState } from "react";
import { Stripe, StripeElements } from "@stripe/stripe-js";

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

	return { setupStripe, confirmSetup, confirmPayment };
};
