import { ManagementClient } from "auth0";
import type { NextApiRequest, NextApiResponse } from "next";

const auth0 = new ManagementClient({
	domain:
		process.env.AUTH0_ISSUER_BASE_URL?.replace(/https:\/\/|\/$/g, "") ?? "",
	clientId: process.env.AUTH0_CLIENT_ID ?? "",
	clientSecret: process.env.AUTH0_CLIENT_SECRET ?? "",
});

export default async function sendVerificationEmail(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { user_id } = req.body;
		const job = await auth0.jobs.verifyEmail({
			user_id: user_id,
		});

		res.status(200).json(job);
	} catch (error) {
		// @ts-ignore
		res.status(error.statusCode || 500).json({ message: error.message });
	}
}
