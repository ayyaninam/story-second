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
  const { accessToken } = await getAccessToken(request, new NextResponse());
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Authorization", `Bearer ${accessToken}`);

  const newUrl = `${env.NEXT_PUBLIC_API_URL}${request.nextUrl.pathname.replace("/proxyApi", "api")}${request.nextUrl.search}`;
  return NextResponse.rewrite(newUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}

export default withMiddlewareAuthRequired(middleware);
