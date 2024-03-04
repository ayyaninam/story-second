import { env } from "@/env.mjs";
import {handleAuth, handleLogin, handleLogout} from "@auth0/nextjs-auth0";
import Routes from "@/routes";


// handleCallback
export default handleAuth({
	login: handleLogin({
		authorizationParams: {
			audience: `${env.NEXT_PUBLIC_AUTH0_AUDIENCE}`,
			scope: "openid profile email offline_access",
		},
	}),
	logout: handleLogout({ returnTo: `${Routes.defaultRedirect}` }),
});
