import toast from "react-hot-toast";
import useUpdateUser from "@/hooks/useUpdateUser";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";

import api from "@/api";

export const usePaymentHandler = () => {
	const { invalidateUser } = useUpdateUser();

	const { data } = useQuery({
		queryKey: [QueryKeys.USER],
		queryFn: () => api.user.get(),
	});

	const subscription = data?.data?.subscription;

	const paymentHandler = async ({
		paymentRequest,
		credits,
		videoCredits,
		storybookCredits,
		variant,
		openModal,
	}: {
		paymentRequest: Promise<unknown>;
		credits?: number;
		videoCredits?: number;
		storybookCredits?: number;
		variant: "credits" | "video credits" | "story book";
		openModal: () => void;
	}): Promise<unknown> => {
		if (!subscription) {
			throw new Error("user does not have the subscription object");
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

		if (enoughBalance) {
			const data = await paymentRequest;
			await invalidateUser();

			// todo: type it better
			// @ts-ignore
			if (data?.error) {
				// @ts-ignore
				toast.error(data.error);
			}

			return data;
		} else {
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
			openModal();
		}
	};

	return { paymentHandler };
};
