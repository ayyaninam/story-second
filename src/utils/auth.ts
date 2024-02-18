import { getAccessToken, getSession } from "@auth0/nextjs-auth0";
import isBrowser from "./isBrowser";
import { IncomingMessage, ServerResponse } from "http";
import Routes from "@/routes";

export const getServerSideSessionWithRedirect = async (
	req: IncomingMessage & {
		cookies: Partial<{
			[key: string]: string;
		}>;
	},
	res: ServerResponse<IncomingMessage>,
	returnTo = Routes.authpage,
	returnParams = {}
) => {
	try {
		const session = await getSession(req, res);
		// console.log(session);
		if (!session?.accessToken)
			throw new AuthError(
				"No access token found",
				Routes.ToAuthPage(returnTo, returnParams)
			);
		return session;
	} catch (e) {
		throw new AuthError(
			"Please sign in before accessing this route",
			Routes.ToAuthPage(returnTo, returnParams)
		);
	}
};

export class AuthError extends Error {
	public redirect: string;
	constructor(message: any, redirect: string) {
		super(message);
		this.name = "AuthError";
		this.redirect = redirect;
	}
}
