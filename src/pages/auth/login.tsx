import AuthPrompt from "@/features/auth-prompt";
import AuthPromptMobile from "@/features/auth-prompt/mobile";
import Routes from "@/routes";
import { useRouter } from "next/router";
import { useMediaQuery } from "usehooks-ts";

export default function LoginPage() {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const router = useRouter();
	const onLogIn = () => {
		router.push(Routes.Login(router.query?.returnTo as string | undefined));
	};
	const onSignUp = () => {
		router.push(Routes.Signup(router.query?.returnTo as string | undefined));
	};

	if (isMobile)
		return <AuthPromptMobile onLogIn={onLogIn} onSignUp={onSignUp} />;
	return <AuthPrompt onLogIn={onLogIn} onSignUp={onSignUp}></AuthPrompt>;
}
