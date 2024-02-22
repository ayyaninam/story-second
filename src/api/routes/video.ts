import { authFetcher, mlFetcher, publicFetcher } from "@/lib/fetcher";
import { mainSchema, mlSchema } from "../schema";
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
	editScene: async (
		params: mlSchema["EditSceneRequest"],
		accessToken?: string
	): Promise<Object> => {
		const data: string = await mlFetcher(accessToken ?? getJwt())
			.get(`edit-scene`, {
				body: JSON.stringify(params),
			})
			.json();

		return data;
	},
	editSegment: async (
		params: mlSchema["EditSegmentRequest"],
		accessToken?: string
	) => {
		const data: string = await mlFetcher(accessToken ?? getJwt())
			.put(`edit-segment`, {
				body: JSON.stringify(params),
			})
			.json();

		return data;
	},
	regenerateImage: async (
		params: mlSchema["RegenerateImageRequest"],
		accessToken?: string
	): Promise<unknown> => {
		const data = await mlFetcher(accessToken ?? getJwt())
			.post(`regenerate-image`, {
				body: JSON.stringify(params),
			})
			.json();

		return data;
	},
	render: async ({
		id,
		accessToken,
	}: {
		id: string;
		accessToken?: string;
	}): Promise<string | undefined | null> => {
		const data: mainSchema["StringApiResponse"] = await authFetcher(
			accessToken ?? getJwt()
		)
			.put(`api/Video/${id}/RenderVideo`, {
				searchParams: { storyItemSubType: 2 },
			})
			.json();
		const status = data.status;
		if (status === 204) return null;
		// console.log(response.data);
		if (!data.data) return null;
		return data?.data;
	},
};

export default video;
