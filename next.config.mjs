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
			],
		};
	},
	images: {
		domains: ["ik.imagekit.io"],
	},
};

export default nextConfig;
