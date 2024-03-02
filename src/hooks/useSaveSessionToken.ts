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

const useSaveSessionToken = (accessToken: string | null | undefined) => {
	useEffect(() => {
		if (accessToken) setJwt(accessToken ?? "");
	}, [accessToken]);
};

export default useSaveSessionToken;
