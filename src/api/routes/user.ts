import { authFetcher, publicProxyApiFetcher } from "@/lib/fetcher";
import { mainSchema } from "../schema";
import { toFromData } from "@/utils/request";

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
};

export default user;
