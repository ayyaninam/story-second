import { authFetcher, mlFetcher, publicFetcher } from "@/lib/fetcher";
import { mainSchema, mlSchema } from "../schema";
import { getJwt } from "@/utils/jwt";
import { CreateInitialStoryQueryParams } from "@/types";

const webstory = {
	create: async (
		params: CreateInitialStoryQueryParams,
		token?: string
	): Promise<{
		title: string;
		englishTitle: string;
		blurb: string;
		category: string;
		cover_image: string;
		image_style: number;
		url: string;
	}> => {
		console.log(params, token);
		return await mlFetcher(token || getJwt())
			.post(`create`, {
				body: JSON.stringify(params),
			})
			.json();
	},
};

export default webstory;
