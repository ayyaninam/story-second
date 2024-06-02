import AuthPrompt from "@/features/auth-prompt";
import AuthPromptMobile from "@/features/auth-prompt/mobile";
import Routes from "@/routes";
import { useRouter } from "next/router";
import { useMediaQuery } from "usehooks-ts";
import useEventLogger from "@/utils/analytics";
import { NextSeo } from "next-seo";

export default function LoginPage() {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const router = useRouter();
	const eventLogger = useEventLogger();
	const returnTo =
		router.query.returnTo === "/auth/login"
			? Routes.defaultRedirect
			: (router.query.returnTo as string) || Routes.defaultRedirect;

	const onLogIn = () => {
		eventLogger("login_page_login_clicked");
		router.push(Routes.Login(returnTo));
	};
	const onSignUp = () => {
		eventLogger("login_page_signup_clicked");
		router.push(Routes.Signup(returnTo));
	};

	eventLogger("login_page_viewed");
	

	return (
		<>
			<NextSeo
				title="Get Started"
				description="Login to your account"
				openGraph={{
					title: "Get Started",
					description: "Login to your account",
				}}
				noindex
			/>
			<style jsx global>
				{`
					:root {
						.intercom-launcher {
							display: none;
						}
					}
				`}
			</style>
			{isMobile ? (
				<AuthPromptMobile onLogIn={onLogIn} onSignUp={onSignUp} />
			) : (
				<AuthPrompt onLogIn={onLogIn} onSignUp={onSignUp}></AuthPrompt>
			)}
		</>
	);
}
