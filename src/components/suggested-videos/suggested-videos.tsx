import { cn } from "@/utils";
import React from "react";
import { Img, staticFile } from "remotion";

export default function SuggestedVideos({ id }: { id: string }) {
	return (
		<div
			className={
				"max-w-[306px] bg-slate-200 right-2 top-2  p-4 pt-6 overflow-auto h-full w-full"
			}
		>
			<div className="flex gap-2 items-center">
				<div className="h-10 w-10 rounded-md shadow bg-white" />
				<div>
					<h1 className="font-bold text-base text-slate-950">More Videos</h1>
					<p className="text-sm text-muted-foreground">Made with Story.com</p>
				</div>
			</div>
			<div className="mt-2 flex flex-col gap-2">
				{[...Array(5)].map((_, index) => (
					<div
						key={index}
						className={cn(
							"rounded-lg overflow-hidden",
                            // active
							index === 0 && "outline-accent-600 border border-white outline outline-1", 
						)}
					>
						<Img
							src={staticFile("images/video-preview.png")}
							alt="video"
							className=""
						/>
					</div>
				))}
			</div>
		</div>
	);
}
