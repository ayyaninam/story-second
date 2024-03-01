import { env } from "@/env.mjs";
import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";


// handleCallback
export default handleAuth({
	login: handleLogin({
		authorizationParams: {
			audience: `${env.NEXT_PUBLIC_AUTH0_AUDIENCE}`,
		},
	}),
});
