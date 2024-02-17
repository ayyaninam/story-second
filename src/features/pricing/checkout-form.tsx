import { useState, FormEventHandler } from "react";
import { env } from "@/env.mjs";
import {
	CardElement,
	Elements,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";
import { StripeCardElementChangeEvent, loadStripe } from "@stripe/stripe-js";
import { getJwt } from "@/utils/jwt";
import api from "@/api";
import { mainSchema } from "@/api/schema";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

interface CheckoutFormProps {
	priceId: string;
}

enum SubscriptionPlan {
	Free,
	Basic,
	Pro,
	Premium,
}

enum SubscriptionPeriod {
	Monthly,
	Annual,
}

const Form = ({ priceId }: CheckoutFormProps) => {
	const [error, setError] = useState<string | undefined>(undefined);
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const stripe = useStripe();
	const elements = useElements();

	const handleCardInputChange = (event: StripeCardElementChangeEvent) => {
		setDisabled(event.empty);
		setError(event.error ? event.error.message : "");
	};

	const handleCheckoutFormSubmit: FormEventHandler<HTMLFormElement> = async (
		event
	) => {
		event.preventDefault();
		setLoading(true);

		if (!stripe || !elements) {
			setError("Stripe.js has not loaded yet.");
			setLoading(false);
			return;
		}

		try {
			const { data, succeeded } = await api.payment.createSubscription({
				subscriptionPlan: SubscriptionPlan.Basic,
				subscriptionPeriod: SubscriptionPeriod.Annual,
			});

			console.log(data);

			if (succeeded) {
				console.log("congrats!");
				alert("congrats!");
			}

			// todo: might need to add something like
			// const { error: stripeError } = await stripe.confirmCardPayment(
			// 	subscription.clientSecret
			// );
			//
			// if (stripeError) {
			// 	setError(stripeError.message);
			// } else {
			// 	console.log("congrats!");
			// 	alert("congrats!");
			// }
		} catch (error) {
			setError(error instanceof Error ? error.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleCheckoutFormSubmit}>
			<CardElement onChange={handleCardInputChange} />
			<button disabled={!stripe || disabled || loading} type="submit">
				Pay Now
			</button>
			{error && <div className="error">{error}</div>}
		</form>
	);
};

const CheckoutForm = (props: CheckoutFormProps) => (
	<div className="bg-gray-300 p-2">
		<Elements stripe={stripePromise}>
			<Form {...props} />
		</Elements>
	</div>
);

export default CheckoutForm;
