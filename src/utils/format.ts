import { env } from "@/env.mjs";
import dayjs, { Dayjs } from "dayjs";

class Format {
	private static GetBucketObjectUrl(
		object: string,
		params: { bucket: string; region: string }
	) {
		return `https://${params.bucket}.s3.${params.region}.amazonaws.com/${object}`;
	}

	public static GetImageUrl(key: string) {
		return `${env.NEXT_PUBLIC_IMAGEKIT_URL}/${key}`;
	}

	public static GetVideoUrl(key: string) {
		return `${env.NEXT_PUBLIC_IMAGEKIT_URL}/${key}`;
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
	public static AvatarName(
		firstName: string | null | undefined,
		lastName: string | null | undefined
	) {
		if (!firstName) return "";
		if (lastName) {
			return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
		}
		return firstName.slice(0, 2).toUpperCase();
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

	public static DateDisplay(val: string | Dayjs) {
		let date = val;
		if (typeof date === "string") {
			date = dayjs(date);
		}
		return date.format("DD MMM, YYYY");
	}
}
export default Format;
