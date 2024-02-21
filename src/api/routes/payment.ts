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
		mainSchema["StringApiResponse"]
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
};

export default payment;
