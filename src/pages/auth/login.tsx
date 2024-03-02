import AuthPrompt from "@/features/auth-prompt";
import AuthPromptMobile from "@/features/auth-prompt/mobile";
import Routes from "@/routes";
import { useRouter } from "next/router";
import { useMediaQuery } from "usehooks-ts";
import {useEffect} from "react";
import {useUser} from "@auth0/nextjs-auth0/client";

export default function LoginPage() {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const router = useRouter();
	const returnTo = router.query.returnTo === "/auth/login" ? Routes.defaultRedirect : router.query.returnTo as string || Routes.defaultRedirect;
	const { user, error, isLoading } = useUser();


	// Disabled: This is causing a fake login redirect
	// useEffect(() => {
	// 	if (isLoading) return;
	// 	console.log("user", user, "error", error, "isLoading", isLoading)
	// 	console.log("returnTo", returnTo)
	// 	if (user) {
	// 		router.push(returnTo);
	// 	}
	// }, [isLoading]);


	const onLogIn = () => {
		router.push(Routes.Login(returnTo));
	};
	const onSignUp = () => {
		router.push(Routes.Signup(returnTo));
	};

	if (isMobile)
		return <AuthPromptMobile onLogIn={onLogIn} onSignUp={onSignUp} />;
	return <AuthPrompt onLogIn={onLogIn} onSignUp={onSignUp}></AuthPrompt>;
}
