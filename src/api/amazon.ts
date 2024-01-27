import { authFetcher } from "@/lib/fetcher";
import schema from "./schema";

const amazon = {
	payment: async ({
		id,
	}: {
		id: string;
	}): Promise<schema["AmazonRequestPaymentTypeDTO"]> =>
		await authFetcher.post(`api/Amazon/${id}/Payment`).json(),

	allBooksRevenue: async ({
		CurrentPage,
		PageSize,
	}: {
		CurrentPage: number;
		PageSize: number;
	}): Promise<schema["AmazonBooksRevenueDTOPagedListApiResponse"]> =>
		await authFetcher
			.get(`api/Amazon/AllAmazonBooksRevenue`, {
				searchParams: { CurrentPage, PageSize },
			})
			.json(),
};

export default amazon;
