import React, { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useStripeSetup } from "@/features/pricing/hooks";
import CheckoutDialogView from "@/features/pricing/checkout-dialog/view";

const videoCreditValues = [5, 10, 20, 50] as const;
type VideoCreditValue = (typeof videoCreditValues)[number];

const Variants = ["credits", "subscription"] as const;
type CheckoutDialogVariant = (typeof Variants)[number];

interface CheckoutDialogProps {
	children: React.ReactNode;
	variant: CheckoutDialogVariant;
}

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
	children,
	variant,
}) => {
	const { setupStripe, confirmSetup, confirmPayment } = useStripeSetup();
	const [videoCredit, setVideoCredit] = useState<VideoCreditValue>(10);

	return (
		<CheckoutDialogView
			title={
				variant === "credits" ? (
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
				) : variant === "subscription" ? (
					<>
						<div>Pro Subscription</div>
					</>
				) : null
			}
			sideHeader={
				variant === "credits"
					? "Order #40950"
					: variant === "subscription"
						? "$20 / Month"
						: null
			}
			setupStripe={setupStripe}
			submitButtonText={
				variant === "credits"
					? "Submit Payment"
					: variant === "subscription"
						? "Subscribe"
						: null
			}
		>
			{children}
		</CheckoutDialogView>
	);
};

export default CheckoutDialog;
