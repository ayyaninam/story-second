import { authFetcher } from "@/lib/fetcher";
import { mainSchema } from "../schema";
import { getJwt } from "@/utils/jwt";
import { toFromData } from "@/utils/request";

const user = {
	register: async (
		params: mainSchema["RegisterUserDTO"],
		token?: string
	): Promise<mainSchema["UserInfoDTOApiResponse"]> => {
		return await authFetcher(token || getJwt())
			.post(`api/User/register`, { body: JSON.stringify(params) })
			.json();
	},
	get: async (
		token?: string
	): Promise<mainSchema["UserInfoDTOApiResponse"]> => {
		return await authFetcher(token || getJwt())
			.get(`api/User`)
			.json();
	},
	updateDetails: async <T>(data: T & Record<string, any>, token?: string) => {
		return await authFetcher(token || getJwt())
			.patch("api/User/Details", {
				body: toFromData(data),
			})
			.json<mainSchema["StringApiResponse"]>();
	},
};

export default user;
