import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Subtrack from "@/components/icons/subtrack";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import cn from "@/utils/cn";
import { SubscriptionPeriod } from "@/utils/enums";

import PricingCard from "./pricing-card";

export interface PricingTierFrequency {
	id: string;
	value: string;
	label: "Monthly" | "Annually";
	priceSuffix: string;
	subscriptionPeriod: SubscriptionPeriod;
}

export const frequencies = [
	{
		id: "1",
		value: "1",
		label: "Monthly",
		priceSuffix: "/month",
		subscriptionPeriod: SubscriptionPeriod.Monthly,
	},
	{
		id: "2",
		value: "2",
		label: "Annually",
		priceSuffix: "/year",
		subscriptionPeriod: SubscriptionPeriod.Annual,
	},
] as const satisfies PricingTierFrequency[];

const CheckIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className={cn("w-6 h-6", className)}
	>
		<path
			fillRule="evenodd"
			d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
			clipRule="evenodd"
		/>
	</svg>
);

const PricingCards = () => {
	const [frequency, setFrequency] = useState<PricingTierFrequency>(
		frequencies[0]
	);
	const [isHoveredLargeCard, setIsHoveredLargeCard] = useState(false);

	return (
		<div className="inline-flex flex-col max-w-screen-xl items-center px-[32px] py-0 relative">
			<div className="flex-col inline-flex items-start relative flex-[0_0_auto]">
				<div className="justify-center inline-flex items-start relative flex-[0_0_auto]">
					<div className="flex justify-center">
						<RadioGroup
							defaultValue={frequency.value}
							onValueChange={(value: string) => {
								setFrequency(frequencies.find((f) => f.value === value)!);
							}}
							className="grid gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 bg-white dark:bg-black ring-1 ring-inset ring-gray-200/30 dark:ring-gray-800"
							style={{
								gridTemplateColumns: `repeat(${frequencies.length}, minmax(0, 1fr))`,
							}}
						>
							<Label className="sr-only">Payment frequency</Label>
							{frequencies.map((option) => (
								<Label
									className={cn(
										frequency.value === option.value
											? "bg-[#8F22CE] text-white dark:bg-purple-900/70 dark:text-white/70"
											: "bg-transparent text-gray-500 hover:bg-purple-500/10",
										"cursor-pointer rounded-full px-2.5 py-2 transition-all"
									)}
									key={option.value}
									htmlFor={option.value}
								>
									{option.label}

									<RadioGroupItem
										value={option.value}
										id={option.value}
										className="hidden"
									/>
								</Label>
							))}
						</RadioGroup>
					</div>
				</div>
			</div>
			<div className="inline-flex flex-col items-center gap-[16px] pt-[16px] pb-[15px] px-0 relative flex-[0_0_auto]">
				<div className="inline-flex flex-col lg:flex-row items-start justify-center gap-[16px] relative flex-[0_0_auto]">
					<PricingCard
						variant="Free"
						title="Free"
						description={
							<>
								Get all goodies for free, no
								<br />
								credit card required.
							</>
						}
						priceLabel="$0"
						priceSuffix={frequency.priceSuffix}
						button={(isHovered) => (
							<Button
								variant="outline"
								className={cn("w-full", isHovered ? "border-2" : undefined)}
								size="sm"
							>
								Get Started For Free
							</Button>
						)}
						items={[
							"1 video generation",
							"1 story generation",
							"20 tokens for your editing",
							"Free plans do NOT replenish",
						]}
					/>
					<PricingCard
						variant="Paid"
						title="Starter"
						description={
							<>
								When you grow, need more
								<br />
								power and flexibility.
							</>
						}
						priceLabel={frequency.label === "Monthly" ? "$11.99" : "$119.99"}
						priceSuffix={frequency.priceSuffix}
						button={(isHovered) => (
							<Button
								variant={isHovered ? "purple" : "outline"}
								className="w-full"
								size="sm"
							>
								Sign Up For Starter
							</Button>
						)}
						items={[
							"2 videos / month",
							"5 stories / month",
							"Slow Generation Time",
							<>
								$7 per additional video
								<br />
								$2 per additional story
							</>,
						]}
					/>
					<PricingCard
						variant="Paid"
						title="Creator"
						description="More videos. More stories. Faster generation times."
						priceLabel={frequency.label === "Monthly" ? "$79.99" : "$799.99"}
						priceSuffix={frequency.priceSuffix}
						button={(isHovered) => (
							<Button
								variant={isHovered ? "purple" : "outline"}
								className="w-full"
								size="sm"
							>
								Sign Up For Creator
							</Button>
						)}
						items={[
							"12 videos / month",
							"25 stories / month",
							"Fast Generation Time",
							<>
								$6 per additional video
								<br />
								$1.5 per additional story
							</>,
						]}
					/>
					<div className="block lg:hidden">
						<PricingCard
							variant="Paid"
							title="Enterprise"
							description="More videos. More stories. Faster generation times."
							priceLabel={
								frequency.label === "Monthly" ? "$799.99" : "your soul"
							}
							priceSuffix={frequency.priceSuffix}
							button={(isHovered) => (
								<Button
									variant={isHovered ? "purple" : "outline"}
									className="w-full"
									size="sm"
								>
									Contact Us
								</Button>
							)}
							items={[
								"175 videos / month",
								"350 stories / month",
								"Fast Generation Time",
								"$5 per additional video",
								"$1 per additional story",
								"Dedicated support",
							]}
						/>
					</div>
				</div>

				<div className="hidden lg:block w-full">
					<div
						className="gap-[8px] p-[24px] self-stretch w-full flex-[0_0_auto] border-[#ffffff33] shadow-[0px_0px_0px_1px_#12376914,0px_1px_2px_#e1eaef,0px_24px_32px_-12px_#36394a3d] flex flex-col items-start relative bg-white rounded-[10px] overflow-hidden border-[0px] border-solid backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] hover:shadow-[0px_1px_10px_#bb55f7,0px_24px_32px_-12px_#36394a3d] transition-shadow"
						onMouseEnter={() => setIsHoveredLargeCard(true)}
						onMouseLeave={() => setIsHoveredLargeCard(false)}
					>
						<div className="flex justify-between pt-0 pb-[0.25px] px-0 self-stretch w-full items-start relative flex-[0_0_auto]">
							<div className="relative w-fit mt-[-1.00px] font-medium text-theme-variables-text-colors-text-base text-[26px] tracking-[0] leading-[39px] whitespace-nowrap">
								Enterprise
							</div>
							<Button
								variant={isHoveredLargeCard ? "purple" : "outline"}
								className="px-4"
								size="sm"
							>
								Contact Us
							</Button>
						</div>
						<div className="items-center justify-between self-stretch w-full flex relative flex-[0_0_auto]">
							<div className="flex w-[193px] pl-0 pr-[17.87px] py-0 flex-col items-start relative">
								<div className="pl-0 pr-[50.73px] py-0 mr-[-31.60px] inline-flex items-baseline gap-[8px] relative flex-[0_0_auto]">
									<div className="relative w-fit mt-[-1.00px] font-light text-slate-700 text-[32px] tracking-[0] leading-[48px] whitespace-nowrap">
										{frequency.label === "Monthly" ? "$799.99" : "your soul"}
									</div>
									<div className="relative w-fit font-medium text-slate-400 text-[14px] tracking-[0] leading-[24px] whitespace-nowrap">
										{frequency.priceSuffix}
									</div>
								</div>
								<p className="relative self-stretch font-normal text-slate-500 text-[14px] tracking-[0] leading-[24px]">
									Maximum power and flexibility for large-scale content
									generation needs.
								</p>
							</div>
							<div className="w-[458px] flex flex-col items-start gap-[12px] relative">
								<div className="w-[492px] items-start gap-[12px] mr-[-34.00px] flex relative flex-[0_0_auto]">
									<div className="flex pl-0 pr-[50.61px] py-0 flex-1 grow items-start gap-[12px] relative">
										<CheckIcon
											className="dark:text-black text-[#ce7aff] h-6 w-5 flex-none"
											aria-hidden="true"
										/>
										<div className="text-gray-700 relative w-fit mt-[-1.00px] font-normal text-[16px] tracking-[0] leading-[24px] whitespace-nowrap">
											175 videos / month
										</div>
									</div>
									<div className="flex pl-0 pr-[48.77px] py-0 flex-1 grow items-start gap-[12px] relative">
										<CheckIcon
											className="dark:text-black text-[#ce7aff] h-6 w-5 flex-none"
											aria-hidden="true"
										/>
										<div className="text-gray-700 relative w-fit mt-[-1.00px] font-normal text-[16px] tracking-[0] leading-[24px] whitespace-nowrap">
											350 stories / month
										</div>
									</div>
								</div>
								<div className="w-[492px] items-start gap-[12px] mr-[-34.00px] flex relative flex-[0_0_auto]">
									<div className="flex pl-0 pr-[50.61px] py-0 flex-1 grow items-start gap-[12px] relative">
										<CheckIcon
											className="dark:text-black text-[#ce7aff] h-6 w-5 flex-none"
											aria-hidden="true"
										/>
										<div className="relative w-fit mt-[-1.00px] mr-[-4.61px] font-normal text-gray-700 text-[16px] tracking-[0] leading-[24px] whitespace-nowrap">
											Fast Generation Time
										</div>
									</div>
									<div className="flex pl-0 pr-[48.77px] py-0 flex-1 grow items-start gap-[12px] relative">
										<CheckIcon
											className="dark:text-black text-[#ce7aff] h-6 w-5 flex-none"
											aria-hidden="true"
										/>
										<div className="relative w-fit mt-[-1.00px] mr-[-13.77px] font-normal text-gray-700 text-[16px] tracking-[0] leading-[24px] whitespace-nowrap">
											$5 per additional video
										</div>
									</div>
								</div>
								<div className="w-[492px] items-start gap-[12px] mr-[-34.00px] flex relative flex-[0_0_auto]">
									<div className="flex pl-0 pr-[50.61px] py-0 flex-1 grow items-start gap-[12px] relative">
										<CheckIcon
											className="dark:text-black text-[#ce7aff] h-6 w-5 flex-none"
											aria-hidden="true"
										/>
										<div className="relative w-fit mt-[-1.00px] mr-[-9.61px] font-normal text-gray-700 text-[16px] tracking-[0] leading-[24px] whitespace-nowrap">
											$1 per additional story
										</div>
									</div>
									<div className="flex pl-0 pr-[48.77px] py-0 flex-1 grow items-start gap-[12px] relative">
										<CheckIcon
											className="dark:text-black text-[#ce7aff] h-6 w-5 flex-none"
											aria-hidden="true"
										/>
										<div className="relative w-fit mt-[-1.00px] font-normal text-gray-700 text-[16px] tracking-[0] leading-[24px] whitespace-nowrap">
											Dedicated support
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="absolute -top-10 -z-10 left-60">
							<Subtrack size={200} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PricingCards;
