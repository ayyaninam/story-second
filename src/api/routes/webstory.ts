import { authFetcher, mlFetcher, publicFetcher } from "@/lib/fetcher";
import { mainSchema, mlSchema } from "../schema";
import { getJwt } from "@/utils/jwt";

const webstory = {
	create: async (
		formData: FormData,
		token: string
	): Promise<{
		title: string;
		englishTitle: string;
		blurb: string;
		category: string;
		cover_image: string;
		image_style: number;
		url: string;
	}> => {
		return await mlFetcher(token)
			.post(`create`, {
				body: formData,
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
