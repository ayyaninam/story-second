import { authFetcher, publicFetcher } from "@/lib/fetcher";
import schema from "./schema";

const webstory = {
	createUnauthorized: async (
		params: schema["RequestStoryDTO"]
	): Promise<schema["ReturnAnonymousStoryDTOApiResponse"]> =>
		await publicFetcher
			.post(`api/WebStory/NoAuth`, { body: JSON.stringify(params) })
			.json(),

	create: async (
		params: schema["RequestStoryDTO"]
	): Promise<schema["ReturnAnonymousStoryDTOApiResponse"]> =>
		await authFetcher
			.post(`api/WebStory`, { body: JSON.stringify(params) })
			.json(),
};

export default webstory;
