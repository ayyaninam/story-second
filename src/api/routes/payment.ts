import { getJwt } from "@/utils/jwt";
import { mainSchema } from "../schema";
import { authFetcher } from "@/lib/fetcher";

const payment = {
	getShippingPricing: async ({
		quantity,
	}: {
		quantity: number;
	}): Promise<mainSchema["ShippingPricesApiResponse"]> =>
		await authFetcher(getJwt())
			.get(`api/Payment/GetShippingPricing/${quantity}`)
			.json(),
	getDiscountCodeDetails: async ({
		code,
	}: {
		code: string;
	}): Promise<mainSchema["ReturnDiscountCodeDetailsDTOApiResponse"]> =>
		await authFetcher(getJwt())
			.get(`api/Payment/DiscountCodeDetails`, { searchParams: { code } })
			.json(),
	addCard: async (): Promise<mainSchema["StringApiResponse"]> =>
		await authFetcher(getJwt()).post(`api/Payment/AddCard`).json(),
	removeCard: async (): Promise<mainSchema["StringApiResponse"]> =>
		await authFetcher(getJwt()).post(`api/Payment/RemoveCard`).json(),
	syncCards: async (): Promise<mainSchema["StringApiResponse"]> =>
		await authFetcher(getJwt()).post(`api/Payment/SyncCards`).json(),
	createSubscription: async ({
		subscriptionPlan,
		subscriptionPeriod,
	}: mainSchema["CreateSubscriptionDTO"]): Promise<
		mainSchema["InternalTransactionDTOApiResponse"]
	> =>
		await authFetcher(getJwt())
			.post(`api/Payment/CreateSubscription`, {
				json: {
					subscriptionPlan,
					subscriptionPeriod,
				},
			})
			.json(),
	cancelSubscription: async (): Promise<mainSchema["StringApiResponse"]> =>
		await authFetcher(getJwt()).post(`api/Payment/CancelSubscription`).json(),
	confirmSubscription: async ({
		paymentIntentId,
		subscriptionId,
		subscriptionPlan,
		subscriptionPeriod,
	}: mainSchema["ConfirmSubscriptionDTO"]): Promise<
		mainSchema["StringApiResponse"]
	> =>
		await authFetcher(getJwt())
			.post(`api/Payment/ConfirmSubscription`, {
				json: {
					paymentIntentId,
					subscriptionId,
					subscriptionPlan,
					subscriptionPeriod,
				},
			})
			.json(),
	refillAllowance: async ({
		allowanceType,
		quantity,
	}: mainSchema["AdditionalCreditsDTO"]): Promise<
		mainSchema["InternalTransactionDTOApiResponse"]
	> =>
		await authFetcher(getJwt())
			.post(`api/Payment/RefillAllowance`, {
				json: {
					allowanceType,
					quantity,
				},
			})
			.json(),
	verifyPurchaseCredits: async ({
		paymentIntentId,
		amount,
		allowanceType,
		quantity,
	}: mainSchema["ConfirmPaymentDTO"]): Promise<
		mainSchema["StringApiResponse"]
	> =>
		await authFetcher(getJwt())
			.post(`api/Payment/VerifyPurchaseCredits`, {
				json: {
					paymentIntentId,
					amount,
					allowanceType,
					quantity,
				},
			})
			.json(),
};

export default payment;
