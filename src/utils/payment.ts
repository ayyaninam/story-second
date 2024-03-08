import toast from "react-hot-toast";
// import useUpdateUser from "@/hooks/useUpdateUser";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";

import api from "@/api";
import { SubscriptionPlan } from "@/utils/enums";

export const useUserCanUseCredits = () => {
	const { data } = useQuery({
		queryKey: [QueryKeys.USER],
		queryFn: () => api.user.get(),
	});

	const subscription = data?.data?.subscription;

	const userCanUseCredits = async ({
		credits,
		videoCredits,
		storybookCredits,
		variant,
	}: {
		credits?: number;
		videoCredits?: number;
		storybookCredits?: number;
		variant: "credits" | "video credits" | "story book";
	}): Promise<{
		error?:
			| "not paid subscription"
			| "not enough credits"
			| "using custom plan";
		success?: boolean;
	}> => {
		if (!subscription) {
			throw new Error("No subscription found - please contact our support!");
		}

		const userCredits = subscription.credits ?? 0;
		const userVideoCredits = subscription.videoGenerations ?? 0;
		const userStoryCredits = subscription.storyGenerations ?? 0;
		const enoughBalance =
			variant === "credits"
				? // @ts-ignore
					userCredits >= credits
				: variant === "video credits" // @ts-ignore
					? userVideoCredits >= videoCredits // @ts-ignore
					: userStoryCredits >= storybookCredits;

		if (!enoughBalance) {
			if (variant === "video credits") {
				toast.error(
					"You do not have enough video credits to perform this action"
				);
			} else if (variant === "credits") {
				toast.error("You do not have enough credits to perform this action");
			} else if (variant === "story book") {
				toast.error(
					"You do not have enough story book credits to perform this action"
				);
			}

			return { error: "not enough credits", success: false };
		}

		if (subscription.subscriptionPlan === SubscriptionPlan.Free) {
			toast.success(
				"You're on a free plan, please upgrade to a paid plan to continue",
				{
					icon: "🔒",
				}
			);
			return { error: "not paid subscription", success: false };
		}
		if (subscription.subscriptionPlan === SubscriptionPlan.Custom) {
			toast.success(
				"You're on a custom plan, please upgrade to a regular plan to continue",
				{
					icon: "🔒",
				}
			);
			console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
			return { error: "using custom plan", success: false };
		}

		return {
			success: true,
		};
	};

	return { userCanUseCredits };
};

// todo: implement this
// export const usePaymentHandler = () => {
// 	const { invalidateUser } = useUpdateUser();
// 	const { userCanUseCredits } = useUserCanUseCredits();
//
// 	const paymentHandler = async ({
// 		paymentRequest,
// 		credits,
// 		videoCredits,
// 		storybookCredits,
// 		variant,
// 		onNotPaidSubscription,
// 		onNotEnoughCredits,
// 	}: {
// 		paymentRequest: () => Promise<unknown>;
// 		credits?: number;
// 		videoCredits?: number;
// 		storybookCredits?: number;
// 		variant: "credits" | "video credits" | "story book";
// 		onNotEnoughCredits: () => void;
// 	}): Promise<{ data?: unknown; error: boolean }> => {
// 		const canUseCredits = await userCanUseCredits({
// 			credits,
// 			videoCredits,
// 			storybookCredits,
// 			variant,
// 			onNotPaidSubscription,
// 			onNotEnoughCredits,
// 		});
//
// 		if (!canUseCredits) {
// 			return {
// 				error: true,
// 			};
// 		}
//
// 		const data = await paymentRequest();
// 		await invalidateUser();
//
// 		// todo: type it better
// 		// @ts-ignore
// 		const error = data?.error;
// 		if (error) {
// 			// @ts-ignore
// 			toast.error(error);
// 		}
//
// 		return {
// 			data,
// 			error: !!error,
// 		};
// 	};
//
// 	return { paymentHandler };
// };
