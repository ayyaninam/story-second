import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

// To be used inside a TooltipProvider
export default function TooltipComponent({
	label,
	align,
	children,
}: {
	children: React.ReactNode;
	align?: "center" | "end" | "start" | undefined;
	label: string;
}) {
	return (
		<Tooltip delayDuration={100}>
			<TooltipTrigger>{children}</TooltipTrigger>
			<TooltipContent align="start" className="">
				<p>{label}</p>
			</TooltipContent>
		</Tooltip>
	);
}
