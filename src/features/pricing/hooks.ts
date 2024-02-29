import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import api from "@/api";
import { Stripe, StripeElements } from "@stripe/stripe-js";
import { mainSchema } from "@/api/schema";

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
			const base_url = "http://localhost:3000/"; // todo: think how this is working, or when do it get used
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

	return { setupStripe, confirmPayment, onAddCard };
};

export const useUser = () => {
	const [user, setUser] = useState<mainSchema["UserInfoDTO"] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<unknown>(null);

	const updateUserData = async () => {
		setIsLoading(true);
		try {
			const { data } = await api.user.get();
			if (data) {
				setUser(data);
				setError(null);
			} else {
				throw new Error("user data does not exist");
			}
		} catch (err) {
			setError(err);
			setUser(null);
		} finally {
			setIsLoading(false);
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

	return { user, updateUserDataAfter1Second, isLoading, error };
};
