import {
	authFetcher,
	publicFetcher,
	publicProxyApiFetcher,
} from "@/lib/fetcher";
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

	getMetaDataServer: async ({
		id,
		accessToken,
	}: {
		id: string;
		accessToken: string;
	}): Promise<mainSchema["ReturnBookMetaDataDTOApiResponse"]> =>
		await authFetcher(accessToken)
			.get(`api/WebStory/GetMetaData/${id}`, {
				searchParams: { id },
			})
			.json(),

	getAmazonCategories: async ({
		id,
		amazonMarketplace,
	}: {
		id: string;
		amazonMarketplace: mainSchema["AmazonMarketplace"];
	}): Promise<mainSchema["StringObjectDictionaryListApiResponse"]> =>
		await publicProxyApiFetcher
			.get(`proxyApi/WebStory/BookMetaData/${id}/Categories`, {
				searchParams: amazonMarketplace,
			})
			.json(),

	validateMetadata: async ({
		id,
		metadata,
	}: {
		id: string;
		metadata: mainSchema["AmazonBookMetaDataDTO"];
	}): Promise<mainSchema["StringApiResponse"]> =>
		await publicProxyApiFetcher
			.post(`proxyApi/WebStory/ValidateBookMetadata/${id}`, {
				json: metadata,
			})
			.json(),

	saveBookMetadata: async ({
		id,
		metadata,
	}: {
		id: string;
		metadata: mainSchema["AmazonBookMetaDataDTO"];
	}): Promise<string> =>
		await publicProxyApiFetcher
			.post(`proxyApi/WebStory/SaveBookMetadata/${id}`, {
				json: metadata,
			})
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
