import React, { useState } from "react";
import CheckIcon from "./check-icon";

export interface PricingCardProps {
	variant: "Free" | "Paid";
	title: string;
	description: React.ReactNode;
	priceLabel: string;
	priceSuffix: string;
	button: React.ReactNode;
	items: React.ReactNode[];
	icon?: React.ReactNode;
}

const PricingCard = ({
	variant,
	title,
	description,
	priceLabel,
	priceSuffix,
	button,
	items,
	icon,
}: PricingCardProps) => (
	<div className="group flex flex-col w-[312px] items-start gap-[20px] pt-[24px] pb-[40px] px-[24px] relative self-stretch bg-background rounded-[10px] overflow-hidden border-[0.5px] border-solid border-[#ffffff33] shadow-[0px_0px_0px_1px_#12376914,0px_1px_2px_#e1eaef,0px_24px_32px_-12px_#36394a3d] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] hover:shadow-[0px_1px_10px_var(--accent-color-500),0px_24px_32px_-12px_#36394a3d] transition-shadow">
		<div className="inline-flex flex-col pl-0 pr-[124.3px] pt-0 pb-[0.25px] items-start relative flex-[0_0_auto]">
			<div className="relative w-fit mt-[-1.00px] font-medium text-theme-variables-text-colors-text-base text-[26px] tracking-[0] leading-[39px] whitespace-nowrap">
				{title}
			</div>
		</div>
		<div className="inline-flex flex-col items-start pl-0 pr-[17.87px] py-0 relative flex-[0_0_auto]">
			<p className="relative w-fit mt-[-1.00px] font-normal text-slate-500 text-[14px] tracking-[0] leading-[24px]">
				{description}
			</p>
		</div>
		<div className="pl-0 pr-[34.28px] py-0 inline-flex items-baseline gap-[8px] relative flex-[0_0_auto]">
			<div className="relative w-fit mt-[-1.00px] font-light text-slate-700 text-[32px] tracking-[0] leading-[48px] whitespace-nowrap">
				{priceLabel}
			</div>
			<div className="relative w-fit font-medium text-slate-400 text-[14px] tracking-[0] leading-[24px] whitespace-nowrap">
				{priceSuffix}
			</div>
		</div>
		<div className="flex items-start justify-center relative self-stretch w-full flex-[0_0_auto] bg-[#ffffff01] shadow-[0px_1px_2px_#0000000d]">
			{button}
		</div>
		<div className="self-stretch w-full flex-[0_0_auto] flex flex-col items-start gap-[12px] relative">
			{items.map((item, index) => (
				<div
					key={index}
					className="flex pl-0 pr-[57.06px] py-0 self-stretch w-full flex-[0_0_auto] items-start gap-[12px] relative"
				>
					{variant === "Free" ? (
						<CheckIcon
							className="dark:text-black text-accent-300 h-6 w-5 flex-none"
							aria-hidden="true"
						/>
					) : variant === "Paid" ? (
						<CheckIcon
							className="dark:text-black text-accent-700 h-6 w-5 flex-none"
							aria-hidden="true"
						/>
					) : null}

					<div className="text-gray-700 relative w-fit mt-[-1.00px] font-normal text-[16px] tracking-[0] leading-[24px] whitespace-nowrap">
						{item}
					</div>
				</div>
			))}
		</div>

		{icon}
	</div>
);

export default PricingCard;
