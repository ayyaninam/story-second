import {
	TwitterShareButton,
	WhatsappShareButton,
	FacebookShareButton,
} from "react-share";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Facebook from "@/components/icons/facebook";
import X from "@/components/icons/x";
import Whatsapp from "@/components/icons/whatsapp";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

interface ShareStoryDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	storyTitle: string;
	summary: string;
	storyTypeString: string;
}

const ShareStoryDialog = ({
	open,
	setOpen,
	storyTitle,
	summary,
	storyTypeString,
}: ShareStoryDialogProps) => {
	const router = useRouter();

	const [storyUrl, setStoryUrl] = useState("");

	useEffect(() => {
		const url = window.location.href;
		setStoryUrl(url);
	}, [router.asPath]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-md">
						Share this {storyTypeString}
					</DialogTitle>
					<DialogDescription>
						Anyone with the link can view this document.
					</DialogDescription>
				</DialogHeader>
				<Label>Share Link</Label>
				<div className="flex gap-2">
					<Input
						className="w-full truncate border-accent-600 pointer-events-none focus-visible:ring-0"
						value={storyUrl}
						readOnly
					/>
					<Button
						className="text-white bg-accent-600 hover:bg-accent-700"
						onClick={() => {
							navigator.clipboard.writeText(window.location.href);
							toast.success("Link copied to clipboard");
						}}
					>
						Copy Link
					</Button>
				</div>
				<Label>Share On Social</Label>
				<div className="flex gap-2">
					<FacebookShareButton
						title={`${storyTitle}\n\n`}
						url={storyUrl}
						className="w-full"
					>
						<Button className="text-white bg-accent-600 hover:bg-accent-700 w-full flex gap-2">
							<Facebook size={20} />
							Facebook
						</Button>
					</FacebookShareButton>

					<TwitterShareButton
						title={`${storyTitle}\n\n`}
						url={storyUrl}
						className="w-full"
					>
						<Button className="text-white bg-accent-600 hover:bg-accent-700 w-full  flex gap-2">
							<X size={20} />
							X.com
						</Button>
					</TwitterShareButton>
					<WhatsappShareButton
						aria-label="Share on Whatsapp"
						className="w-full"
						url={storyUrl}
						title={`Just stumbled upon "${storyTitle}" on Story.com and couldn't resist sharing! 🌟 \n\n${summary}\n\n`}
					>
						<Button className="text-white bg-accent-600 hover:bg-accent-700 w-full flex gap-2">
							<Whatsapp size={20} fill="#fff" />
							Whatsapp
						</Button>
					</WhatsappShareButton>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ShareStoryDialog;
