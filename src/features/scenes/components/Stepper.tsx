import { Badge } from "@/components/ui/badge";
import useWebstoryContext from "@/features/edit-story/providers/WebstoryContext";
import Routes from "@/routes";
import { StepperStep } from "@/utils/enums";
import clsx from "clsx";
import {
	ChevronRight,
	ScrollText,
	LayoutList,
	Film,
	ScanEye,
} from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

const activeStyles =
	"border border-purple-500 bg-purple-100 text-purple-900 stepper-box-shadow";
const baseStyles = `bg-primary-foreground font-normal text-sm cursor-pointer transition-all ease-in-out duration-300`;

export default function Stepper({ step }: { step: StepperStep }) {
	const router = useRouter();
	const [WebstoryData] = useWebstoryContext();
	const [currentHover, setCurrentHover] = useState<StepperStep>(step);
	return (
		<div className="w-full bg-background border-border border-[1px] py-2 min-h-8 flex items-center justify-center">
			<Badge
				onMouseEnter={() => {
					setCurrentHover(StepperStep.Script);
				}}
				onMouseLeave={() => {
					setCurrentHover(step);
				}}
				onClick={() =>
					router.push(
						Routes.EditScript(
							WebstoryData.storyType,
							WebstoryData.topLevelCategory!,
							WebstoryData.slug!
						)
					)
				}
				variant="outline"
				className={clsx(baseStyles, {
					[activeStyles]:
						step === StepperStep.Script || currentHover === StepperStep.Script,
				})}
			>
				<ScrollText className="stroke-purple-600 mr-1 h-4 w-4" />
				Script
			</Badge>
			<ChevronRight className="w-4 h-4 opacity-50" />
			<Badge
				onMouseEnter={() => {
					setCurrentHover(StepperStep.Storyboard);
				}}
				onMouseLeave={() => {
					setCurrentHover(step);
				}}
				onClick={() =>
					router.push(
						Routes.EditStoryboard(
							WebstoryData.storyType,
							WebstoryData.topLevelCategory!,
							WebstoryData.slug!
						)
					)
				}
				variant="outline"
				className={clsx(baseStyles, {
					[activeStyles]:
						step === StepperStep.Storyboard ||
						currentHover === StepperStep.Storyboard,
				})}
			>
				<LayoutList className="stroke-purple-600 mr-1 h-4 w-4" />
				Storyboard
			</Badge>
			<ChevronRight className="w-4 h-4 opacity-50" />
			<Badge
				variant="outline"
				onMouseEnter={() => {
					setCurrentHover(StepperStep.Scenes);
				}}
				onMouseLeave={() => {
					setCurrentHover(step);
				}}
				onClick={() =>
					router.push(
						Routes.EditScenes(
							WebstoryData.storyType,
							WebstoryData.topLevelCategory!,
							WebstoryData.slug!
						)
					)
				}
				className={clsx(baseStyles, {
					[activeStyles]:
						step === StepperStep.Scenes || currentHover === StepperStep.Scenes,
				})}
			>
				<Film className="stroke-purple-600 mr-1 h-4 w-4" />
				Scenes
			</Badge>
			<ChevronRight className="w-4 h-4 opacity-50" />
			<Badge
				variant="outline"
				onMouseEnter={() => {
					setCurrentHover(StepperStep.Preview);
				}}
				onMouseLeave={() => {
					setCurrentHover(step);
				}}
				onClick={() =>
					router.push(
						Routes.EditStory(
							WebstoryData.storyType,
							WebstoryData.topLevelCategory!,
							WebstoryData.slug!
						)
					)
				}
				className={clsx(baseStyles, {
					[activeStyles]:
						step === StepperStep.Preview ||
						currentHover === StepperStep.Preview,
				})}
			>
				<ScanEye className="stroke-purple-600 mr-1 h-4 w-4" />
				Preview
			</Badge>
		</div>
	);
}
