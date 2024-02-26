import { Button } from "@/components/ui/button";
import { AuthPromptProps } from "@/types";
import StoryLogo from "../../../public/auth-prompt/story-logo";

export default function AuthPrompt({ onLogIn, onSignUp }: AuthPromptProps) {
	return (
		<div
			className="flex w-full bg-cover bg-center h-screen"
			style={{
				backgroundImage: "url(/auth-prompt/background.svg)",
				backgroundColor: "#334155",
			}}
		>
			{/* Div 1 */}
			<div className="w-full flex flex-col justify-between p-8 lg:max-w-[68%] md:max-w-[50%]">
				<StoryLogo />

				{/* This can be replaced with some dynamic data as well */}
				<div className="w-full space-y-3 max-w-[80%] text-background">
					<div className="w-full text-base">
						“This library has saved me countless hours of work and helped me
						deliver stunning designs to my clients faster than ever before.”
					</div>
					<div className="w-full text-sm">Sofia Davis</div>
				</div>
			</div>
			{/* Div 2 */}
			<div className="w-full lg:max-w-[40%] md:max-w-[50%] p-12 bg-purple-600">
				<div className="flex flex-col items-center justify-center space-y-2 bg-white w-[100%] h-[100%] text-slate-900 shadow-2xl">
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
		</div>
	);
}
