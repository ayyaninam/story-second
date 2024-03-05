import { Button } from "@/components/ui/button";
import { AuthPromptProps } from "@/types";

function AuthPromptMobile({ onLogIn, onSignUp }: AuthPromptProps) {
	return (
		<div
			className="w-full bg-cover bg-center h-screen p-10"
			style={{
				backgroundImage: "url(/pre-auth/background.svg)",
				backgroundColor: "#334155",
			}}
		>
			<div className="flex flex-col items-center justify-center space-y-2 w-[100%] h-[95%] bg-white text-slate-900 shadow-2xl">

				<div className="pb-2 text-lg font-semibold">Get Started</div>
				<Button
					className={`p-1 w-[60%] shadow-sm bg-purple-600 text-xs text-white`}
					variant="outline"
					onClick={onSignUp}
				>
					Sign Up
				</Button>
				<Button
					className={`p-1 w-[60%] shadow-sm bg-slate-700 text-xs text-white`}
					variant="outline"
					onClick={onLogIn}
				>
					Log In
				</Button>
				<div className="text-xs text-muted-foreground">
					<a href="#">
						<u>Terms of Service</u>
					</a>{" "}
					and{" "}
					<a href="#">
						<u>Privacy Policy</u>
					</a>
				</div>
			</div>
		</div>
	);
}
export default AuthPromptMobile;
