import {
	Elements,
	PaymentElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import { Appearance, loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { env } from "@/env.mjs";
import api from "@/api";
import { useStripeSetup } from "@/features/pricing/hooks";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const StripeAppearance: Appearance = {
	theme: "stripe",
	labels: "above",
	variables: {
		fontFamily: "system-ui",
		colorBackground: "#F2E6D4",
		colorTextPlaceholder: "#A1B8B3",
		borderRadius: "12px",
	},
	rules: {
		".Input": {
			border: "2px solid #002E23",
		},
		".Input:focus": {
			border: "2px solid #D57D5A",
			outline: "2px solid white",
		},
		".Label": {
			fontWeight: "600",
			marginLeft: "1rem",
			fontSize: "14px",
		},
	},
};

type SetupStripe = ReturnType<typeof useStripeSetup>["setupStripe"];

const StripeElement = ({
	setupStripe,
	onFormReady,
}: {
	setupStripe: SetupStripe;
	onFormReady: () => void;
}) => {
	const stripe = useStripe();
	const elements = useElements();

	useEffect(() => {
		if (stripe && elements) {
			setupStripe(stripe, elements);
		}
	}, [stripe, elements]);

	return (
		<PaymentElement className="w-full" onLoaderStart={() => onFormReady()} />
	);
};

const LoadingIndicator = () => <div>Loading...</div>;

export default function StripeForm({
	setupStripe,
}: {
	setupStripe: SetupStripe;
}) {
	const [clientSecret, setClientSecret] = useState("");
	const [stripeFormReady, setStripeFormReady] = useState(false);

	useEffect(() => {
		if (clientSecret) return;

		(async () => {
			try {
				setClientSecret((await api.payment.addCard()).data!);
			} catch (e: any) {
				// TODO: Handle no client secret error.
				console.error(e);
			}
		})();
	}, [clientSecret]);

	return (
		<div className="flex w-full flex-col relative min-h-[280px]">
			{clientSecret ? (
				<Elements
					stripe={stripePromise}
					options={{ appearance: StripeAppearance, clientSecret }}
				>
					<StripeElement
						setupStripe={setupStripe}
						onFormReady={() => setStripeFormReady(true)}
					/>
				</Elements>
			) : null}
			{stripeFormReady ? null : (
				<div className="absolute flex z-[1] inset-0">
					<LoadingIndicator />
				</div>
			)}
		</div>
	);
}
