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
			open?: boolean;
			setOpen?: (open: boolean) => void;
	  } & Omit<CreditsCheckoutDialogProps, "onClose">)
	| ({
			variant: "subscription";
			isUpgradePlan?: boolean;
			children?: ReactNode;
			open?: boolean;
			setOpen?: (open: boolean) => void;
	  } & Omit<SubscriptionCheckoutDialogProps, "onClose">);

const CheckoutDialog = (props: CheckoutDialogProps) => {
	const [openDialog, setOpenDialog] = useState(false);

	const open = props.open ?? openDialog;

	const setOpen = (open: boolean) => {
		if (props.setOpen) {
			props.setOpen(open);
		} else {
			setOpenDialog(open);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{props.children}</DialogTrigger>
			<DialogContent className="rounded-md p-0 max-h-screen shadow-xl gap-0 overflow-y-scroll sm:overflow-y-hidden left-[50%]">
				{props.variant === "credits" ? (
					<CreditsCheckoutDialog
						allowanceType={props.allowanceType}
						defaultQuantity={props.defaultQuantity}
						onClose={() => setOpen(false)}
					/>
				) : props.variant === "subscription" ? (
					<SubscriptionCheckoutDialog
						plan={props.plan}
						period={props.period}
						isUpgradePlan={props.isUpgradePlan}
						onClose={() => setOpen(false)}
					/>
				) : null}
			</DialogContent>
		</Dialog>
	);
};

export default CheckoutDialog;
