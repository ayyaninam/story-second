import { NextApiRequest, NextApiResponse } from "next";
import { MetadataRoute } from "next";
import { env } from "@/env.mjs";

async function fetchFromApi(endpoint: string) {
	try {
		const response = await fetch(env.NEXT_PUBLIC_API_URL + endpoint);
		if (!response.ok) {
			throw new Error(`Failed to fetch from API: ${response.statusText}`);
		}
		const { data } = await response.json();
		// limit to 30k responses
		return data.slice(0, 15000);
	} catch (error) {
		console.error(env.NEXT_PUBLIC_API_URL + endpoint);
		console.error(`Error fetching data from API: ${error}`);
		return [];
	}
}

async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const categories = await fetchFromApi("api/WebStory/GetAllCategories");
	const users = await fetchFromApi("api/User/GetAllUsers");

	// Define your static routes
	const staticRoutes = [""];

	const staticSitemap = staticRoutes.map((url: string) => {
		return {
			url: env.NEXT_PUBLIC_BASE_URL + url,
			changeFrequency: "monthly",
			priority: 1,
		};
	});

	const categorySitemap = await categories.map((category: string) => {
		return {
			url: `${env.NEXT_PUBLIC_BASE_URL}feed/${category}`,
			changeFrequency: "always",
			priority: 1,
		};
	});

	// NOTE: When enabled, check for the api response size
	// https://nextjs.org/docs/messages/api-routes-response-size-limit
	const userSitemap = await users.map((user: string) => {
		return {
			url: `${env.NEXT_PUBLIC_BASE_URL}${user}`,
			changeFrequency: "weekly",
			priority: 0.5,
		};
	});

	return [...staticSitemap, ...categorySitemap, ...userSitemap];
}

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
	try {
		const _sitemap = await sitemap();
		res.setHeader("Content-Type", "text/xml");
		res.write(`<?xml version="1.0" encoding="UTF-8"?>`);
		res.write('<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">');
		_sitemap.forEach((route) => {
			res.write(`
        <url>
          <loc>${route.url}</loc>
          <changefreq>${route.changeFrequency}</changefreq>
          <priority>${route.priority}</priority>
        </url>
      `);
		});
		res.write("</urlset>");
		res.end();
	} catch (error) {
		console.error(`Error generating sitemap: ${error}`);
		res.status(500).end();
	}
}
