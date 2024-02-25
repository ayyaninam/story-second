import React, { ReactNode, useState } from "react";
import CreditsCheckoutDialog, { CreditsCheckoutDialogProps } from "./credits";
import SubscriptionCheckoutDialog, {
	SubscriptionCheckoutDialogProps,
} from "./subscription";
import { DialogTrigger, Dialog, DialogContent } from "@/components/ui/dialog";

type CheckoutDialogProps =
	| ({
			variant: "credits";
			children?: ReactNode;
	  } & CreditsCheckoutDialogProps)
	| ({
			variant: "subscription";
			children?: ReactNode;
	  } & Omit<SubscriptionCheckoutDialogProps, "onClose">);

const CheckoutDialog = (props: CheckoutDialogProps) => {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{props.children}</DialogTrigger>
			<DialogContent className="rounded-md p-0 shadow-xl gap-0 overflow-hidden">
				{props.variant === "credits" ? (
					<CreditsCheckoutDialog />
				) : props.variant === "subscription" ? (
					<SubscriptionCheckoutDialog
						plan={props.plan}
						period={props.period}
						onClose={() => setOpen(false)}
					/>
				) : null}
			</DialogContent>
		</Dialog>
	);
};

export default CheckoutDialog;
