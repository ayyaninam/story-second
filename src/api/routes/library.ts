import { authFetcher, publicFetcher } from "@/lib/fetcher";
import { getJwt } from "@/utils/jwt";
import { mainSchema } from "../schema";

const library = {
	get: async (
		topLevelCategory: string,
		slug: string,
		accessToken?: string
	): Promise<mainSchema["ReturnVideoStoryDTO"]> => {
		const data: mainSchema["ReturnVideoStoryDTOApiResponse"] =
			await publicFetcher.get(`api/library/${topLevelCategory}/${slug}`).json();

		if (!data.succeeded) {
			// TODO:figure out error boundaries
		}

		if (!data.data) {
			throw new Error("No data returned");
		}

		return data.data;
	},
	likeVideo: async ({
		id,
		params,
		token,
	}: {
		id: string;
		params: mainSchema["LikeStoryDTO"];
		token?: string;
	}): Promise<boolean> => {
		const data: mainSchema["BooleanApiResponse"] = await authFetcher(
			token || getJwt()
		)
			.patch(`api/Library/${id}/Like`, {
				body: JSON.stringify(params),
			})
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
