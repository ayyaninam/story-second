import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const videoCreditValues = [5, 10, 20, 50] as const;
type VideoCreditValue = (typeof videoCreditValues)[number];

interface CheckoutDialogProps {
	children: React.ReactNode;
}

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({ children }) => {
	const [videoCredit, setVideoCredit] = useState<VideoCreditValue>(10);

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="rounded-lg p-0 bg-white shadow-xl border-0 gap-0">
				<div
					className="p-6"
					style={{
						background: "linear-gradient(180deg, white 0%, #F8FAFC 100%)",
					}}
				>
					<DialogHeader className="text-lg">
						<DialogTitle className="font-bold">
							<div className="flex flex-row items-baseline gap-2 leading-8">
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

								<span className="ml-1 text-[13px] leading-5 text-slate-400 font-normal">
									Order #40950
								</span>
							</div>
						</DialogTitle>
						<DialogDescription className="text-slate-600">
							Description of what I am buying here would be quite important,
							that way we tell people what this checkout is for.
						</DialogDescription>
					</DialogHeader>

					<div className="mt-6">
						<div className="border-t border-solid border-slate-300" />

						<div className="my-4">
							<div className="flex justify-between">
								<span className="text-slate-400">5 Video Credits</span>
								<span className="text-slate-950 font-medium">$5.00</span>
							</div>
						</div>

						<div className="border-t border-dashed border-slate-300" />

						<div className="flex justify-between mt-4">
							<span className="text-slate-400">Total</span>
							<span className="text-[#00BA34] font-medium">$5.00</span>
						</div>
					</div>
				</div>

				<div className="bg-white p-6">
					<div className="font-medium text-slate-400">Billing Info</div>

					<div className="h-48" />

					<button
						style={{
							background:
								"linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(0deg, #8F22CE, #8F22CE)",
							boxShadow:
								"0px -1px 12px 0px #FFFFFF1F inset, 0px 0px 0px 1px #8F22CE",
						}}
						className="w-full h-9 px-2.5 py-1.5 rounded-md text-white font-medium"
						// Oscar: I asked chatgpt to build this hover effect, and it did it. lgtm imo. even though it's not on the design so feel free to modify it
						onMouseEnter={(e) => {
							e.currentTarget.style.background =
								"linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(0deg, #7E1DBE, #7E1DBE)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background =
								"linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(0deg, #8F22CE, #8F22CE)";
						}}
					>
						Submit Payment
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default CheckoutDialog;
