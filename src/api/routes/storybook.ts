import { publicFetcher } from "@/lib/fetcher";
import { mainSchema } from "@/api/schema";
import { PaginationParams } from "@/types";
import { StoryOutputTypes } from "@/utils/enums";

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
		storyType,
		searchParams,
	}: {
		id: string;
		storyType: StoryOutputTypes;
		searchParams: PaginationParams;
	}): Promise<mainSchema["ReturnVideoStoryDTOPagedListApiResponse"]> => {
		const data: mainSchema["ReturnVideoStoryDTOPagedListApiResponse"] =
			await publicFetcher
				.get(`api/StoryBook/${id}/Suggested`, {
					searchParams: { storyType: storyType, ...searchParams },
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
