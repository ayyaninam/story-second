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
			<TooltipTrigger tabIndex={-1}>{children}</TooltipTrigger>
			<TooltipContent align={align ?? "start"} className="">
				<p>{label}</p>
			</TooltipContent>
		</Tooltip>
	);
}
