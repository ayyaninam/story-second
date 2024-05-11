import { mainSchema } from "@/api/schema";
import { Badge } from "@/components/ui/badge";
import Routes from "@/routes";
import { StepperStep, StoryOutputTypes } from "@/utils/enums";
import clsx from "clsx";
import {
	ChevronRight,
	ScrollText,
	LayoutList,
	Film,
	ScanEye,
} from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useSubmitEditScenesAndSegments } from "@/features/scenes/mutations/SaveScenesAndSegments";
import {
	EditStoryAction,
	EditStoryDraft,
} from "@/features/scenes/reducers/edit-reducer";
import toast from "react-hot-toast";

const activeStyles =
	"border border-accent-500 bg-accent-100 text-accent-900 stepper-box-shadow";
const baseStyles = `bg-primary-foreground font-normal text-sm cursor-pointer transition-all ease-in-out duration-300`;

export default function Stepper({
	step,
	WebstoryData,
	story,
	dispatch,
}: {
	step: StepperStep;
	WebstoryData: mainSchema["ReturnVideoStoryDTO"];
	story: EditStoryDraft;
	dispatch: React.Dispatch<EditStoryAction>;
}) {
	const router = useRouter();
	const isMobile = useMediaQuery("(max-width: 640px)");
	const [currentHover, setCurrentHover] = useState<StepperStep>(step);
	const [disableNavToScenes, setDisableNavToScenes] = useState(true);
	const [disableNavToPreview, setDisableNavToPreview] = useState(true);
	const SaveEdits = useSubmitEditScenesAndSegments(dispatch);

	useEffect(() => {
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

		setDisableNavToPreview(
			WebstoryData.storyType !== StoryOutputTypes.Story && !!allNull
		);
		setDisableNavToScenes(!!allNull);
	}, [WebstoryData.scenes]);

	const saveEdits = async () => {
		await SaveEdits.mutateAsync({
			updatedStory: story,
			prevStory: WebstoryData,
		});
	};

	return (
		<div className="w-full bg-background border-border border-[1px] py-2 min-h-8 flex items-center justify-center">
			<Badge
				onMouseEnter={() => {
					setCurrentHover(StepperStep.Script);
				}}
				onMouseLeave={() => {
					setCurrentHover(step);
				}}
				onClick={() => {
					saveEdits();
					router.push(
						Routes.EditScript(
							WebstoryData.storyType,
							WebstoryData.topLevelCategory!,
							WebstoryData.slug!
						)
					);
				}}
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
				onClick={() => {
					saveEdits();
					router.push(
						Routes.EditStoryboard(
							WebstoryData.storyType,
							WebstoryData.topLevelCategory!,
							WebstoryData.slug!
						)
					);
				}}
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
			{!isMobile && WebstoryData.storyType !== StoryOutputTypes.Story && (
				<>
					<Badge
						variant="outline"
						onMouseEnter={() => {
							if (!disableNavToScenes) setCurrentHover(StepperStep.Scenes);
						}}
						onMouseLeave={() => {
							if (!disableNavToScenes) setCurrentHover(step);
						}}
						onClick={() => {
							saveEdits();
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
								step === StepperStep.Scenes ||
								currentHover === StepperStep.Scenes,
							"opacity-60": disableNavToScenes,
						})}
					>
						<Film className="stroke-accent-600 mr-1 h-4 w-4" />
						Scenes
					</Badge>
					<ChevronRight className="w-4 h-4 opacity-50" />
				</>
			)}
			<Badge
				variant="outline"
				onMouseEnter={() => {
					if (!disableNavToPreview) setCurrentHover(StepperStep.Preview);
				}}
				onMouseLeave={() => {
					if (!disableNavToPreview) setCurrentHover(step);
				}}
				onClick={() => {
					saveEdits();
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
