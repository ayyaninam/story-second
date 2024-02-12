import { authFetcher } from "@/lib/fetcher";
import { mainSchema } from "../schema";
import { getJwt } from "@/utils/auth";

const user = {
	register: async (
		params: mainSchema["RegisterUserDTO"],
		token?: string
	): Promise<mainSchema["UserInfoDTOApiResponse"]> => {
		return await authFetcher(token || getJwt())
			.post(`api/User/register`, { body: JSON.stringify(params) })
			.json();
	},
};

export default user;
