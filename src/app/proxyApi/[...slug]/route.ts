import {
  getAccessToken,
  withApiAuthRequired,
  AppRouteHandlerFn,
} from "@auth0/nextjs-auth0";

import { authFetcher } from "@/lib/fetcher";
import {NextResponse} from "next/server";

/**
 * Handler for the proxy API.  Traffic will be forwarded to the actual API server
 * along with an access token.
 * @todo Support other HTTP methods.
 */
const _GET: AppRouteHandlerFn = async (request) => {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/proxyApi/")) {
    return Response.json({ error: "Invalid path" }, { status: 404 });
  }

  const { accessToken } = await getAccessToken(request, new NextResponse());
  if (accessToken == null) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const newUrl = `${pathname.replace("/proxyApi", "api")}${request.nextUrl.search}`;
  return authFetcher(accessToken).get(newUrl);
};

export const GET = withApiAuthRequired(_GET);
