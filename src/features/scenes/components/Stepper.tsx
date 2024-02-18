import { Badge } from "@/components/ui/badge";
import { StepperStep } from "@/utils/enums";
import {
	ChevronRight,
	ScrollText,
	LayoutList,
	Film,
	Upload,
} from "lucide-react";

export default function Stepper({ step }: { step: StepperStep }) {
	return (
		<div className="w-full bg-background border-border border-[1px] py-2 min-h-8 flex items-center justify-center">
			<Badge
				variant="outline"
				className={`bg-primary-foreground font-normal text-sm ${step === StepperStep.Script ? "border border-purple-500 bg-purple-100 text-purple-900" : ""}`}
				style={
					step === StepperStep.Script
						? { boxShadow: "0px 4px 4px 0px rgba(206, 122, 255, 0.40)" }
						: undefined
				}
			>
				<ScrollText className="stroke-purple-600 mr-1 h-4 w-4" />
				Script
			</Badge>
			<ChevronRight className="w-4 h-4 opacity-50" />
			<Badge
				variant="outline"
				className={`bg-primary-foreground font-normal text-sm ${step === StepperStep.Storyboard ? "border border-purple-500 bg-purple-100 text-purple-900" : ""}`}
				style={
					step === StepperStep.Storyboard
						? { boxShadow: "0px 4px 4px 0px rgba(206, 122, 255, 0.40)" }
						: undefined
				}
			>
				<LayoutList className="stroke-purple-600 mr-1 h-4 w-4" />
				Storyboard
			</Badge>
			<ChevronRight className="w-4 h-4 opacity-50" />
			<Badge
				variant="outline"
				className={`bg-primary-foreground font-normal text-sm ${step === StepperStep.Scenes ? "border border-purple-500 bg-purple-100 text-purple-900" : ""}`}
				style={
					step === StepperStep.Scenes
						? { boxShadow: "0px 4px 4px 0px rgba(206, 122, 255, 0.40)" }
						: undefined
				}
			>
				<Film className="stroke-purple-600 mr-1 h-4 w-4" />
				Scenes
			</Badge>
			<ChevronRight className="w-4 h-4 opacity-50" />
			<Badge
				variant="outline"
				className={`bg-primary-foreground font-normal text-sm ${step === StepperStep.Share ? "border border-purple-500 bg-purple-100 text-purple-900" : ""}`}
				style={
					step === StepperStep.Share
						? { boxShadow: "0px 4px 4px 0px rgba(206, 122, 255, 0.40)" }
						: undefined
				}
			>
				<Upload className="stroke-purple-600 mr-1 h-4 w-4" />
				Share
			</Badge>
		</div>
	);
}
