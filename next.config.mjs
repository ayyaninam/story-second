/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async rewrites() {
		return {
			afterFiles: [
				{
					source: "/",
					destination: "/landing/index.html",
				},
				{
					source: "/404",
					destination: "/landing/404.html",
				},
				{
					source: "/tiktok",
					destination: "/tiktok/index.html",
				},
			],
		};
	},
	async redirects() {
		return [
			{
				source: "/video/:slug*/view",
				destination: "/video/:slug*", // Matched parameters can be used in the destination
				permanent: true,
			},
		];
	},
	images: {
		domains: ["ik.imagekit.io"],
	},
};

export default nextConfig;
