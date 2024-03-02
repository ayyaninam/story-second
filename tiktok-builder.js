const esbuild = require("esbuild");
require("dotenv").config();

esbuild
	.build({
		entryPoints: ["./src/features/tiktok/build.tsx"],
		outfile: "./public/tiktok/prompt-script.js",
		bundle: true,
		minify: true,
		sourcemap: false,
		treeShaking: true,
		format: "esm",
		tsconfig: "./tsconfig.json",
		define: {
			"process.env.NEXT_PUBLIC_BASE_URL": `"${process.env.NEXT_PUBLIC_BASE_URL}"`,
			"process.env.NEXT_PUBLIC_API_URL": `"${process.env.NEXT_PUBLIC_API_URL}"`,
			"process.env.NEXT_PUBLIC_S3_BUCKET_PUBLIC": `"${process.env.NEXT_PUBLIC_S3_BUCKET_PUBLIC}"`,
			"process.env.NEXT_PUBLIC_AWS_REGION": `"${process.env.NEXT_PUBLIC_AWS_REGION}"`,
			"process.env.NEXT_PUBLIC_IMAGEKIT_URL": `"${process.env.NEXT_PUBLIC_IMAGEKIT_URL}"`,
			"process.env.NEXT_PUBLIC_TEMP_ACCESS_KEY": `"${process.env.NEXT_PUBLIC_TEMP_ACCESS_KEY}"`,
			"process.env.NEXT_PUBLIC_ML_API_URL": `"${process.env.NEXT_PUBLIC_ML_API_URL}"`,
			"process.env.NEXT_PUBLIC_AUTH0_AUDIENCE": `"${process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}"`,
			"process.env.NEXT_PUBLIC_DISABLE_UNIMPLEMENTED_FEATURES": `"${process.env.NEXT_PUBLIC_DISABLE_UNIMPLEMENTED_FEATURES}"`,
			"process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": `"${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}"`,
			"process.env.NEXT_PUBLIC_VERCEL_URL": `"${process.env.NEXT_PUBLIC_VERCEL_URL}"`,
		},
	})
	.then(() => console.log("⚡Bundle build complete ⚡"))
	.catch(() => {
		process.exit(1);
	});
