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
		openModal,
	}: {
		paymentRequest: Promise<unknown>;
		credits: number;
		openModal: () => void;
	}): Promise<unknown> => {
		if (!subscription) {
			throw new Error("user does not have the subscription object");
		}
		const userCredits = subscription.credits ?? 0;
		const enoughBalance = userCredits >= credits;

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
			toast.error("User does not have enough credits to perform this action");
			openModal();
		}
	};

	return { paymentHandler };
};
