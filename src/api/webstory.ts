import { authFetcher } from "@/lib/fetcher";
import schema from "./schema";

const webstory = {
	create: async (
		params: schema["RequestStoryDTO"]
	): Promise<schema["StringApiResponse"]> =>
		await authFetcher
			.post(`api/WebStory`, { body: JSON.stringify(params) })
			.json(),
};

export default webstory;
