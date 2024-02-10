import { authFetcher, mlFetcher, publicFetcher } from "@/lib/fetcher";
import { mainSchema } from "./schema";
import { getJwt } from "@/utils/auth";

const webstory = {
	createUnauthorized: async (
		params: {
			prompt?: string;
			image_style?: mainSchema["ImageStyles"];
			language?: mainSchema["StoryLanguages"];
			length?: mainSchema["StoryLength"];
		},
		token: string
	): Promise<{
		title: string;
		englishTitle: string;
		blurb: string;
		category: string;
		cover_image: string;
		image_style: number;
		url: string;
	}> =>
		await mlFetcher(token ?? getJwt())
			.post(`create-story`, {
				body: JSON.stringify(params),
			})
			.json(),

	create: async (
		params: {
			prompt?: string;
			image_style?: mainSchema["ImageStyles"];
			language?: mainSchema["StoryLanguages"];
			length?: mainSchema["StoryLength"];
			image_resolution: number;
		},
		token?: string
	): Promise<{
		title: string;
		englishTitle: string;
		blurb: string;
		category: string;
		cover_image: string;
		image_style: number;
		url: string;
	}> =>
		await mlFetcher(token || getJwt())
			.post(`create-story`, {
				body: JSON.stringify(params),
			})
			.json(),
};

export default webstory;
