import { authFetcher, mlFetcher, publicFetcher } from "@/lib/fetcher";
import schema from "./schema";

const webstory = {
	createUnauthorized: async (params: {
		prompt?: string;
		image_style?: schema["ImageStyles"];
		language?: schema["StoryLanguages"];
		length?: schema["StoryLength"];
	}): Promise<{
		title: string;
		englishTitle: string;
		blurb: string;
		category: string;
		cover_image: string;
		image_style: number;
		url: string;
	}> =>
		await mlFetcher
			.post(`create-story`, {
				body: JSON.stringify(params),
			})
			.json(),

	create: async (
		params: schema["RequestStoryDTO"]
	): Promise<schema["ReturnAnonymousStoryDTOApiResponse"]> =>
		await authFetcher
			.post(`api/WebStory`, { body: JSON.stringify(params) })
			.json(),
};

export default webstory;
