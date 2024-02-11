import { authFetcher } from "@/lib/fetcher";
import { getJwt } from "@/utils/auth";
import { mainSchema } from "../schema";

const amazon = {
	payment: async ({
		id,
	}: {
		id: string;
	}): Promise<mainSchema["AmazonRequestPaymentTypeDTO"]> =>
		await authFetcher(getJwt()).post(`api/Amazon/${id}/Payment`).json(),

	allBooksRevenue: async ({
		CurrentPage,
		PageSize,
	}: {
		CurrentPage: number;
		PageSize: number;
	}): Promise<mainSchema["AmazonBooksRevenueDTOPagedListApiResponse"]> =>
		await authFetcher(getJwt())
			.get(`api/Amazon/AllAmazonBooksRevenue`, {
				searchParams: { CurrentPage, PageSize },
			})
			.json(),
};

export default amazon;
