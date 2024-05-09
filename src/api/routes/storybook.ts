import { publicFetcher } from "@/lib/fetcher";
import { mainSchema } from "@/api/schema";
import { PaginationParams } from "@/types";

const storybook = {
	getStory: async ({
		topLevelCategory,
		slug,
	}: {
		topLevelCategory: string;
		slug: string;
	}) => {
		const data: mainSchema["ReturnWebStoryDTOApiResponse"] = await publicFetcher
			.get(`api/StoryBook/${topLevelCategory}/${slug}`)
			.json();

		return data.data;
	},
	getSuggestedStories: async ({
		id,
		searchParams,
	}: {
		id: string;
		searchParams: PaginationParams;
	}): Promise<mainSchema["ReturnVideoStoryDTOListApiResponse"]> => {
		const data: mainSchema["ReturnVideoStoryDTOListApiResponse"] =
			await publicFetcher
				.get(`api/StoryBook/${id}/Suggested`, {
					searchParams,
				})
				.json();

		if (!data.succeeded) {
		}

		if (!data.data) {
			throw new Error("No data returned");
		}

		return data;
	},
};

export default storybook;
