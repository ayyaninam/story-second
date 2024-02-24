import React from "react";
import CreditsCheckoutDialog, { CreditsCheckoutDialogProps } from "./credits";
import SubscriptionCheckoutDialog, {
	SubscriptionCheckoutDialogProps,
} from "./subscription";

type CheckoutDialogProps =
	| ({
			variant: "credits";
	  } & CreditsCheckoutDialogProps)
	| ({
			variant: "subscription";
	  } & SubscriptionCheckoutDialogProps);

const CheckoutDialog = (props: CheckoutDialogProps) => {
	if (props.variant === "credits") {
		return <CreditsCheckoutDialog>{props.children}</CreditsCheckoutDialog>;
	} else if (props.variant === "subscription") {
		return (
			<SubscriptionCheckoutDialog plan={props.plan} period={props.period}>
				{props.children}
			</SubscriptionCheckoutDialog>
		);
	}
};

export default CheckoutDialog;
