import { mainSchema } from "../schema";
import { publicProxyApiFetcher } from "@/lib/fetcher";

const payment = {
	addCard: async (): Promise<mainSchema["StringApiResponse"]> =>
		await publicProxyApiFetcher.post(`proxyApi/Payment/AddCard`).json(),
	removeCard: async (): Promise<mainSchema["StringApiResponse"]> =>
		await publicProxyApiFetcher.post(`proxyApi/Payment/RemoveCard`).json(),
	syncCards: async (): Promise<mainSchema["StringApiResponse"]> =>
		await publicProxyApiFetcher.post(`proxyApi/Payment/SyncCards`).json(),
	createSubscription: async ({
		subscriptionPlan,
		subscriptionPeriod,
	}: mainSchema["CreateSubscriptionDTO"]): Promise<
		mainSchema["InternalTransactionDTOApiResponse"]
	> =>
		await publicProxyApiFetcher
			.post(`proxyApi/Payment/CreateSubscription`, {
				json: {
					subscriptionPlan,
					subscriptionPeriod,
				},
			})
			.json(),
	cancelSubscription: async (): Promise<mainSchema["StringApiResponse"]> =>
		await publicProxyApiFetcher
			.post(`proxyApi/Payment/CancelSubscription`)
			.json(),
	confirmSubscription: async ({
		paymentIntentId,
		subscriptionId,
		subscriptionPlan,
		subscriptionPeriod,
	}: mainSchema["ConfirmSubscriptionDTO"]): Promise<
		mainSchema["StringApiResponse"]
	> =>
		await publicProxyApiFetcher
			.post(`proxyApi/Payment/ConfirmSubscription`, {
				json: {
					paymentIntentId,
					subscriptionId,
					subscriptionPlan,
					subscriptionPeriod,
				},
			})
			.json(),
	upgradeSubscription: async ({
		subscriptionPlan,
		subscriptionPeriod,
	}: {
		subscriptionPlan: number;
		subscriptionPeriod: number;
	}): Promise<mainSchema["InternalTransactionDTOApiResponse"]> =>
		await publicProxyApiFetcher
			.post(`proxyApi/Payment/UpgradeSubscription`, {
				json: {
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
		await publicProxyApiFetcher
			.post(`proxyApi/Payment/RefillAllowance`, {
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
		await publicProxyApiFetcher
			.post(`proxyApi/Payment/VerifyPurchaseCredits`, {
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
