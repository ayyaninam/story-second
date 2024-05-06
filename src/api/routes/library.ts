import { publicProxyApiFetcher } from "@/lib/fetcher";
import { mainSchema } from "../schema";
import { LibraryPageVideoQueryOptions, PaginationParams } from "@/types";
import { StoryOutputTypes } from "@/utils/enums";

const library = {
	getStories: async ({
		params,
	}: {
		params: LibraryPageVideoQueryOptions;
	}): Promise<
		| mainSchema["ReturnWebStoryDTOPagedList"]
		| mainSchema["ReturnVideoStoryDTOPagedList"]
	> => {
		const { topLevelCategory, storyType } = params;
		const endpoint =
			storyType === StoryOutputTypes.Story
				? `proxyApi/User/StoryBooks/${topLevelCategory}`
				: `proxyApi/User/Videos/${topLevelCategory}`;

		const searchParams = {
			...params,
			topLevelCategory: "",
		};

		const data:
			| mainSchema["ReturnWebStoryDTOPagedListApiResponse"]
			| mainSchema["ReturnVideoStoryDTOPagedListApiResponse"] =
			await publicProxyApiFetcher
				.get(endpoint, {
					searchParams,
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
	likeVideo: async ({
		id,
		params,
		token,
	}: {
		id: string;
		params: mainSchema["LikeStoryDTO"];
		token?: string;
	}): Promise<boolean> => {
		const data: mainSchema["BooleanApiResponse"] = await publicProxyApiFetcher
			.patch(`proxyApi/Library/${id}/Like`, {
				body: JSON.stringify(params),
				headers: {
					"Content-Type": "application/json",
				},
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
	getSuggestedStories: async ({
		id,
		searchParams,
	}: {
		id: string;
		searchParams: PaginationParams;
	}): Promise<mainSchema["ReturnVideoStoryDTOListApiResponse"]> => {
		const data: mainSchema["ReturnVideoStoryDTOListApiResponse"] =
			await publicProxyApiFetcher
				.get(`proxyApi/Library/${id}/Suggested`, {
					searchParams,
				})
				.json();
		console.log(data);

		if (!data.succeeded) {
		}

		if (!data.data) {
			throw new Error("No data returned");
		}

		return data;
	},
};

export default library;
