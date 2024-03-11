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
				height: "100vh",
			}}
		>
			{/* Div 1 */}
			<div className="flex flex-col justify-between p-4 lg:p-8 w-full lg:max-w-[68%] md:max-w-[50%] overflow-auto">
				<StoryLogo />

				<div className="">
					<video
						src={"/videos/auth-value.mp4"}
						autoPlay
						loop
						controls
						muted
						className="mx-auto rounded-2xl shadow-2xl"
						style={{ maxHeight: "50vh", maxWidth: "100%" }}
					/>
				</div>

				{/* This can be replaced with some dynamic data as well */}
				<div className="w-full space-y-3 text-background text-center">
					<div className="w-full text-base">
						“Story.com has transformed storytelling for me. Creating AI movies
						is so easy.”
					</div>
					<div className="w-full text-sm">- Amanda Waldo</div>
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
