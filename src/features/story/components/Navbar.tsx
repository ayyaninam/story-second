import React, { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import Format from "@/utils/format";
import { mainSchema } from "@/api/schema";
import { ChevronsLeft, Menu, Plus } from "lucide-react";

import GenerateIcon from "@/components/icons/dashboard/generate-icon";
import Router, { useRouter } from "next/router";
import Routes from "@/routes";
import useEventLogger from "@/utils/analytics";

export default function Navbar({
	WebstoryData,
	suggestedOpen,
	setSuggestedOpen,
	toggleHovering,
	suggestedMenuButton,
}: {
	WebstoryData?: mainSchema["ReturnWebStoryDTO"] | null;
	suggestedOpen?: boolean;
	setSuggestedOpen?: (value: boolean) => void;
	toggleHovering?: (value: boolean) => void;
	suggestedMenuButton?: boolean;
}) {
	const router = useRouter();
	const eventLogger = useEventLogger();
	const createNewButton: CSSProperties = {
		background:
			"linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.00) 100%), var(--Colors-accent-700, #157A6E)",
		boxShadow:
			" 0px -1px 12px 0px rgba(255, 255, 255, 0.12) inset, 0px 0px 0px 1px #157A6E",
		borderRadius: "6px",
	};
	return (
		<div className="flex flex-row justify-between items-center bg-background rounded-tl-lg rounded-tr-lg border-b-[0.5px] border-border p-4">
			<div className="flex gap-x-2.5 items-center">
				<GenerateIcon />
				<div className="items-center">
					<div className="flex items-center gap-x-2">
						<p className="text-sm rounded-sm font-bold text-muted-foreground">
							{Format.Title(WebstoryData?.storyTitle)}
						</p>
					</div>
					<div className="flex items-center gap-x-2 text-slate-500">
						<span className="flex gap-x-1.5 rounded-sm bg-muted p-1 items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="19"
								height="12"
								viewBox="0 0 19 12"
								fill="none"
							>
								<path
									d="M0.5 11.0625V0.9375H18.5V11.0625H0.5Z"
									stroke="#94ABB8"
								/>
							</svg>
						</span>
						<p className="text-xs text-muted-foreground rounded-sm bg-muted p-1">
							{Format.Title(WebstoryData?.topLevelCategory)}
						</p>
					</div>
				</div>
			</div>
			<div className="text-muted-foreground space-x-2 flex flex-row">
				<Button
					className={`px-4 py-1.5 bg-accent-600 hover:bg-accent-700 border border-accent-700 text-background text-white text-sm font-medium flex gap-2 items-center h-fit`}
					variant="default"
					style={createNewButton}
					onClick={() => {
						eventLogger("create_new_clicked", {
							sourceUrl: router.asPath,
						});
						Router.push(Routes.Generate()).then();
					}}
				>
					<Plus className="mr-2 h-4 w-4" /> Create New
				</Button>
				{!suggestedOpen && suggestedMenuButton && (
					<Button
						className={`hidden xl:flex h-9 w-10 p-0 rounded-md shadow bg-white hover:shadow-lg fade-in-5 group `}
						variant="outline"
						onClick={() => setSuggestedOpen?.(!suggestedOpen)}
						onMouseEnter={() => toggleHovering?.(true)}
						onMouseLeave={() => toggleHovering?.(false)}
					>
						<ChevronsLeft size={20} className="hidden group-hover:block" />
						<Menu size={20} className="block group-hover:hidden" />
					</Button>
				)}
			</div>
		</div>
	);
}
