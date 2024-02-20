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
		<div className="w-full flex items-center justify-center gap-2 pb-6">
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
						<Button
							variant="secondary"
							size="sm"
							className="bg-teal-600 hover:bg-teal-700 flex gap-1.5 py-1.5 px-2.5 text-sm font-medium items-center h-fit border border-teal-700 text-background"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M3.33333 2V4.66667M12.6667 11.3333V14M2 3.33333H4.66667M11.3333 12.6667H14M8 2L6.72533 5.87533C6.6601 6.07367 6.5492 6.25392 6.40156 6.40156C6.25392 6.5492 6.07367 6.6601 5.87533 6.72533L2 8L5.87533 9.27467C6.07367 9.3399 6.25392 9.4508 6.40156 9.59844C6.5492 9.74608 6.6601 9.92633 6.72533 10.1247L8 14L9.27467 10.1247C9.3399 9.92633 9.4508 9.74608 9.59844 9.59844C9.74608 9.4508 9.92633 9.3399 10.1247 9.27467L14 8L10.1247 6.72533C9.92633 6.6601 9.74608 6.5492 9.59844 6.40156C9.4508 6.25392 9.3399 6.07367 9.27467 5.87533L8 2Z"
									stroke="#F8FAFC"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Generate a new script to edit
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M10.7817 7.33312L7.20566 3.75712L8.14833 2.81445L13.3337 7.99979L8.14833 13.1851L7.20566 12.2425L10.7817 8.66645H2.66699V7.33312H10.7817Z"
									fill="white"
								/>
							</svg>
						</Button>
						<Button
							size="sm"
							className="bg-white hover:bg-gray-100 flex gap-1.5 py-1.5 px-2.5 text-sm font-medium items-center h-fit border border-[#DEE0E3] text-primary"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M5.33301 14H13.333C13.6866 14 14.0258 13.8595 14.2758 13.6095C14.5259 13.3594 14.6663 13.0203 14.6663 12.6667V11.3333H6.66634V12.6667C6.66634 13.0203 6.52586 13.3594 6.27582 13.6095C6.02577 13.8595 5.68663 14 5.33301 14ZM5.33301 14C4.97939 14 4.64025 13.8595 4.3902 13.6095C4.14015 13.3594 3.99967 13.0203 3.99967 12.6667V3.33333C3.99967 2.97971 3.8592 2.64057 3.60915 2.39052C3.3591 2.14048 3.01996 2 2.66634 2M2.66634 2C2.31272 2 1.97358 2.14048 1.72353 2.39052C1.47348 2.64057 1.33301 2.97971 1.33301 3.33333V5.33333H3.99967M2.66634 2H11.333C11.6866 2 12.0258 2.14048 12.2758 2.39052C12.5259 2.64057 12.6663 2.97971 12.6663 3.33333V11.3333M9.99967 5.33333H6.66634M9.99967 8H6.66634"
									stroke="#020817"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							New, blank script
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M10.7817 7.33312L7.20566 3.75712L8.14833 2.81445L13.3337 7.99979L8.14833 13.1851L7.20566 12.2425L10.7817 8.66645H2.66699V7.33312H10.7817Z"
									fill="#0F1324"
									fill-opacity="0.6"
								/>
							</svg>
						</Button>
					</div>
				</div>
				<div className="w-3/5 min-h-full bg-teal-700 self-stretch"></div>
			</div>
		</div>
	);
}

export default LibraryHeroSection;
