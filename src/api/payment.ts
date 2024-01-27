import schema from "./schema";
import { authFetcher } from "@/lib/fetcher";

const payment = {
	getShippingPricing: async ({
		quantity,
	}: {
		quantity: number;
	}): Promise<schema["ShippingPricesApiResponse"]> =>
		await authFetcher.get(`api/Payment/GetShippingPricing/${quantity}`).json(),
	getDiscountCodeDetails: async ({
		code,
	}: {
		code: string;
	}): Promise<schema["ReturnDiscountCodeDetailsDTOApiResponse"]> =>
		await authFetcher
			.get(`api/Payment/DiscountCodeDetails`, { searchParams: { code } })
			.json(),
};

export default payment;
