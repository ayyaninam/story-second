/** @type {import('next').NextConfig} */

const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
	pwa: {
		dest: "public",
	},
});

const nextConfig = {
	reactStrictMode: true,
	// Make custominput file cached so that it won't be get-pull again
	async headers() {
		return [
			{
				source: "/landing/fonts/:font",
				headers: [{ key: "Cache-Control", value: "max-age=10000" }],
			},
			// {
			// 	source: "/landing/custominput.js",
			// 	headers: [{ key: "Cache-Control", value: "max-age=10000" }],
			// },
			{
				// matching all API routes
				source: "/:path*",
				headers: [
					{ key: "Access-Control-Allow-Credentials", value: "true" },
					{ key: "Access-Control-Allow-Origin", value: "*" },
					{
						key: "Access-Control-Allow-Methods",
						value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
					},
					{
						key: "Access-Control-Allow-Headers",
						value:
							"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
					},
				],
			},
		];
	},
	async rewrites() {
    if (maintenanceMode) {
      return {
        afterFiles: [
          {
            source: "/(.*)",
            destination: "/feed/all",
          },
        ],
      };
    }
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
					destination: "/landing/tiktok.html",
				},
				{
					source: "/sitemap.xml",
					destination: "/api/sitemap",
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
      {
        source: '/feed',
        destination: '/feed/all',
        permanent: true,
      },
      {
        source: '/library',
        destination: '/library/all',
        permanent: true,
      },
		];
	},
	images: {
    unoptimized: true,
		remotePatterns: [
			{
				hostname: "ik.imagekit.io",
			},
		],
	},
};

export default withPWA(nextConfig);
