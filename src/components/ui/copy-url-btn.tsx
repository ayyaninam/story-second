import toast from "react-hot-toast";
import { useState, HTMLAttributes } from "react";
import Copy from "@/components/icons/copy";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	TooltipProvider,
} from "@/components/ui/tooltip";

interface CopyUrlBtnProps extends HTMLAttributes<HTMLButtonElement> {
	url: string;
	size: number;
}

const CopyUrlBtn = ({ url, size, ...props }: CopyUrlBtnProps) => {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = async () => {
		if (copied || !url) return;

		await navigator.clipboard.writeText(url);

		toast.success("Url Copied!");

		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	return (
		<TooltipProvider>
			<Tooltip delayDuration={0}>
				<TooltipTrigger asChild>
					<button {...props} onClick={copyToClipboard}>
						<Copy size={size} />
					</button>
				</TooltipTrigger>
				<div className={copied ? "" : ""}>
					{/* todo: is buggy */}
					<TooltipContent side="top">Url Copied!</TooltipContent>
				</div>
			</Tooltip>
		</TooltipProvider>
	);
};

export default CopyUrlBtn;
