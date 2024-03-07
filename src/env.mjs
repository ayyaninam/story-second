import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	/*
	 * Serverside Environment variables, not available on the client.
	 * Will throw if you access these variables on the client.
	 */
	server: {},
	/*
	 * Environment variables available on the client (and server).
	 *
	 * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
	 */
	client: {
		NEXT_PUBLIC_BASE_URL: z.string().min(1),
		NEXT_PUBLIC_API_URL: z.string().min(1),
		NEXT_PUBLIC_S3_BUCKET_PUBLIC: z.string().min(1),
		NEXT_PUBLIC_AWS_REGION: z.string().min(1),
		NEXT_PUBLIC_IMAGEKIT_URL: z.string().min(1),
		NEXT_PUBLIC_ML_API_URL: z.string().min(1),
		NEXT_PUBLIC_AUTH0_AUDIENCE: z.string().min(1),
		NEXT_PUBLIC_DISABLE_UNIMPLEMENTED_FEATURES: z
			.string()
			.transform((v) => v === "true")
			.default(false),
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
			.string()
			.min(1)
			.optional()
			.default(""),
    NEXT_PUBLIC_VERCEL_ENVIRONMENT: z.string().min(1),
	},
	/*
	 * Due to how Next.js bundles environment variables on Edge and Client,
	 * we need to manually destructure them to make sure all are included in bundle.
	 *
	 * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
	 */
	runtimeEnv: {
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_S3_BUCKET_PUBLIC: process.env.NEXT_PUBLIC_S3_BUCKET_PUBLIC,
		NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
		NEXT_PUBLIC_IMAGEKIT_URL: process.env.NEXT_PUBLIC_IMAGEKIT_URL,
		NEXT_PUBLIC_ML_API_URL: process.env.NEXT_PUBLIC_ML_API_URL,
		NEXT_PUBLIC_AUTH0_AUDIENCE: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
		NEXT_PUBLIC_DISABLE_UNIMPLEMENTED_FEATURES:
			process.env.NEXT_PUBLIC_DISABLE_UNIMPLEMENTED_FEATURES,
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_VERCEL_ENVIRONMENT: process.env.NEXT_PUBLIC_VERCEL_ENVIRONMENT,
	},
});
