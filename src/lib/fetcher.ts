import ky from "ky";
import { env } from "@/env.mjs";

export const publicFetcher = ky.create({ prefixUrl: env.NEXT_PUBLIC_API_URL });

// TODO: add authenticated request instances
export const authFetcher = publicFetcher.extend({});
