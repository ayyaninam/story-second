import { mainSchema } from "./schema";
import { authFetcher } from "@/lib/fetcher";

const payment = {
	getShippingPricing: async ({
		quantity,
	}: {
		quantity: number;
	}): Promise<mainSchema["ShippingPricesApiResponse"]> =>
		await authFetcher.get(`api/Payment/GetShippingPricing/${quantity}`).json(),
	getDiscountCodeDetails: async ({
		code,
	}: {
		code: string;
	}): Promise<mainSchema["ReturnDiscountCodeDetailsDTOApiResponse"]> =>
		await authFetcher
			.get(`api/Payment/DiscountCodeDetails`, { searchParams: { code } })
			.json(),
};

export default payment;
