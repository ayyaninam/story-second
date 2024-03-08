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

const appearance: Appearance = {
	theme: "flat",
	variables: {
		colorPrimary: "#6681FF",
		colorBackground: "white", // todo: implement dark mode
		colorTextPlaceholder: "#485E6A",
		borderRadius: "8px",
	},
	rules: {
		".Input": {
			border: "1px solid #CBD9E1",
		},
		".Label": {
			fontWeight: "500",
			fontFamily: "var(--font-rand)",
			fontSize: "1rem",
			color: "#021017",
		},
	},
};

export type SetupStripe = ReturnType<typeof useStripeSetup>["setupStripe"];

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
		// eslint-disable-next-line
	}, [stripe, elements]);

	return (
		<PaymentElement className="w-full" onLoaderStart={() => onFormReady()} />
	);
};

const LoadingIndicator = () => <div></div>;

export default function StripeForm({
	clientSecret,
	setupStripe,
}: {
	clientSecret: string;
	setupStripe: SetupStripe;
}) {
	const [ready, setReady] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (ready) {
			// onLoadStripe?.();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ready]);

	useEffect(() => {
		console.log("rerender");
	});

	return (
		<div className="flex w-full flex-col relative min-h-[280px]">
			{clientSecret ? (
				<Elements stripe={stripePromise} options={{ appearance, clientSecret }}>
					<StripeElement
						setupStripe={setupStripe}
						onFormReady={() => setReady(true)}
					/>
				</Elements>
			) : null}
			{!ready && (
				<div className="absolute flex z-[1] inset-0">
					<LoadingIndicator />
				</div>
			)}
			{error && <div>Error Loading Stripe</div>}
		</div>
	);
}
