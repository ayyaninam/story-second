import {
	authFetcher,
	publicFetcher,
	publicProxyApiFetcher,
} from "@/lib/fetcher";
import { mainSchema } from "../schema";
import { toFormData } from "@/utils/request";
import { PaginationParams } from "@/types";

// interface updateKYCFormParams {
// 	Address: string;
// 	Country: string;
// 	PhotoID: string;
// 	PhotoIDType: string;
// 	PhotoIDNumber: string;
// }

const user = {
	getUserProfile: async (profileName: string) => {
		const response: mainSchema["OtherUserInfoDTOApiResponse"] =
			await publicFetcher.get(`api/User/${profileName}`).json();
		return response?.data;
	},
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
				body: toFormData(data),
			})
			.json<mainSchema["StringApiResponse"]>();
	},
	updateKYC: async (data: FormData): Promise<mainSchema["UserInfoDTO"]> => {
		console.log(data);
		console.log(toFormData(data));
		for (let [key, value] of data.entries()) {
			console.log(key, value);
		}
		const response = await publicProxyApiFetcher
			.post("proxyApi/User/UpdateKYC", {
				body: data,
			})
			.json<mainSchema["UserInfoDTOApiResponse"]>();
		if (!response.data) {
			throw new Error("Internal Server Error");
		}
		return response.data;
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
	getSingleUserAmazonItem: async (
		id: string
	): Promise<mainSchema["ReturnUserAmazonBookDTO"]> => {
		const data: mainSchema["ReturnUserAmazonBookDTOApiResponse"] =
			await publicProxyApiFetcher
				.get(`proxyApi/WebStory/GetSingleAmazonRequest/${id}`)
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
	checkStripeConnectAccount: async (): Promise<
		mainSchema["StripeConnectAccountStatus"]
	> => {
		const response = await publicProxyApiFetcher
			.get(`proxyApi/Payment/CheckStripeConnectAccount`)
			.json<mainSchema["StripeConnectAccountStatusApiResponse"]>();
		if (!response.data) {
			throw new Error("Internal Server Error");
		}
		return response.data;
	},
	stripeAccountSetupLink: async (): Promise<mainSchema["AccountLink"]> => {
		const response = await publicProxyApiFetcher
			.get(`proxyApi/Payment/SetupLink`)
			.json<mainSchema["AccountLinkApiResponse"]>();
		if (!response.data) {
			throw new Error("Internal Server Error");
		}
		return response.data;
	},
	getStripeAccountLink: async (): Promise<mainSchema["AccountLink"]> => {
		const response = await publicProxyApiFetcher
			.get(`proxyApi/Payment/AccountLink`)
			.json<mainSchema["AccountLinkApiResponse"]>();
		if (!response.data) {
			throw new Error("Internal Server Error");
		}
		return response.data;
	},
	setupPaymentAccount: async (
		params: mainSchema["CreatePayoutAccountDTO"]
	): Promise<any> => {
		const response = await publicProxyApiFetcher
			.post(`proxyApi/Payment/PayoutAccount`, { json: params })
			.json<any>();
		if (!response.data) {
			throw new Error("Internal Server Error");
		}
		return response.data;
	},
	getAllAmazonBooksRevenue: async (
		params: PaginationParams
	): Promise<mainSchema["AmazonBooksRevenueDTOPagedList"]> => {
		const response = await publicProxyApiFetcher
			.get(`proxyApi/Amazon/AllAmazonBooksRevenue`, { searchParams: params })
			.json<mainSchema["AmazonBooksRevenueDTOPagedListApiResponse"]>();
		if (!response.data) {
			throw new Error("Internal Server Error");
		}
		return response.data;
	},
	withdrawFunds: async () => {
		return await publicProxyApiFetcher
			.post(`proxyApi/Payment/WithdrawAmazonBalance`)
			.json<mainSchema["StringApiResponse"]>();
	},
};

export default user;
