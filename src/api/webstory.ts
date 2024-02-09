import { authFetcher, mlFetcher, publicFetcher } from "@/lib/fetcher";
import schema from "./schema";
import { getJwt } from "@/utils/auth";

const webstory = {
	createUnauthorized: async (
		params: {
			prompt?: string;
			image_style?: schema["ImageStyles"];
			language?: schema["StoryLanguages"];
			length?: schema["StoryLength"];
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
			image_style?: schema["ImageStyles"];
			language?: schema["StoryLanguages"];
			length?: schema["StoryLength"];
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
