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
		<Tooltip>
			<TooltipTrigger tabIndex={-1}>{children}</TooltipTrigger>
			<TooltipContent align={align ?? "center"} data-state="instant-open">
				<p>{label}</p>
			</TooltipContent>
		</Tooltip>
	);
}
