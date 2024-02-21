import api from "@/api";
import { useState } from "react";
import { Stripe, StripeElements } from "@stripe/stripe-js";

export const useStripeSetup = () => {
	const [stripe, setStripe] = useState<Stripe>();
	const [elements, setElements] = useState<StripeElements>();
	const [clientSecret, setClientSecret] = useState("");

	const setupStripe = (
		stripe: Stripe,
		elements: StripeElements,
		clientSecret: string
	) => {
		setStripe(stripe);
		setElements(elements);
		setClientSecret(clientSecret);
	};

	const confirmPayment = async () => {
		if (!stripe || !clientSecret) {
			throw new Error("Stripe.js has not loaded yet.");
		}

		return await stripe.confirmCardPayment(clientSecret);
	};

	const confirmSetup = async (return_url: string) => {
		if (!stripe || !elements) return;

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
