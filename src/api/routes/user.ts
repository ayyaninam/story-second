import { authFetcher, publicProxyApiFetcher } from "@/lib/fetcher";
import { mainSchema } from "../schema";
import { toFromData } from "@/utils/request";
import { PaginationParams } from "@/types";

const user = {
	register: async (
		params: mainSchema["RegisterUserDTO"]
	): Promise<mainSchema["UserInfoDTOApiResponse"]> => {
		return await publicProxyApiFetcher
			.post(`proxyApi/User/register`, { body: JSON.stringify(params) })
			.json();
	},
	get: async (): Promise<mainSchema["UserInfoDTOApiResponse"]> => {
		return await publicProxyApiFetcher.get(`proxyApi/User`).json();
	},
	getServer: async (
		accessToken?: string | null
	): Promise<mainSchema["UserInfoDTOApiResponse"] | null> => {
		if (!accessToken) return null;
		return await authFetcher(accessToken as string)
			.get(`api/User`)
			.json();
	},
	updateDetails: async <T>(data: T & Record<string, any>) => {
		return await publicProxyApiFetcher
			.patch("proxyApi/User/Details", {
				body: toFromData(data),
			})
			.json<mainSchema["StringApiResponse"]>();
	},
	toggleStoryPrivacy: async () => {
		return await publicProxyApiFetcher
			.put("proxyApi/User/ToggleDefaultStoryPrivacy")
			.json<mainSchema["StringApiResponse"]>();
	},
	updateEmailNotificationPreferences: async (
		data: mainSchema["EmailNotificationPreferencesDTO"]
	) => {
		return await publicProxyApiFetcher
			.put("proxyApi/User/EmailNotificationPreferences", { json: data })
			.json<mainSchema["StringApiResponse"]>();
	},
	getUserPurchase: async ({
		id,
		creditSpendType,
	}: mainSchema["CheckPaymentStatusDTO"] & {
		id: string;
	}) => {
		return await publicProxyApiFetcher
			.post(`proxyApi/User/${id}/Payments`, { json: { creditSpendType } })
			.json<mainSchema["Int32BooleanDictionaryApiResponse"]>();
	},
	pdfPayment: async ({
		id,
		creditSpendType,
	}: mainSchema["PaymentTypeDTO"] & {
		id: string;
	}) => {
		return await publicProxyApiFetcher
			.post(`proxyApi/User/${id}/PDFPayment`, { json: { creditSpendType } })
			.json<mainSchema["StringApiResponse"]>();
	},
	amazonPayment: async ({
		id,
		creditSpendType,
	}: mainSchema["PaymentTypeDTO"] & {
		id: string;
	}) => {
		return await publicProxyApiFetcher
			.post(`proxyApi/Amazon/${id}/Payment`, { json: { creditSpendType } })
			.json<mainSchema["StringApiResponse"]>();
	},
	getAllUserItems: async (
		params: PaginationParams
	): Promise<mainSchema["ReturnUserStoryItemsDTOPagedList"]> => {
		const data: mainSchema["ReturnUserStoryItemsDTOPagedListApiResponse"] =
			await publicProxyApiFetcher
				.get(`proxyApi/StoryBook/GetAllPurchasedPDFs`, { searchParams: params })
				.json();
		if (!data.data) {
			throw new Error("Internal Server Error");
		}
		return data.data;
	},
	getAllUserAmazonItems: async (
		params: PaginationParams
	): Promise<mainSchema["ReturnUserAmazonBookDTOPagedList"]> => {
		const data: mainSchema["ReturnUserAmazonBookDTOPagedListApiResponse"] =
			await publicProxyApiFetcher
				.get(`proxyApi/WebStory/GetAllUserAmazonRequests`, {
					searchParams: params,
				})
				.json();
		if (!data.data) {
			throw new Error("Internal Server Error");
		}
		return data.data;
	},
	legacyGetAllUserVideos: async (
		params: PaginationParams
	): Promise<mainSchema["ReturnUserStoryItemsDTOPagedList"]> => {
		const data: mainSchema["ReturnUserStoryItemsDTOPagedListApiResponse"] =
			await publicProxyApiFetcher
				.get(`proxyApi/WebStory/GetAllUserItems`, { searchParams: params })
				.json();
		if (!data.data) {
			throw new Error("Internal Server Error");
		}
		return data.data;
	},
};

export default user;
