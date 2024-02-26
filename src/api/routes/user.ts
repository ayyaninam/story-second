import { authFetcher } from "@/lib/fetcher";
import { mainSchema } from "../schema";
import { getJwt } from "@/utils/jwt";

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
	updateDetails: async (
		params: { test: string },
		token?: string
	): Promise<mainSchema["StringApiResponse"]> => {
		return await authFetcher(token || getJwt())
			.patch(`api/User/Details`, { body: JSON.stringify(params) })
			.json();
	},
};

export default user;
