import { publicFetcher, publicProxyApiFetcher } from "@/lib/fetcher";
import { mainSchema } from "../schema";

const amazon = {
	payment: async ({
		id,
	}: {
		id: string;
	}): Promise<mainSchema["AmazonRequestPaymentTypeDTO"]> =>
		await publicProxyApiFetcher.post(`proxyApi/Amazon/${id}/Payment`).json(),

	getMetadata: async ({
		id,
	}: {
		id: string;
	}): Promise<mainSchema["ReturnBookMetaDataDTOApiResponse"]> =>
		await publicProxyApiFetcher
			.get(`proxyApi/WebStory/GetMetaData/${id}`)
			.json(),

	// allBooksRevenue: async ({
	// 	CurrentPage,
	// 	PageSize,
	// }: {
	// 	CurrentPage: number;
	// 	PageSize: number;
	// }): Promise<mainSchema["AmazonBooksRevenueDTOPagedListApiResponse"]> =>
	// 	await publicProxyApiFetcher
	// 		.get(`api/Amazon/AllAmazonBooksRevenue`, {
	// 			searchParams: { CurrentPage, PageSize },
	// 		})
	// 		.json(),
};

export default amazon;
