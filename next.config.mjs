/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
<<<<<<< Updated upstream
	async rewrites() {
		return {
			afterFiles: [
				{
					source: "/homepage",
					destination: "/landing/index.html",
				},
			],
		};
=======
	images: {
		domains: ["ik.imagekit.io"],
>>>>>>> Stashed changes
	},
	images: {
		domains: ["ik.imagekit.io"],
	},
};

export default nextConfig;
