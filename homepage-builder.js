const esbuild = require("esbuild");
require("dotenv").config();

esbuild
	.build({
		entryPoints: ["./src/features/landing/build.tsx"],
		outfile: "./public/landing/custominput.js",
		bundle: true,
		minify: true,
		sourcemap: false,
		treeShaking: true,
		format: "esm",
		tsconfig: "./tsconfig.json",
		define: {
			"process.env.NEXT_PUBLIC_API_URL": '"https://api.staging.storybird.ai"',
			"process.env.NEXT_PUBLIC_S3_BUCKET_PUBLIC": '"storybird-public"',
			"process.env.NEXT_PUBLIC_AWS_REGION": '"us-west-2"',
			"process.env.NEXT_PUBLIC_IMAGEKIT_URL":
				'"https://ik.imagekit.io/storybird/staging"',
			"process.env.NEXT_PUBLIC_TEMP_ACCESS_KEY": '"279a0580e6e05f2951825ba2"',
			"process.env.NEXT_PUBLIC_ML_API_URL": `"https://ml.staging.authorly.ai"`,
		},
	})
	.then(() => console.log("⚡Bundle build complete ⚡"))
	.catch(() => {
		process.exit(1);
	});
