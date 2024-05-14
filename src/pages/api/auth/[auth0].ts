import { env } from "@/env.mjs";
import { handleAuth, handleLogin, handleLogout } from "@auth0/nextjs-auth0";
import Routes from "@/routes";
import { QueryClient } from "@tanstack/react-query";
import { NextApiRequest, NextApiResponse } from "next";

// Custom logout logic
const customLogout = async (req: NextApiRequest, res: NextApiResponse) => {
	const queryClient = new QueryClient();
	queryClient.clear(); // Clear React Query cache
	queryClient.removeQueries(); // Remove all queries
	handleLogout({
		returnTo: `${Routes.defaultRedirect}`,
	})(req, res);
};

export default handleAuth({
	login: handleLogin({
		authorizationParams: {
			audience: `${env.NEXT_PUBLIC_AUTH0_AUDIENCE}`,
			scope: "openid profile email offline_access",
		},
	}),
	logout: customLogout,
});
