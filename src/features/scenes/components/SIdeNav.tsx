import { Button } from "@/components/ui/button";
import AuthorlyLogo from "../../../../public/auth-prompt/authorly-logo";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { mainSchema } from "@/api/schema";
import Format from "@/utils/format";
import ExploreIcon from "../../../../public/scenes/explore-icon";
import { Command } from "lucide-react";
import GenerateIcon from "../../../../public/scenes/generate-icon";
import LibraryIcon from "../../../../public/scenes/library-icon";
import ChallengesIcon from "../../../../public/scenes/challenges-icon";

export default function SideNav({
	isLoading,
	WebstoryData,
}: {
	WebstoryData?: mainSchema["ReturnVideoStoryDTO"];
	isLoading?: boolean;
}) {
	return (
		<div className="w-[20%] flex flex-col-reverse justify-between">
			<div className="flex-col m-5 space-y-1 items-center text-background">
				<p>Base Plan</p>

				<div className="flex text-xs items-center gap-2">
					<div className="flex border-slate-700 border-[1px] p-1 rounded-sm">
						1/10
					</div>
					Videos
					<div className="flex border-slate-700 border-[1px] p-1 rounded-sm">
						0/10
					</div>
					Stories
				</div>

				<div className="flex text-xs items-center gap-2">
					<div className="flex border-slate-700 border-[1px] p-1 rounded-sm">
						32
					</div>
					Credits
					<div className="flex border-slate-700 border-[1px] p-1 rounded-sm">
						17
					</div>
					Days till Reset
				</div>

				<div className="w-full flex text-muted-foreground space-x-2 items-center justify-center">
					<Button
						className="w-full p-2 bg-primary text-background"
						variant="outline"
					>
						Upgrade Authorly
					</Button>
				</div>
			</div>
			<div>
				<div className="flex m-5 items-center justify-between">
					<AuthorlyLogo />

					<div className="flex gap-x-2.5">
						{isLoading ? (
							<Skeleton className="w-[44px] h-[44px] rounded-full" />
						) : (
							<Avatar className="h-11 w-11">
								<AvatarImage
									src={WebstoryData?.user?.profilePicture ?? undefined}
								/>
								<AvatarFallback>
									{Format.AvatarName(WebstoryData?.user?.name)}
								</AvatarFallback>
							</Avatar>
						)}
					</div>
				</div>

				<div>
					<div className="flex gap-2 items-center text-secondary">
						<ExploreIcon /> <p>Explore</p>{" "}
						<div className="flex flex-grow justify-end items-center">
							<Command className="h-4 w-4 stroke-muted-foreground" />
							<p className="ml-1 text-sm">E</p>
						</div>
					</div>
					<div className="flex gap-2 items-center text-secondary">
						<GenerateIcon /> <p>Generate</p>{" "}
						<div className="flex flex-grow justify-end items-center">
							<Command className="h-4 w-4 stroke-muted-foreground" />
							<p className="ml-1 text-sm">G</p>
						</div>
					</div>
					<div className="flex gap-2 items-center text-secondary">
						<LibraryIcon /> <p>Library</p>{" "}
						<div className="flex flex-grow justify-end items-center">
							<Command className="h-4 w-4 stroke-muted-foreground" />
							<p className="ml-1 text-sm">L</p>
						</div>
					</div>
					<div className="flex gap-2 items-center text-secondary">
						<ChallengesIcon /> <p>Challenges</p>{" "}
						<div className="flex flex-grow justify-end items-center">
							<Command className="h-4 w-4 stroke-muted-foreground" />
							<p className="ml-1 text-sm">C</p>
						</div>
					</div>
					<div className="flex gap-2 items-center text-secondary">
						<ExploreIcon /> <p>Free Credits</p>{" "}
						<div className="flex flex-grow justify-end items-center">
							<Command className="h-4 w-4 stroke-muted-foreground" />
							<p className="ml-1 text-sm">F</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
