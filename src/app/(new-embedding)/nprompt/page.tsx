'use client'
import GenerateModalContentNew from '@/components/create-model-new';
import { usePrompt } from '@/features/PromptContext/PromptState';
import { TabType, tabs } from '@/features/generate/constants';

import { ArrowRight } from 'lucide-react';
import React, { useState } from 'react'
import StoryLogo from '../../../../public/auth-prompt/story-logo';
import { useSearchParams } from 'next/navigation';
import { useMediaQuery } from 'usehooks-ts';

const NPromptPage: React.FC = () => {

	const searchParams = useSearchParams();
	const isMobile = useMediaQuery("(max-width: 768px)");

	const [activated, setActivated] = useState(false)

	return activated ? (

		<GenerateModalContentNew
			className="relative h-full"
			fromLanding
			tiktok={searchParams?.get("tiktok") === "true"}
		/>

	) : (
		<div className="px-4 lg:px-0">
			<form
				className="bg-white p-0 md:p-4 rounded-2xl md:rounded-md w-full flex items-center cursor-pointer pointer-events-auto"
				onClick={(e) => {
					e.preventDefault();
					if (!isMobile) {
						setActivated(true);
					}
				}}
			>
				<input
					className="hidden md:block cursor-pointer w-full outline-none ring-0 border-none"
					placeholder="Tell your story..."
				/>

				<div className="hidden md:block">
					<button
						type="submit"
						className="flex flex-nowrap prompt-default-button w-max bg-slate-800 flex-row justify-center h-12"
					>
						<StoryLogo />
						<span>Generate</span>
						<ArrowRight
							strokeWidth={1}
							size={18}
							className="text-neutral-400"
						/>
					</button>
				</div>

				<div className="block md:hidden w-full">
					<button
						type="submit"
						className="flex flex-nowrap prompt-default-button w-full bg-purple-600 flex-row justify-center h-12"
						onClick={() => (window.parent.location.href = "/generate")}
					>
						<StoryLogo />
						<span className="text-base">Tell your story</span>
						<ArrowRight strokeWidth={1} size={24} className="text-white" />
					</button>
				</div>
			</form>
		</div>
	);
}

export default NPromptPage