import { mlFetcher, publicProxyApiFetcher } from "@/lib/fetcher";
import { mainSchema } from "../schema";

const webstory = {
	create: async (
		params: any,
		token: string
	): Promise<{
		title: string;
		englishTitle: string;
		blurb: string;
		category: string;
		cover_image: string;
		image_style: number;
		url: string;
		story_type: number;
		error?: string;
	}> => {
		return await mlFetcher(token)
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
			await publicProxyApiFetcher
				.get(`proxyApi/WebStory/${id}/Interactions`)
				.json();
		if (!data.succeeded) {
			// TODO:figure out error boundaries
		}

		if (!data.data) {
			throw new Error("No data returned");
		}

		return data.data;
	},
	deleteStory: async ({
		id,
	}: {
		id: string;
	}): Promise<mainSchema["StringApiResponse"]> =>
		await publicProxyApiFetcher.delete(`proxyApi/Webstory/${id}/Delete`).json(),
};

export default webstory;
