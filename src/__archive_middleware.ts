// import {NextRequest, NextResponse} from 'next/server';
// import { getSession } from '@auth0/nextjs-auth0';
// import {withMiddlewareAuthRequired} from "@auth0/nextjs-auth0/edge";
//
//
// // Rework this later
// // Issue with current implementation is that it redirects to /api/auth/login
// // We need to redirect to /auth/login?returnTo=...
// // this is the custom auth decision page
// export const config = {
//     matcher: [
//     ],
// }
//
// // export function middleware(req: NextRequest) {
// //     const url = req.nextUrl.clone()
// //     url.pathname = "/auth/login"
// //     url.searchParams.set("returnTo", req.nextUrl.pathname)
// //     return NextResponse.rewrite(url);
// // }
// //
// //
// export default withMiddlewareAuthRequired();
