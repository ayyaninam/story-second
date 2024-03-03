import { NextRequest, NextResponse } from "next/server";
import {
  getAccessToken,
  withMiddlewareAuthRequired,
} from "@auth0/nextjs-auth0/edge";
import { env } from "@/env.mjs";

/**
 * URL pattern to match for this middleware.
 */
export const config = {
  matcher: "/proxyApi/:path*",
};

async function middleware(request: NextRequest) {
  /**
   * Add access token to the request headers
   */
  const { accessToken } = await getAccessToken(request, new NextResponse());
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Authorization", `Bearer ${accessToken}`);

  /**
   * Rewrite the URL to the actual API server
   */
  const { pathname, search } = request.nextUrl;
  const newUrl = `${env.NEXT_PUBLIC_API_URL}${pathname.replace("/proxyApi", "api")}${search}`;
  return NextResponse.rewrite(newUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}

export default withMiddlewareAuthRequired(middleware);
