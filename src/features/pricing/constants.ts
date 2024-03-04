import { SubscriptionPlan, SubscriptionPeriod } from "@/utils/enums";

type PricingDetailsMonthly = {
	title: string;
	itemMonthly: string;
};

type PricingDetailsAnnual = PricingDetailsMonthly & {
	itemYearly: string;
};

export type PricingDetails = PricingDetailsMonthly | PricingDetailsAnnual;

export type PricingValues = {
	[SubscriptionPlan.Basic]: {
		[SubscriptionPeriod.Monthly]: PricingDetailsMonthly;
		[SubscriptionPeriod.Annual]: PricingDetailsAnnual;
	};
	[SubscriptionPlan.Pro]: {
		[SubscriptionPeriod.Monthly]: PricingDetailsMonthly;
		[SubscriptionPeriod.Annual]: PricingDetailsAnnual;
	};
	[SubscriptionPlan.Premium]: {
		[SubscriptionPeriod.Monthly]: PricingDetailsMonthly;
		[SubscriptionPeriod.Annual]: PricingDetailsAnnual;
	};
};

export const pricingValues: PricingValues = {
	[SubscriptionPlan.Basic]: {
		[SubscriptionPeriod.Monthly]: {
			title: "Starter Subscription",
			itemMonthly: "$12",
		},
		[SubscriptionPeriod.Annual]: {
			title: "Starter Subscription",
			itemMonthly: "$9",
			itemYearly: "$108",
		},
	},
	[SubscriptionPlan.Pro]: {
		[SubscriptionPeriod.Monthly]: {
			title: "Creator Subscription",
			itemMonthly: "$80",
		},
		[SubscriptionPeriod.Annual]: {
			title: "Creator Subscription",
			itemMonthly: "$60",
			itemYearly: "$720",
		},
	},
	[SubscriptionPlan.Premium]: {
		[SubscriptionPeriod.Monthly]: {
			title: "Professional Subscription",
			itemMonthly: "$1300",
		},
		[SubscriptionPeriod.Annual]: {
			title: "Professional Subscription",
			itemMonthly: "$1000",
			itemYearly: "$12000",
		},
	},
};
