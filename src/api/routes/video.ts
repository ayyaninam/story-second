import { authFetcher, mlFetcher, publicFetcher } from "@/lib/fetcher";
import { mainSchema } from "../schema";
import { getJwt } from "@/utils/jwt";
import { StoryOutputTypes } from "@/utils/enums";

const video = {
	getUploadUrl: async (
		params: { fileName: string; contentType: string },
		accessToken?: string
	): Promise<mainSchema["UploadToS3DTOApiResponse"]> => {
		return await authFetcher(accessToken || getJwt())
			.get(`api/Video/PreSignedUrl`, { searchParams: params })
			.json();
	},
	get: async (
		topLevelCategory: string,
		slug: string,
		storyType: StoryOutputTypes,
		accessToken?: string
	): Promise<mainSchema["ReturnVideoStoryDTO"]> => {
		const data: mainSchema["ReturnVideoStoryDTOApiResponse"] =
			await publicFetcher
				.get(`api/Video/${topLevelCategory}/${slug}`, {
					searchParams: { storyType },
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
	render: async ({
		id,
		accessToken,
	}: {
		id: string;
		accessToken?: string;
	}): Promise<string> => {
		const data: mainSchema["StringApiResponse"] = await authFetcher(
			accessToken ?? getJwt()
		)
			.put(`api/Video/${id}/RenderVideo`, {
				searchParams: { storyItemSubType: 2 },
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

export default video;
