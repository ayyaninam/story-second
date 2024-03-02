import Link from "next/link";
import Routes from "@/routes";
import { useRouter } from "next/router";
import { chunk } from "lodash";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Subtrack from "@/components/icons/subtrack";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CheckoutDialog from "@/features/pricing/checkout-dialog";
import { useUser } from "@auth0/nextjs-auth0/client";

import cn from "@/utils/cn";
import { SubscriptionPeriod, SubscriptionPlan } from "@/utils/enums";
import PricingCard, { PricingCardProps } from "./pricing-card";

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
  onClickFreePlan: () => void;
}

const PricingCards = ({ onClickFreePlan }: PricingCardsProps) => {
  const [frequency, setFrequency] = useState<PricingTierFrequency>(
    frequencies[1]
  );

  const router = useRouter();
  const { user, isLoading } = useUser();

  const openLoginWhenNotLoggedIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!user) {
      // prevents to show the checkout dialog
      e.preventDefault();

      router.push(Routes.ToAuthPage("/pricing")).then();
    }
  };

  const enterpriseProps: PricingCardProps = {
    variant: "Paid",
    title: "Professional",
    description:
      "Maximum power and flexibility for large-scale content generation needs.",
    priceLabel: frequency.label === "Monthly" ? "$999.99" : "$799.99",
    priceSuffix: frequency.priceSuffix,
    button: (
      <CheckoutDialog
        variant="subscription"
        plan={SubscriptionPlan.Premium}
        period={
          frequency.label === "Monthly"
            ? SubscriptionPeriod.Monthly
            : SubscriptionPeriod.Annual
        }
      >
        <Button
          variant="outline"
          className="w-full transition-none group-hover:bg-accent-button group-hover:text-primary-foreground"
          size="sm"
          onClick={openLoginWhenNotLoggedIn}
        >
          Sign Up for Professional
        </Button>
      </CheckoutDialog>
    ),
    items: [
      "175 videos / month",
      "350 stories / month",
      "$5 / extra video",
      "$1 / extra story",
      "Fast Generation Time",
      "Dedicated support",
      "2500 credits",
    ],
    icon: (
      <>
        <div className="self-end font-normal text-slate-500 text-[14px] tracking-[0] leading-[24px] mt-1">
          if you want more than professional,{" "}
          <Link
            href="/contact-us"
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            contact us
          </Link>
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
              <Link href="/generate" className="w-full">
                <Button
                  variant="outline"
                  className="w-full transition-none group-hover:border-2"
                  size="sm"
                  onClick={(e) => {
                    onClickFreePlan();
                  }}
                >
                  Get Started For Free
                </Button>
              </Link>
            }
            items={[
              "1 video generation",
              "1 story generation",
              "20 tokens for your editing",
              "Free plans do NOT replenish",
              "10 credits",
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
            priceLabel={frequency.label === "Monthly" ? "$11.99" : "$9.99"}
            priceSuffix={frequency.priceSuffix}
            button={
              <CheckoutDialog
                variant="subscription"
                plan={SubscriptionPlan.Basic}
                period={
                  frequency.label === "Monthly"
                    ? SubscriptionPeriod.Monthly
                    : SubscriptionPeriod.Annual
                }
              >
                <Button
                  variant="outline"
                  className="w-full transition-none group-hover:bg-accent-button group-hover:text-primary-foreground"
                  size="sm"
                  onClick={openLoginWhenNotLoggedIn}
                >
                  Sign Up For Starter
                </Button>
              </CheckoutDialog>
            }
            items={[
              "2 videos / month",
              "5 stories / month",
              "Slow Generation Time",
              <>
                $7 per additional video
                <br />
                $2 per additional story
              </>,
              "30 credits",
            ]}
          />
          <PricingCard
            variant="Paid"
            title="Creator"
            description="More videos. More stories. Faster generation times."
            priceLabel={frequency.label === "Monthly" ? "$79.99" : "$59.99"}
            priceSuffix={frequency.priceSuffix}
            button={
              <CheckoutDialog
                variant="subscription"
                plan={SubscriptionPlan.Pro}
                period={
                  frequency.label === "Monthly"
                    ? SubscriptionPeriod.Monthly
                    : SubscriptionPeriod.Annual
                }
              >
                <Button
                  variant="outline"
                  className="w-full transition-none group-hover:bg-accent-button group-hover:text-primary-foreground"
                  size="sm"
                  onClick={openLoginWhenNotLoggedIn}
                >
                  Sign Up For Creator
                </Button>
              </CheckoutDialog>
            }
            items={[
              "12 videos / month",
              "25 stories / month",
              "Fast Generation Time",
              <>
                $6 per additional video
                <br />
                $1.5 per additional story
              </>,
              "200 credits",
            ]}
          />
          <div className="block lg:hidden relative">
            <PricingCard {...enterpriseProps} />
          </div>
        </div>

        <div className="hidden lg:block w-full">
          <div className="group gap-[8px] p-[24px] self-stretch w-full flex-[0_0_auto] border-[#ffffff33] shadow-[0px_0px_0px_1px_#12376914,0px_1px_2px_#e1eaef,0px_24px_32px_-12px_#36394a3d] flex flex-col items-start relative bg-background rounded-[10px] overflow-hidden border-[0px] border-solid backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] hover:shadow-[0px_1px_10px_var(--accent-color-500),0px_24px_32px_-12px_#36394a3d]">
            <div className="flex justify-between pt-0 pb-[0.25px] px-0 self-stretch w-full items-start relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] font-medium text-theme-variables-text-colors-text-base text-[26px] tracking-[0] leading-[39px] whitespace-nowrap">
                {enterpriseProps.title}
              </div>
              <CheckoutDialog
                variant="subscription"
                plan={SubscriptionPlan.Premium}
                period={
                  frequency.label === "Monthly"
                    ? SubscriptionPeriod.Monthly
                    : SubscriptionPeriod.Annual
                }
              >
                <Button
                  variant="outline"
                  className="px-4 transition-none group-hover:bg-accent-button group-hover:text-primary-foreground"
                  size="sm"
                  onClick={openLoginWhenNotLoggedIn}
                >
                  Sign Up for Professional
                </Button>
              </CheckoutDialog>
            </div>
            <div className="items-center justify-between self-stretch w-full flex relative flex-[0_0_auto]">
              <div className="flex w-[193px] pl-0 pr-[17.87px] py-0 flex-col items-start relative">
                <div className="pl-0 pr-[50.73px] py-0 mr-[-31.60px] inline-flex items-baseline gap-[8px] relative flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1.00px] font-light text-slate-700 text-[32px] tracking-[0] leading-[48px] whitespace-nowrap">
                    {enterpriseProps.priceLabel}
                  </div>
                  <div className="relative w-fit font-medium text-slate-400 text-[14px] tracking-[0] leading-[24px] whitespace-nowrap">
                    {enterpriseProps.priceSuffix}
                  </div>
                </div>
                <p className="relative self-stretch font-normal text-slate-500 text-[14px] tracking-[0] leading-[24px]">
                  {enterpriseProps.description}
                </p>
              </div>
              <div className="w-[458px] flex flex-col items-start gap-[12px] relative">
                {chunk(enterpriseProps.items, 2).map(([item1, item2]) => (
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
                  if you want more than professional,{" "}
                  <Link
                    href="/contact-us"
                    className="font-medium text-accent-700 dark:text-blue-500 hover:underline"
                  >
                    contact us
                  </Link>
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
