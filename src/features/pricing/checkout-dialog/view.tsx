import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button, ButtonProps } from "@/components/ui/button";
import StripeForm, { SetupStripe } from "@/features/pricing/stripe-form";

interface Item {
	id: string;
	description: string;
	price: string;
}

interface CheckoutDialogProps {
	children: React.ReactNode;
	title: React.ReactNode;
	sideLabel: React.ReactNode;
	items: Item[];
	total: string;
	submitButtonText: React.ReactNode;
	buttonProps?: ButtonProps;
	setupStripe: SetupStripe;
	onLoadStripe: () => void;
}

const CheckoutDialogView = ({
	children,
	title,
	sideLabel,
	items,
	total,
	setupStripe,
	onLoadStripe,
	submitButtonText,
	buttonProps,
}: CheckoutDialogProps) => {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="rounded-md p-0 shadow-xl gap-0 overflow-hidden">
				<div
					className="p-6"
					style={{
						// todo: implement dark mode
						background: "linear-gradient(180deg, white 0%, #F8FAFC 100%)",
					}}
				>
					<DialogHeader className="text-lg">
						<DialogTitle className="font-bold">
							<div className="flex flex-row items-baseline gap-2 leading-8">
								{title}
								<span className="ml-1 text-[13px] leading-5 text-slate-400 font-normal">
									{sideLabel}
								</span>
							</div>
						</DialogTitle>
						<DialogDescription className="text-slate-600 text-base">
							Description of what I am buying here would be quite important,
							that way we tell people what this checkout is for.
						</DialogDescription>
					</DialogHeader>

					<div className="mt-6">
						<div className="border-t border-solid border-slate-300" />

						<div className="my-4 flex flex-col gap-2">
							{items.map(({ id, description, price }) => (
								<div className="flex justify-between" key={id}>
									<span className="text-slate-400">{description}</span>
									<span className="text-slate-950 font-medium">{price}</span>
								</div>
							))}
						</div>

						<div className="border-t border-dashed border-slate-300" />

						<div className="flex justify-between mt-4">
							<span className="text-slate-400">Total</span>
							<span className="text-[#00BA34] font-medium">{total}</span>
						</div>
					</div>
				</div>

				<div className="bg-background p-6">
					<div className="font-medium text-slate-400">Billing Info</div>

					<div className="min-h-[375px]">
						<StripeForm setupStripe={setupStripe} onLoadStripe={onLoadStripe} />
					</div>

					<Button
						style={{
							background:
								"linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(0deg, #8F22CE, #8F22CE)",
							boxShadow:
								"0px -1px 12px 0px #FFFFFF1F inset, 0px 0px 0px 1px #8F22CE",
						}}
						className="w-full h-9 px-2.5 py-1.5 mt-6 rounded-md text-white font-medium"
						// Oscar: I asked chatgpt to build this hover effect, and it did it. lgtm imo. even though it's not on the design so feel free to modify it
						onMouseEnter={(e) => {
							e.currentTarget.style.background =
								"linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(0deg, #7E1DBE, #7E1DBE)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background =
								"linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(0deg, #8F22CE, #8F22CE)";
						}}
						{...buttonProps}
					>
						{submitButtonText}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default CheckoutDialogView;
