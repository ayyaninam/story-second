import { authFetcher, mlFetcher, publicFetcher } from "@/lib/fetcher";
import { mainSchema } from "../schema";
import { getJwt } from "@/utils/auth";

const video = {
	getUploadUrl: async (
		params: { fileName: string; contentType: string },
		token?: string
	): Promise<mainSchema["UploadToS3DTOApiResponse"]> => {
		return await authFetcher(token || getJwt())
			.get(`api/Video/PreSignedUrl`, { searchParams: params })
			.json();
	},
};

export default video;
