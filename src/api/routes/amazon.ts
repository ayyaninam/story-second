import { authFetcher } from "@/lib/fetcher";
import schema from "../schema";
import { getJwt } from "@/utils/auth";

const amazon = {
	payment: async ({
		id,
	}: {
		id: string;
	}): Promise<schema["AmazonRequestPaymentTypeDTO"]> =>
		await authFetcher(getJwt()).post(`api/Amazon/${id}/Payment`).json(),

	allBooksRevenue: async ({
		CurrentPage,
		PageSize,
	}: {
		CurrentPage: number;
		PageSize: number;
	}): Promise<schema["AmazonBooksRevenueDTOPagedListApiResponse"]> =>
		await authFetcher(getJwt())
			.get(`api/Amazon/AllAmazonBooksRevenue`, {
				searchParams: { CurrentPage, PageSize },
			})
			.json(),
};

export default amazon;
