// # TODO: Update values
// # TODO: use const values for showing the plan

import { SubscriptionPlan } from "@/utils/enums";

export const subscriptionText = {
	0: "Free",
	1: "Starter",
	2: "creator",
	3: "Professional",
};

export const SubscriptionConstants: Record<
	any,
	{
		name: string;
		videos: number;
		stories: number;
		credits: number;
	}
> = {
	0: {
		name: "Free",
		videos: 1,
		stories: 1,
		credits: 20,
	},
	1: {
		name: "Starter",
		videos: 3,
		stories: 5,
		credits: 150,
	},
	2: {
		name: "Creator",
		videos: 35,
		stories: 60,
		credits: 900,
	},
	3: {
		name: "Professional",
		videos: 600,
		stories: 1000,
		credits: 10000,
	},
};
