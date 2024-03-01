import { handleLogin } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

const signupHandler = (req: NextApiRequest, res: NextApiResponse) =>
	handleLogin(req, res, {
		authorizationParams: {
			screen_hint: "signup",
			audience: `${process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}`,
		},
	});

export default signupHandler;
