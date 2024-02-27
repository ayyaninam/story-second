"use client";
import React from "react";
import styles from "./pricing.module.css";
import cn from "@/utils/cn";
import PricingCards from "@/features/pricing/pricing-cards";
import { ModeToggle } from "@/features/edit-story/components/mode-toggle";

export default function PricingPage() {
	const bannerText = "hello world 😄";

	return (
		<div
			className={cn("flex flex-col w-full items-center", styles.fancyOverlay)}
		>
			<div className="w-full flex flex-col items-center">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center">
					<div className="w-full lg:w-auto mx-auto max-w-4xl lg:text-center">
						<h1 className="text-black dark:text-white text-4xl font-semibold max-w-xs sm:max-w-none md:text-6xl !leading-tight">
							Pricing
						</h1>
						<p className="text-black dark:text-white mt-6 md:text-xl lg:text-center max-w-prose">
							Authorly
						</p>
					</div>

					{bannerText ? (
						<div className="w-full lg:w-auto flex justify-center my-4">
							<p className="w-full px-4 py-3 text-xs bg-purple-100 text-black dark:bg-purple-300/30 dark:text-white/80 rounded-xl">
								{bannerText}
							</p>
						</div>
					) : null}

					<div>
						<PricingCards />
					</div>

					<ModeToggle />
				</div>
			</div>
		</div>
	);
}
