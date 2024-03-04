import React from "react";
import {
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button, ButtonProps } from "@/components/ui/button";

interface Item {
	id: string;
	description: string;
	price: string;
}

interface CheckoutDialogProps {
	title: React.ReactNode;
	sideLabel: React.ReactNode;
	description: string;
	items: Item[];
	total: string;
	submitButtonText: React.ReactNode;
	buttonProps?: ButtonProps;
	stripeForm: React.ReactNode;
}

const CheckoutDialogContent = ({
	title,
	sideLabel,
	description,
	items,
	total,
	stripeForm,
	submitButtonText,
	buttonProps,
}: CheckoutDialogProps) => {
	return (
		<>
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
					<DialogDescription className="text-slate-600 text-base text-left">
						{description}
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
						<span className="text-slate-400">Checkout Price</span>
						<span className="text-[#00BA34] font-medium text-lg">{total}</span>
					</div>
				</div>
			</div>

			<div className="bg-background p-6">
				<div className="font-medium text-slate-400">Billing Info</div>

				<div className="min-h-[375px]">{stripeForm}</div>

				<Button variant="accent" className="w-full" {...buttonProps}>
					{submitButtonText}
				</Button>
			</div>
		</>
	);
};

export default CheckoutDialogContent;
