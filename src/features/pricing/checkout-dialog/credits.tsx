import React, { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useStripeSetup } from "../hooks";
import CheckoutDialogView from "./view";

const videoCreditValues = [5, 10, 20, 50] as const;
type VideoCreditValue = (typeof videoCreditValues)[number];

export interface CreditsCheckoutDialogProps {
	children: React.ReactNode;
}

const CreditsCheckoutDialog = ({ children }: CreditsCheckoutDialogProps) => {
	const { setupStripe, confirmSetup, confirmPayment } = useStripeSetup();
	const [videoCredit, setVideoCredit] = useState<VideoCreditValue>(10);

	return (
		<CheckoutDialogView
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
			sideHeader="Order #40950"
			setupStripe={setupStripe}
			submitButtonText="Submit Payment"
		>
			{children}
		</CheckoutDialogView>
	);
};

export default CreditsCheckoutDialog;
