import ky from "ky";
import { env } from "@/env.mjs";

const baseFetcher = ky.create({ timeout: false, cache: "no-cache" });
/**
 * Creates a fetcher instance for making public requests.
 * This fetcher should be used in browser environments only.
 */
export const publicFetcher = baseFetcher.extend({
	prefixUrl: env.NEXT_PUBLIC_API_URL,
	headers: { "Content-Type": "application/json" },
});

/**
 * Fetcher for all ML ops.
 * This fetcher should be used in browser environments only.
 */
export const mlFetcher = (token: string) => {
	return baseFetcher.extend({
		prefixUrl: env.NEXT_PUBLIC_ML_API_URL,
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
	});
};

// TODO: add authenticated request instances
/**
 * Creates an authenticated fetcher instance by extending the public fetcher.
 * This fetcher should be used in browser environments only.
 */
export const authFetcher = (token: string) =>
	publicFetcher.extend({
		headers: {
			Authorization: "Bearer " + token,
		},
	});
