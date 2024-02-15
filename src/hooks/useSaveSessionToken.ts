import { setJwt } from "@/utils/jwt";
import { Claims, Session } from "@auth0/nextjs-auth0";
import { useEffect } from "react";

export interface SessionType {
	[x: string]: any;
	user?: Claims | undefined;
	idToken?: string | undefined;
	accessToken?: string | undefined;
	accessTokenScope?: string | undefined;
	accessTokenExpiresAt?: number | undefined;
	refreshToken?: string | undefined;
}

const useSaveSessionToken = (session: SessionType) => {
	useEffect(() => {
		if (session) setJwt(session?.accessToken ?? "");
	}, [session]);
};

export default useSaveSessionToken;
