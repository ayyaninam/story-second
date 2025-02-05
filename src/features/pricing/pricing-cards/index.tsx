import Link from "next/link";
import Routes from "@/routes";
import Router, { useRouter } from "next/router";
import { chunk } from "lodash";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Subtrack from "@/components/icons/subtrack";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CheckoutDialog from "@/features/pricing/checkout-dialog";
import { useUser } from "@/features/pricing/hooks";

import cn from "@/utils/cn";
import { SubscriptionPeriod, SubscriptionPlan } from "@/utils/enums";
import PricingCard, { PricingCardProps } from "./pricing-card";
import { pricingValues } from "@/features/pricing/constants";
import useEventLogger from "@/utils/analytics";

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
		priceSuffix: "/month",
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

interface PricingCardsProps {
	onCloseDialog: () => void;
}

const secondaryButtonStyles = "w-full transition-none group-hover:border-2";
const primaryButtonStyles =
	"w-full transition-none group-hover:bg-accent-button group-hover:text-primary-foreground";

const PricingCards = ({ onCloseDialog }: PricingCardsProps) => {
	const [frequency, setFrequency] = useState<PricingTierFrequency>(
		frequencies[1]
	);

	const router = useRouter();
	const eventLogger = useEventLogger();
	const { user, isLoading } = useUser();

	const period =
		frequency.label === "Monthly"
			? SubscriptionPeriod.Monthly
			: SubscriptionPeriod.Annual;
	const userSubscriptionPlan = user?.subscription?.subscriptionPlan;
	const userSubscriptionPeriod = user?.subscription?.subscriptionPeriod;

	const _isCurrentPlan = (plan: SubscriptionPlan) =>
		userSubscriptionPlan === plan && userSubscriptionPeriod === period;

	const _isUpgradePlan = (plan: SubscriptionPlan) => {
		if (userSubscriptionPlan === SubscriptionPlan.Custom) {
			return true;
		}

		if (userSubscriptionPlan === SubscriptionPlan.Free) {
			return false;
		}

		if (period === userSubscriptionPeriod) {
			return (
				Object.values(SubscriptionPlan).indexOf(plan) >
				Object.values(SubscriptionPlan).indexOf(userSubscriptionPlan)
			);
		}
		return (
			period === SubscriptionPeriod.Annual &&
			userSubscriptionPeriod === SubscriptionPeriod.Monthly
		);
	};

	const getButtonText = (plan: SubscriptionPlan) => {
		if (userSubscriptionPlan) {
			if (_isCurrentPlan(plan)) {
				return "Current Plan";
			} else if (_isUpgradePlan(plan)) {
				return "Upgrade Plan";
			}
			return "Downgrade Plan";
		}

		switch (plan) {
			case SubscriptionPlan.Basic:
				return "Sign Up For Starter";
			case SubscriptionPlan.Pro:
				return "Sign Up For Creator";
			case SubscriptionPlan.Premium:
				return "Sign Up for Professional";
			default:
				return "Get Started For Free";
		}
	};

	const isCurrentPlan = (plan: SubscriptionPlan) =>
		getButtonText(plan) === "Current Plan";
	const isUpgradePlan = (plan: SubscriptionPlan) =>
		getButtonText(plan) === "Upgrade Plan";
	const isDowngradePlan = (plan: SubscriptionPlan) =>
		getButtonText(plan) === "Downgrade Plan";

	const getButtonStyles = (plan: SubscriptionPlan) => {
		if (
			plan === SubscriptionPlan.Free ||
			isDowngradePlan(plan) ||
			isCurrentPlan(plan)
		) {
			return secondaryButtonStyles;
		}
		return primaryButtonStyles;
	};

	const handleClickSubscriptionButton = (
		e: React.MouseEvent<HTMLButtonElement>,
		plan: SubscriptionPlan
	) => {
		const preventsToShowCheckoutDialog = () => {
			e.preventDefault();
		};

		if (!user) {
			preventsToShowCheckoutDialog();
			router.push(Routes.ToAuthPage("/account?step=payment")).then();
		} else if (isDowngradePlan(plan)) {
			preventsToShowCheckoutDialog();
			Router.push(Routes.ToSubscriptionPage()).then();
			onCloseDialog();
		} else if (plan === SubscriptionPlan.Free) {
			eventLogger("pricing_free_plan_clicked");
			Router.push(Routes.Generate()).then();
			onCloseDialog();
		}
	};

	const getDisabledButton = (plan: SubscriptionPlan) => isCurrentPlan(plan);

	const professionalProps: PricingCardProps = {
		variant: "Paid",
		title: "Professional",
		description:
			"Maximum power and flexibility for large-scale content generation needs.",
		priceLabel:
			frequency.label === "Monthly"
				? pricingValues[SubscriptionPlan.Premium][SubscriptionPeriod.Monthly]
						.itemMonthly
				: pricingValues[SubscriptionPlan.Premium][SubscriptionPeriod.Annual]
						.itemMonthly,
		priceSuffix: frequency.priceSuffix,
		button: (
			<CheckoutDialog
				variant="subscription"
				plan={SubscriptionPlan.Premium}
				period={period}
				isUpgradePlan={isUpgradePlan(SubscriptionPlan.Premium)}
			>
				<Button
					variant="outline"
					className={getButtonStyles(SubscriptionPlan.Premium)}
					size="sm"
					onClick={(e) =>
						handleClickSubscriptionButton(e, SubscriptionPlan.Premium)
					}
					disabled={getDisabledButton(SubscriptionPlan.Premium)}
				>
					{getButtonText(SubscriptionPlan.Premium)}
				</Button>
			</CheckoutDialog>
		),
		items: [
			"600 videos / month",
			"1000 stories / month",
			"$2 / extra video",
			"$1 / extra story",
			"Fast Generation Time",
			"Dedicated support",
			"10000 credits",
			"Unlimited Downloads",
		],
		icon: (
			<>
				<div className="self-end font-normal text-slate-500 text-[14px] tracking-[0] leading-[24px] mt-1">
					if you want more than professional,{" "}
					<Button
						variant="link"
						onClick={() => {
							// @ts-ignore - Intercom is vanilla JS
							Intercom("show");
						}}
						className="mt-2 text-sm font-normal hover:text-accent-600 underline"
					>
						Contact Us
					</Button>
				</div>
				<div className="absolute -top-10 z-10 -right-20">
					<Subtrack size={200} />
				</div>
			</>
		),
	};

	return (
		<div className="inline-flex flex-col max-w-screen-xl items-center px-[32px] py-0 relative">
			<div className="flex-col inline-flex items-start relative flex-[0_0_auto]">
				<div className="justify-center inline-flex items-start relative flex-[0_0_auto]">
					<div className="flex justify-center">
						<RadioGroup
							defaultValue={frequency.value}
							onValueChange={(value: string) => {
								eventLogger("pricing_frequency_changed"); // # TODO: log what frequency was changed to
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
											? "bg-accent-700 text-white dark:bg-purple-900/70 dark:text-white/70"
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
						button={
							<Button
								variant="outline"
								className={getButtonStyles(SubscriptionPlan.Free)}
								size="sm"
								onClick={(e) =>
									handleClickSubscriptionButton(e, SubscriptionPlan.Free)
								}
							>
								{getButtonText(SubscriptionPlan.Free)}
							</Button>
						}
						items={[
							"5 videos / month",
							"15 stories / month",
							"200 credits",
							"No Video Downloads",
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
						priceLabel={
							frequency.label === "Monthly"
								? pricingValues[SubscriptionPlan.Basic][
										SubscriptionPeriod.Monthly
									].itemMonthly
								: pricingValues[SubscriptionPlan.Basic][
										SubscriptionPeriod.Annual
									].itemMonthly
						}
						priceSuffix={frequency.priceSuffix}
						button={
							<CheckoutDialog
								variant="subscription"
								plan={SubscriptionPlan.Basic}
								period={period}
								isUpgradePlan={isUpgradePlan(SubscriptionPlan.Basic)}
							>
								<Button
									variant="outline"
									className={getButtonStyles(SubscriptionPlan.Basic)}
									size="sm"
									onClick={(e) =>
										handleClickSubscriptionButton(e, SubscriptionPlan.Basic)
									}
									disabled={getDisabledButton(SubscriptionPlan.Basic)}
								>
									{getButtonText(SubscriptionPlan.Basic)}
								</Button>
							</CheckoutDialog>
						}
						items={[
							"8 videos / month",
							// "3 videos / month",
							"20 stories / month",
							// "5 stories / month",
							<>
								$4 per additional video
								<br />
								$2 per additional story
							</>,
							"300 credits",
							"Unlimited Video Downloads",
						]}
					/>
					<PricingCard
						variant="Paid"
						title="Creator"
						description="More videos. More stories. Faster generation times."
						priceLabel={
							frequency.label === "Monthly"
								? pricingValues[SubscriptionPlan.Pro][
										SubscriptionPeriod.Monthly
									].itemMonthly
								: pricingValues[SubscriptionPlan.Pro][SubscriptionPeriod.Annual]
										.itemMonthly
						}
						priceSuffix={frequency.priceSuffix}
						button={
							<CheckoutDialog
								variant="subscription"
								plan={SubscriptionPlan.Pro}
								period={period}
								isUpgradePlan={isUpgradePlan(SubscriptionPlan.Pro)}
							>
								<Button
									variant="outline"
									className={getButtonStyles(SubscriptionPlan.Pro)}
									size="sm"
									onClick={(e) =>
										handleClickSubscriptionButton(e, SubscriptionPlan.Pro)
									}
									disabled={getDisabledButton(SubscriptionPlan.Pro)}
								>
									{getButtonText(SubscriptionPlan.Pro)}
								</Button>
							</CheckoutDialog>
						}
						items={[
							"35 videos / month",
							"60 stories / month",
							<>
								$3 per additional video
								<br />
								$1.5 per additional story
							</>,
							"900 credits",
							"Unlimited Video Downloads",
						]}
					/>
					<div className="block lg:hidden relative">
						<PricingCard {...professionalProps} />
					</div>
				</div>

				<div className="hidden lg:block w-full">
					<div className="group gap-[8px] p-[24px] self-stretch w-full flex-[0_0_auto] border-[#ffffff33] shadow-[0px_0px_0px_1px_#12376914,0px_1px_2px_#e1eaef,0px_24px_32px_-12px_#36394a3d] flex flex-col items-start relative bg-background rounded-[10px] overflow-hidden border-[0px] border-solid backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] hover:shadow-[0px_1px_10px_var(--accent-color-500),0px_24px_32px_-12px_#36394a3d]">
						<div className="flex justify-between pt-0 pb-[0.25px] px-0 self-stretch w-full items-start relative flex-[0_0_auto]">
							<div className="relative w-fit mt-[-1.00px] font-medium text-theme-variables-text-colors-text-base text-[26px] tracking-[0] leading-[39px] whitespace-nowrap">
								{professionalProps.title}
							</div>
							<CheckoutDialog
								variant="subscription"
								plan={SubscriptionPlan.Premium}
								period={period}
								isUpgradePlan={isUpgradePlan(SubscriptionPlan.Premium)}
							>
								<Button
									variant="outline"
									className="px-4 transition-none group-hover:bg-accent-button group-hover:text-primary-foreground"
									size="sm"
									onClick={(e) =>
										handleClickSubscriptionButton(e, SubscriptionPlan.Premium)
									}
									disabled={getDisabledButton(SubscriptionPlan.Premium)}
								>
									{getButtonText(SubscriptionPlan.Premium)}
								</Button>
							</CheckoutDialog>
						</div>
						<div className="items-center justify-between self-stretch w-full flex relative flex-[0_0_auto]">
							<div className="flex w-[193px] pl-0 pr-[17.87px] py-0 flex-col items-start relative">
								<div className="pl-0 pr-[50.73px] py-0 mr-[-31.60px] inline-flex items-baseline gap-[8px] relative flex-[0_0_auto]">
									<div className="relative w-fit mt-[-1.00px] font-light text-slate-700 text-[32px] tracking-[0] leading-[48px] whitespace-nowrap">
										{professionalProps.priceLabel}
									</div>
									<div className="relative w-fit font-medium text-slate-400 text-[14px] tracking-[0] leading-[24px] whitespace-nowrap">
										{professionalProps.priceSuffix}
									</div>
								</div>
								<p className="relative self-stretch font-normal text-slate-500 text-[14px] tracking-[0] leading-[24px]">
									{professionalProps.description}
								</p>
							</div>
							<div className="w-[458px] flex flex-col items-start gap-[12px] relative">
								{chunk(professionalProps.items, 2).map(([item1, item2]) => (
									<>
										<div className="w-[492px] items-start gap-[12px] mr-[-34.00px] flex relative flex-[0_0_auto]">
											<div className="flex pl-0 pr-[50.61px] py-0 flex-1 grow items-start gap-[12px] relative">
												<CheckIcon
													className="dark:text-black text-accent-700 h-6 w-5 flex-none"
													aria-hidden="true"
												/>
												<div className="relative w-fit mt-[-1.00px] mr-[-4.61px] font-normal text-gray-700 text-[16px] tracking-[0] leading-[24px] whitespace-nowrap">
													{item1}
												</div>
											</div>
											{item2 && (
												<div className="flex pl-0 pr-[48.77px] py-0 flex-1 grow items-start gap-[12px] relative">
													<CheckIcon
														className="dark:text-black text-accent-700 h-6 w-5 flex-none"
														aria-hidden="true"
													/>
													<div className="relative w-fit mt-[-1.00px] mr-[-13.77px] font-normal text-gray-700 text-[16px] tracking-[0] leading-[24px] whitespace-nowrap">
														{item2}
													</div>
												</div>
											)}
										</div>
									</>
								))}
								<div className="self-end font-normal text-slate-500 text-[14px] tracking-[0] leading-[24px] mt-1">
									if you want more than professional, please{" "}
									<Button
										variant="link"
										onClick={() => {
											// @ts-ignore - Intercom is vanilla JS
											Intercom("show");
										}}
										className="mt-2 text-sm font-normal hover:text-accent-600 underline"
									>
										Contact Us
									</Button>
									{/*# TODO: open intercom chat modal*/}
									{/*<Link*/}
									{/*	href="#"*/}
									{/*	className="font-medium text-accent-700 dark:text-blue-500 hover:underline"*/}
									{/*>*/}
									{/*</Link>*/}
								</div>
							</div>
						</div>
						{/**/}
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
