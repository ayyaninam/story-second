import React, { CSSProperties } from "react";
import FeedIcon from "@/components/icons/side-nav/FeedIcon";
import AiStar from "@/components/gallery-components/svgs/ai-star";
import LibraryIcon from "@/components/icons/side-nav/LibraryIcon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import Format from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";

// Assuming your CSS for the gradient background is correct
// React component CSS-in-JS styles
const bottomNavStyles: CSSProperties = {
	background:
		"linear-gradient(180deg, rgba(2, 16, 23, 0.00) 0%, #021017 66.5%)",
	color: "#fff",
};

const BottomNav = ({ pageIndex }: { pageIndex: number }) => {
	const { user, isLoading } = useUser();
	return (
		<div
			className="lg:hidden bottom-0 p-1 fixed w-full"
			style={bottomNavStyles}
		>
			<div className="flex items-center gap-2 p-2 justify-around">
				{/* TODO: figure out why we need menu icon?*/}
				{/*<MenuIcon color="#fff" height={34} width={34} />*/}
				<Link href="/feed/all">
					<div className="flex flex-col items-center justify-around gap-1 text-sm">
						<FeedIcon size={24} />
						Feed
					</div>
				</Link>

				<Link href={"/generate"}>
					<div className="flex flex-col items-center justify-around gap-1 text-sm">
						<AiStar size={24} /> {/* AiStar icon */}
						Generate
					</div>
				</Link>
				<Link href="/library">
					<div className="flex flex-col items-center justify-around gap-1 text-sm">
						<LibraryIcon size={24} /> {/* Library icon */}
						Library
					</div>
				</Link>
				<>
					{/*// # TODO: enable profile pages when ready*/}
					{/*// # TODO: replace with userDetails from backend*/}
					{!isLoading ? (
						<Link
							href={"/account"}
							// href={"/" + user?.nickname || ""}
						>
							<div className="flex flex-col items-center justify-around gap-1 text-sm">
								<Avatar className="h-6 w-6 border-[1px] border-gray-200 text-accent-700">
									<AvatarImage src={user?.picture || ""} />
									<AvatarFallback>
										{Format.AvatarName(
											user?.name?.split(" ")[0] || "S",
											user?.name?.split(" ")[1]
										)}
									</AvatarFallback>
								</Avatar>
								Account
							</div>
						</Link>
					) : (
						<Skeleton className="h-6 w-6 rounded-full" />
					)}
				</>
			</div>
		</div>
	);
};

export default BottomNav;
