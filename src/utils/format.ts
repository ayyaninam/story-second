import { env } from "@/env.mjs";

class Format {
	private static GetBucketObjectUrl(
		object: string,
		params: { bucket: string; region: string }
	) {
		return `https://${params.bucket}.s3.${params.region}.amazonaws.com/${object}`;
	}

	public static GetImageUrl(key: string) {
		return `https://ik.imagekit.io/storybird/staging/${key}`;
	}

	public static GetPublicBucketObjectUrl(object: string) {
		return this.GetBucketObjectUrl(object, {
			bucket: env.NEXT_PUBLIC_S3_BUCKET_PUBLIC,
			region: env.NEXT_PUBLIC_AWS_REGION,
		});
	}
	public static GetInternalBucketObjectUrl(object: string) {
		return this.GetBucketObjectUrl(object, {
			bucket: env.NEXT_PUBLIC_S3_BUCKET_INTERNAL,
			region: env.NEXT_PUBLIC_AWS_REGION,
		});
	}
}
export default Format;
