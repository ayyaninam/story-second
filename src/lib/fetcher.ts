import ky from "ky";
import { env } from "@/env.mjs";
import isBrowser from "@/utils/isBrowser";
import { getJwt } from "@/utils/auth";

/**
 * Creates a fetcher instance for making public requests.
 * This fetcher should be used in browser environments only.
 */
export const publicFetcher = ky.create({
	prefixUrl: env.NEXT_PUBLIC_API_URL,
	headers: { "Content-Type": "application/json" },
});

/**
 * Fetcher for all ML ops.
 * This fetcher should be used in browser environments only.
 */
export const mlFetcher = (token: string) => {
	return ky.create({
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
export const authFetcher = publicFetcher.extend({
	headers: {
		Authorization: isBrowser
			? "Bearer " + window.localStorage.getItem("jwt") || undefined
			: undefined,
	},
});
