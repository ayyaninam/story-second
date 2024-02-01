import { authFetcher } from "@/lib/fetcher";
import schema from "./schema";

const library = {
	get: async (
		topLevelCategory: string,
		slug: string
	): Promise<schema["ReturnWebStoryDTO"]> => {
		const data: schema["ReturnWebStoryDTOApiResponse"] = await authFetcher
			.get(`api/library/${topLevelCategory}/${slug}`)
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

export default library;
