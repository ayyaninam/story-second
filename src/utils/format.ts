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

	public static GetVideoUrl(key: string) {
		return `https://ik.imagekit.io/storybird/staging/${key}`;
	}

	public static GetPublicBucketObjectUrl(object: string) {
		return this.GetBucketObjectUrl(object, {
			bucket: env.NEXT_PUBLIC_S3_BUCKET_PUBLIC,
			region: env.NEXT_PUBLIC_AWS_REGION,
		});
	}
	public static Title(string: string | undefined | null) {
		if (!string) return string;
		return string
			.toLowerCase()
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}
	public static AvatarName(string: string | undefined | null) {
		if (!string) return string;
		if (string.includes(" "))
			return string
				.split(" ")
				.map((el) => el.charAt(0))
				.join()
				.toUpperCase();
		else return string.slice(0, 2).toUpperCase();
	}
	public static TruncateText(string: string | undefined | null, limit: number) {
		if (!string) return string;
		return string.slice(0, limit);
	}
	public static TruncateTextWithEllipses(
		string: string | undefined | null,
		limit: number
	) {
		if (!string || string.length < limit) return string;
		return string.slice(0, limit) + "...";
	}
	public static Pluralize(string: string | undefined | null, n: number) {
		if (!string || n === 1) return string;
		else return string + "s";
	}
}
export default Format;
