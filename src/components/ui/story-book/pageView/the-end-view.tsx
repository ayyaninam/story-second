import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export const TheEndLeftView = () => (
	<div className="flex justify-center items-center font-bold text-6xl text-black">
		The End.
	</div>
);

interface TheEndViewProps {
	storyTitle?: string;
}

export const TheEndRightView = ({ storyTitle }: TheEndViewProps) => {
	const router = useRouter();
	const [shareUrl, setShareUrl] = useState("");

	useEffect(() => {
		const url = window.location.href;
		setShareUrl(url);
	}, [router.asPath]);

	return (
		<div className="flex flex-col justify-center items-center flex-1 w-full px-8 py-4 gap-5 text-black">
			<p className="font-aleo font-semibold text-3xl md:text-4xl">
				Did you like this story?
			</p>

			<p className="text-lg">
				Share it with your friends
				<br />
				and family on social media!
			</p>

			{/*todo: implement this, is from the storybird fe */}
			{/*<div className="flex gap-2 lg:gap-4 flex-col">*/}
			{/*	<FacebookShareButton url={shareUrl} className="flex items-center gap-4">*/}
			{/*		<div className="svg-btn">*/}
			{/*			<Image*/}
			{/*				src="/assets/icons/facebook.svg"*/}
			{/*				alt=""*/}
			{/*				height={20}*/}
			{/*				width={20}*/}
			{/*			/>*/}
			{/*		</div>*/}
			{/*		<span>Share it on Facebook</span>*/}
			{/*	</FacebookShareButton>*/}

			{/*	<TwitterShareButton*/}
			{/*		title={`${storyTitle}\n\n`}*/}
			{/*		url={shareUrl}*/}
			{/*		className="flex items-center gap-4"*/}
			{/*	>*/}
			{/*		<div className="svg-btn">*/}
			{/*			<Image*/}
			{/*				src="/assets/icons/twitter.svg"*/}
			{/*				alt=""*/}
			{/*				width={24}*/}
			{/*				height={24}*/}
			{/*			/>*/}
			{/*		</div>*/}
			{/*		<span>Share it on Twitter</span>*/}
			{/*	</TwitterShareButton>*/}
			{/*</div>*/}

			{/*<div className="flex w-full max-w-xs h-10 border-2 bg-white border-brand-fill">*/}
			{/*	<div className="relative flex-1 flex items-center">*/}
			{/*		<div className="absolute left-2 right-2 line-clamp-1">{shareUrl}</div>*/}
			{/*	</div>*/}

			{/*	<CopyUrlBtn*/}
			{/*		url={shareUrl}*/}
			{/*		className="btn-primary p-0 h-full w-10 rounded-none"*/}
			{/*	/>*/}
			{/*</div>*/}
		</div>
	);
};
