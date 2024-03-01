import { mainSchema } from "@/api/schema";
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
import { useEffect, useState } from "react";

const activeStyles =
	"border border-accent-500 bg-accent-100 text-accent-900 stepper-box-shadow";
const baseStyles = `bg-primary-foreground font-normal text-sm cursor-pointer transition-all ease-in-out duration-300`;

export default function Stepper({
	step,
	WebstoryData,
}: {
	step: StepperStep;
	WebstoryData: mainSchema["ReturnVideoStoryDTO"];
}) {
	const router = useRouter();
	const [currentHover, setCurrentHover] = useState<StepperStep>(step);
	const [disableNavToScenes, setDisableNavToScenes] = useState(true);
	const [disableNavToPreview, setDisableNavToPreview] = useState(true);

	useEffect(() => {
		// let allNull = true;

		// WebstoryData.scenes?.forEach((scene) => {
		// 	scene.storySegments?.forEach((segment) => {
		// 		if (segment.imageKey || segment.videoKey) {
		// 			allNull = false;
		// 			return;
		// 		}
		// 	});
		// });

		const allNull = WebstoryData.scenes
			?.flatMap((scene) =>
				scene.videoSegments?.map((segment) => ({
					videoKey: segment.videoKey,
					videoRegenerating: segment.videoRegenerating,
					imageKey: segment.imageKey,
					imageRegenerating: segment.videoRegenerating,
				}))
			)
			.every(
				(segment) => segment?.videoKey === null || segment?.imageKey === null
			);

		setDisableNavToPreview(!!allNull);
		setDisableNavToScenes(!!allNull);
	}, [WebstoryData.scenes]);

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
				<ScrollText className="stroke-accent-600 mr-1 h-4 w-4" />
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
				<LayoutList className="stroke-accent-600 mr-1 h-4 w-4" />
				Storyboard
			</Badge>
			<ChevronRight className="w-4 h-4 opacity-50" />
			<Badge
				variant="outline"
				onMouseEnter={() => {
					if (!disableNavToScenes) setCurrentHover(StepperStep.Scenes);
				}}
				onMouseLeave={() => {
					if (!disableNavToScenes) setCurrentHover(step);
				}}
				onClick={() => {
					if (!disableNavToScenes)
						router.push(
							Routes.EditScenes(
								WebstoryData.storyType,
								WebstoryData.topLevelCategory!,
								WebstoryData.slug!
							)
						);
				}}
				className={clsx(baseStyles, {
					[activeStyles]:
						step === StepperStep.Scenes || currentHover === StepperStep.Scenes,
					"opacity-60": disableNavToScenes,
				})}
			>
				<Film className="stroke-accent-600 mr-1 h-4 w-4" />
				Scenes
			</Badge>
			<ChevronRight className="w-4 h-4 opacity-50" />
			<Badge
				variant="outline"
				onMouseEnter={() => {
					if (!disableNavToPreview) setCurrentHover(StepperStep.Preview);
				}}
				onMouseLeave={() => {
					if (!disableNavToPreview) setCurrentHover(step);
				}}
				onClick={() => {
					if (!disableNavToPreview)
						router.push(
							Routes.EditStory(
								WebstoryData.storyType,
								WebstoryData.topLevelCategory!,
								WebstoryData.slug!
							)
						);
				}}
				className={clsx(baseStyles, {
					[activeStyles]:
						step === StepperStep.Preview ||
						currentHover === StepperStep.Preview,
					"opacity-60": disableNavToPreview,
				})}
			>
				<ScanEye className="stroke-accent-600 mr-1 h-4 w-4" />
				Preview
			</Badge>
		</div>
	);
}
