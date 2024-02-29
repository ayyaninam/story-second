import { publicFetcher } from "@/lib/fetcher";
import { mainSchema } from "@/api/schema";

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
};

export default storybook;
