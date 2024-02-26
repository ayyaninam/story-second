import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

// To be used inside a TooltipProvider
export default function TooltipComponent({
	label,
	children,
}: {
	children: React.ReactNode;
	label: string;
}) {
	return (
		<Tooltip>
			<TooltipTrigger>{children}</TooltipTrigger>
			<TooltipContent
				align="start"
				{...{ "[data-state]": "instant-open" }}
				className=""
			>
				<p>{label}</p>
			</TooltipContent>
		</Tooltip>
	);
}
