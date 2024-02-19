import { Button } from "@/components/ui/button";
import React, { CSSProperties } from "react";

const heroSectionContainer: CSSProperties = {
	borderRadius: "var(--radius-3xl, 24px)",
	border: "1px solid var(--border-base-alpha, rgba(10, 15, 41, 0.08))",
	background: "var(--background-surface-default, #FFF)",
	boxShadow: "0px 1px 2px 0px rgba(20, 21, 26, 0.05)",
};

function LibraryHeroSection() {
	return (
		<div className="w-full flex items-center gap-2 pb-6">
			<div
				className="flex items-start w-full max-w-[1440px] justify-center items-center overflow-hidden"
				style={heroSectionContainer}
			>
				<div className="pt-8 pb-16 flex pr-6 pl-10 gap-8 flex-col items-start w-2/5">
					<span className="flex py-1 px-2 bg-teal-50 rounded-[350px] text-teal-600 font-normal tracking-tighter text-sm">
						Hi There
					</span>
					<div className="flex flex-col gap-4 items-start">
						<h1 className="text-[#14151A] text-5xl font-normal tracking-[-1.44px]">
							This is Where Your Videos Live
						</h1>
						<p className="text-base font-normal text-teal-700">
							Within your personal Authorly library, you’ll find every one of
							your videos, both finished and draft.{" "}
							<span className="text-[#0F132499]">
								We can’t wait to see what awesome videos you add next.
							</span>
						</p>
					</div>
					<div className="flex gap-4">
						<Button variant="secondary" size="sm">
							Create New Video
						</Button>
						<Button className="background" size="sm">
							Import Video
						</Button>
					</div>
				</div>
				<div className="w-3/5 min-h-full bg-teal-700 self-stretch"></div>
			</div>
		</div>
	);
}

export default LibraryHeroSection;
