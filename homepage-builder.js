const esbuild = require("esbuild");

esbuild
	.build({
		entryPoints: ["./src/features/webflow/build.tsx"],
		outfile: "./public/landing/custominput.js",
		bundle: true,
		minify: true,
		sourcemap: false,
		format: "esm",
		tsconfig: "./tsconfig.json",
		define: {
			"process.env.NEXT_PUBLIC_API_URL": '"https://api.staging.storybird.ai"',
			"process.env.NEXT_PUBLIC_S3_BUCKET_PUBLIC": '"storybird-public"',
			"process.env.NEXT_PUBLIC_S3_BUCKET_INTERNAL": '"storybird-internal"',
			"process.env.NEXT_PUBLIC_AWS_REGION": '"us-west-2"',
		},
	})
	.then(() => console.log("⚡Bundle build complete ⚡"))
	.catch(() => {
		process.exit(1);
	});
