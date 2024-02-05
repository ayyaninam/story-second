import ky from "ky";
import { env } from "@/env.mjs";
import isBrowser from "@/utils/isBrowser";

/**
 * Creates a fetcher instance for making public requests.
 * This fetcher should be used in browser environments only.
 */
export const publicFetcher = ky.create({
	prefixUrl: env.NEXT_PUBLIC_API_URL,
	headers: { "Content-Type": "application/json" },
});

/**
 * Fetcher for all ML ops
 * This fetcher should be used in browser environments only.
 */
export const mlFetcher = ky.create({
	prefixUrl: env.NEXT_PUBLIC_ML_API_URL,
	headers: {
		"Content-Type": "application/json",
		Authorization: isBrowser()
			? "Bearer " + window.localStorage.getItem("jwt") || undefined
			: undefined,
	},
});

// TODO: add authenticated request instances
/**
 * Creates an authenticated fetcher instance by extending the public fetcher.
 * This fetcher should be used in browser environments only.
 */
export const authFetcher = publicFetcher.extend({
	headers: {
		Authorization: isBrowser()
			? "Bearer " + window.localStorage.getItem("jwt") || undefined
			: undefined,
	},
});
