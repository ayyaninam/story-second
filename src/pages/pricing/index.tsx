"use client";
import React from "react";
import styles from "./pricing.module.css";
import cn from "@/utils/cn";
import PricingCards from "@/features/pricing/pricing-cards";
import { ModeToggle } from "@/features/edit-story/components/mode-toggle";

export default function PricingPage() {
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
					</div>

					<div className="mt-40">
						<PricingCards />
					</div>

					<ModeToggle />
				</div>
			</div>
		</div>
	);
}
