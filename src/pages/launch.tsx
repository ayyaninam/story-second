import { Button } from "@/components/ui/button";
import StoryLogo from "../../public/auth-prompt/story-logo";
import Link from "next/link";
import Routes from "@/routes";

export default function LaunchPage() {
	return (
		<div
			className="flex w-full bg-cover bg-center h-fit lg:h-screen"
			style={{
				backgroundImage: "url(/auth-prompt/background.svg)",
				backgroundColor: "#334155",
				minHeight: "100vh",
			}}
		>
			<div className="w-full h-full flex flex-col lg:flex-row items-center gap-8">
				<div className="flex flex-col justify-between p-4 lg:p-8 h-fit lg:h-full w-full lg:max-w-[50%]">
					<StoryLogo />

					<div className="mt-2 lg:mt-0">
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
					<div className="w-full space-y-3 text-background text-center mt-4">
						<div className="w-full text-base">
							“Story.com has transformed storytelling for me. Creating AI movies
							is so easy.”
						</div>
						<div className="w-full text-sm">- Amanda Waldo</div>
					</div>
				</div>
				<div className="w-full lg:max-w-[50%]">
					<div className="flex flex-col items-center justify-center w-[100%] h-[100%] text-white text-center px-4 pb-8">
						<div className="max-w-lg">
							<div>
								<h1 className="text-3xl font-bold">
									Story.com Early Access is Live!
								</h1>
								<p className="text-lg mt-1">
									Unleash Your Imagination with AI-Driven Storytelling
								</p>
								<p className="text-base mt-2">
									Welcome to Story.com, where your stories come to life through
									the power of AI. Our Early Access gives you a first look at
									transforming ideas into captivating narratives and videos, all
									with a click.
								</p>
							</div>
							<div className="h-[1px] w-full bg-white mt-6" />
							<div className="mt-6">
								<h2 className="text-2xl font-bold">Grab Your Starter Plan</h2>
								<p className="text-base mt-1">
									Start exploring the future of storytelling with your Starter
									Plan. Dive into AI-generated movies and books tailored just
									for you.
								</p>
								<Link href={Routes.Login(Routes.defaultRedirect)}>
									<Button className="mt-4 hover:bg-purple-700/80">
										Claim Your Access
									</Button>
								</Link>
							</div>
							<div className="h-[1px] w-full bg-white mt-6" />
							<div className="mt-6 flex flex-col items-center">
								<p className="text-2xl font-bold">Support us on Product Hunt</p>
								<a
									href="https://www.producthunt.com/posts/ion-design?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-ion&#0045;design"
									target="_blank"
									className="mt-2"
								>
									<img
										src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=443868&theme=light"
										alt="ion&#0032;design - Instantly&#0032;turn&#0032;Figma&#0032;into&#0032;React&#0032;code | Product Hunt"
										style={{ width: "250px", height: "54px" }}
										width="250"
										height="54"
									/>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
