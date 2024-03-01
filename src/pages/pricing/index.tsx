"use client";
import api from "@/api";
import React, { useState, useEffect } from "react";
import { ModeToggle } from "@/features/edit-story/components/mode-toggle";
import DesktopBook from "@/components/ui/story-book/desktop/desktop-book";
import { mainSchema } from "@/api/schema";

type WebStory = mainSchema["ReturnWebStoryDTO"];

export default function PricingPage() {
	return (
		<div className="flex flex-col w-full items-center">
			<div className="w-full flex flex-col items-center">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center">
					<div className="w-full lg:w-auto mx-auto max-w-4xl lg:text-center">
						<h1 className="text-black dark:text-white text-4xl font-semibold max-w-xs sm:max-w-none md:text-6xl !leading-tight">
							Pricing Page
						</h1>
					</div>
				</div>
			</div>
		</div>
	);
}
