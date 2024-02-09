import { authFetcher } from "@/lib/fetcher";
import { getJwt } from "@/utils/auth";
import { mainSchema } from "../schema";

const library = {
	get: async (
		topLevelCategory: string,
		slug: string
	): Promise<mainSchema["ReturnWebStoryDTO"]> => {
		const data: mainSchema["ReturnWebStoryDTOApiResponse"] = await authFetcher(
			getJwt()
		)
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
