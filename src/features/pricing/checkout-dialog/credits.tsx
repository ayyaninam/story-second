import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import StripeForm from "@/features/pricing/stripe-form";
import { useStripeSetup } from "../hooks";
import CheckoutDialogContent from "./view";

const videoCreditValues = [5, 10, 20, 50] as const;
type VideoCreditValue = (typeof videoCreditValues)[number];

export interface CreditsCheckoutDialogProps {}

const CreditsCheckoutDialog = ({}: CreditsCheckoutDialogProps) => {
	const { setupStripe, confirmSetup, confirmPayment } = useStripeSetup();
	const [stripeLoaded, setStripeLoaded] = useState(false);
	const [videoCredit, setVideoCredit] = useState<VideoCreditValue>(10);

	return (
		<CheckoutDialogContent
			title={
				<>
					<span>Buy</span>
					<Select
						value={String(videoCredit)}
						onValueChange={(newValue) =>
							setVideoCredit(Number(newValue) as VideoCreditValue)
						}
					>
						<SelectTrigger className="w-[60px] font-normal">
							<SelectValue aria-label={String(videoCredit)}>
								{videoCredit}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{videoCreditValues.map((value) => (
								<SelectItem key={value} value={String(value)}>
									{value}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<span>Video Credits</span>
				</>
			}
			sideLabel="Order #40950"
			items={[
				{
					id: uuidv4(),
					description: `${videoCredit} video credits`,
					price: `$${videoCredit}`,
				},
			]}
			stripeForm={
				<StripeForm
					setupStripe={setupStripe}
					onLoadStripe={() => setStripeLoaded(true)}
				/>
			}
			total={`$${videoCredit}`}
			submitButtonText="Submit Payment"
			buttonProps={{
				disabled: !stripeLoaded,
				// onClick: () => onCreateCredits(),
			}}
		/>
	);
};

export default CreditsCheckoutDialog;
