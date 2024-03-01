import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import CopyUrlBtn from "@/components/ui/copy-url-btn";
import Facebook from "@/components/icons/facebook";
import Twitter from "@/components/icons/twitter";
import { WebStory } from "@/components/ui/story-book/constants";

export const TheEndLeftView = () => (
	<div className="flex justify-center items-center font-bold text-6xl text-black">
		The End.
	</div>
);

interface TheEndViewProps {
	story: WebStory;
}

export const TheEndRightView = ({ story }: TheEndViewProps) => {
	const router = useRouter();
	const [shareUrl, setShareUrl] = useState("");

	useEffect(() => {
		const url = window.location.href;
		setShareUrl(url);
	}, [router.asPath]);

	return (
		<div className="flex flex-col justify-center items-center flex-1 w-full px-8 py-4 gap-5 text-black">
			<p className="font-semibold text-2xl md:text-4xl">
				Did you like this story?
			</p>

			<p className="text-lg">
				Share it with your friends
				<br />
				and family on social media!
			</p>

			<div className="flex gap-2 lg:gap-4 flex-col">
				<FacebookShareButton url={shareUrl} className="flex items-center gap-4">
					<Facebook size={24} />
					<span>Share it on Facebook</span>
				</FacebookShareButton>

				<TwitterShareButton
					title={`${story.storyTitle}\n\n`}
					url={shareUrl}
					className="flex items-center gap-4"
				>
					<Twitter size={24} />
					<span>Share it on Twitter</span>
				</TwitterShareButton>
			</div>

			<div className="flex w-full max-w-xs h-10 border-2 bg-white border-accent-500">
				<div className="relative flex-1 flex items-center">
					<div className="absolute left-2 right-2 line-clamp-1">{shareUrl}</div>
				</div>

				<div className="bg-accent-500">
					<CopyUrlBtn
						size={20}
						url={shareUrl}
						className="btn-primary p-0 h-full w-10 rounded-none flex justify-center items-center"
					/>
				</div>
			</div>
		</div>
	);
};
