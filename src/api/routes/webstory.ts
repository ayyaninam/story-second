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
		return await mlFetcher(token || getJwt())
			.post(`create`, {
				body: JSON.stringify(params),
			})
			.json();
	},
	interactions: async (
		id: string,
		token?: string
	): Promise<mainSchema["ReturnStoryInteractionDTO"]> => {
		const data: mainSchema["ReturnStoryInteractionDTOApiResponse"] =
			await authFetcher(token || getJwt())
				.get(`api/WebStory/${id}/Interactions`)
				.json();
		if (!data.succeeded) {
			// TODO:figure out error boundaries
		}

		if (!data.data) {
			throw new Error("No data returned");
		}

		return data.data;
	},
};

export default webstory;
