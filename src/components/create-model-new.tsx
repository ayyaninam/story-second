import React, { useEffect } from "react";
import clsx from "clsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
	tabs,
	TabType,
} from "@/features/generate/constants";
import FileUpload from "@/components/file-upload";
import {
	AllowanceType,
} from "@/utils/enums";
import {
	LanguageSelect,
	VideoRatioSelect,
} from "@/features/generate/components/selection-constants";
import CheckoutDialog from "@/features/pricing/checkout-dialog";
import UpgradeSubscriptionDialog from "@/features/pricing/upgrade-subscription-dialog";
import StoryLogo from "../../public/auth-prompt/story-logo";
import VerifyDialog from "@/features/generate/components/VerifyDialog";
import { usePrompt } from "@/features/PromptContext/PromptState";

/**
 * Story generation form.
 * @todo Migrate to individual states React Hook Form to take advantage of validation and form states.
 */
const GenerateModalContentNew: React.FC<{
	className?: string;
	/**
	 * if true, escape iframe
	 */
	fromLanding?: boolean;
	tiktok?: boolean;
}> = ({ className = "", fromLanding = false, tiktok = false }) => {

    const {
        input,
        openStoryBooksDialog,
        openSubscriptionDialog,
        openCreditsDialog,
        isLoading,
        selectedVideoRatio,
        selectedVideoLength,
        selectedLanguage,
        videoFileId,
        value,
        openVerificationDialog,
        setInput,
        setOpenStoryBooksDialog,
        setOpenSubscriptionDialog,
        setOpenCreditsDialog,
        setSelectedVideoRatio,
        setSelectedLanguage,
        setVideoFileId,
        setValue,
        setOpenVerificationDialog,

    } = usePrompt();

	const tabIndex = tabs.findIndex((tab) => tab.text.toLowerCase() === value);

	const isSubmitDisabled = isLoading || (!input.trim() && !videoFileId);

	const onSubmit = async () => {
		localStorage.setItem("prompt", input);
		localStorage.setItem("selectedVideoRatio", selectedVideoRatio);
		localStorage.setItem("input", input);
		localStorage.setItem("selectedVideoLength", selectedVideoLength?selectedVideoLength.toString():"");
		localStorage.setItem("selectedLanguage", selectedLanguage);
		localStorage.setItem("value", value);
		localStorage.setItem("videoFileId", videoFileId?videoFileId:"");
        window.parent.location.href =  "/proceed"

	};

	useEffect(() => {
		const prompt = localStorage.getItem("prompt") || "";
		if (prompt) {
			setInput(prompt);
		}
	}, []);

    useEffect(() => {
        setValue(tiktok ? TabType.Trends : TabType.Video)
    }, [tiktok])
    

	return (
		<div className={clsx("relative flex flex-col items-center", className)}>
			<div
				className={`flex flex-col gap-4 p-1 w-full`}
				style={{
					borderRadius: "12px",
					background:
						"radial-gradient(160.1% 83.28% at 24.99% 40.87%, rgba(206, 123, 255, 0.40) 0%, rgba(102, 129, 255, 0.40) 38.5%, rgba(134, 248, 255, 0.40) 100%)",
					backdropFilter: "blur(3.7341220378875732px)",
				}}
			>
				<div className="flex flex-col bg-white items-center p-2 gap-2 rounded-lg lg:h-fit overflow-auto">
					<ToggleGroup
						type="single"
						className="grid grid-cols-3 bg-slate-100 p-0.5 rounded-md w-full lg:w-fit"
						value={value}
						onValueChange={(newValue) => {
							if (newValue) setValue(newValue as TabType);
						}}
					>
						<TooltipProvider>
							{tabs.map((tab, index) => {
								const Icon = tab.icon;
								return (
									<Tooltip key={index}>
										<TooltipTrigger asChild>
											<ToggleGroupItem
												value={tab.text.toLowerCase()}
												className={`w-full h-fit lg:h-7 py-1 px-3 flex flex-col lg:flex-row gap-4 text-slate-700 rounded-sm ${value === tab.text.toLowerCase() ? "bg-white shadow" : ""}`}
											>
												<Icon
													className={`w-4 h-4 ${value === tab.text.toLowerCase() ? "text-accent-600" : ""}`}
												/>
												{tab.text}
											</ToggleGroupItem>
										</TooltipTrigger>
										<TooltipContent className="w-80 p-4 flex items-start gap-x-4">
											<div className="w-10 h-10 p-2 rounded-full bg-slate-100">
												<Icon className="w-6 h-6 flex-shrink-0" />
											</div>
											<div className="space-y-1">
												<p className="font-bold text-popover-foreground">
													{tab.text}
												</p>
												{tab.description}
											</div>
										</TooltipContent>
									</Tooltip>
								);
							})}
						</TooltipProvider>
					</ToggleGroup>

					{value !== TabType.Trends && (
						<Textarea
							autoFocus={false}
							maxLength={3000}
							rows={4}
							className="max-h-fit border-border focus-visible:ring-[1px] text-md"
							onChange={(e) => setInput(e.target.value)}
							placeholder={`What's your story?`}
							value={input}
						/>
					)}

					<div className="flex flex-row items-start md:items-center md:px-2 gap-1 w-full">
						<div className="flex flex-grow gap-4 w-4/5">
							{/* Centered content with controlled width */}
							<div className="flex flex-col md:flex-row gap-4 w-3/5">
								{/* Always display LanguageSelect */}

								{tabIndex !== 1 && (
									<LanguageSelect
										selectedLanguage={selectedLanguage}
										setSelectedLanguage={setSelectedLanguage}
									/>
								)}

								{tabIndex === 1 && (
									<FileUpload
										setVideoFileId={setVideoFileId}
										videoFileId={videoFileId}
									/>
								)}

								{/* Conditionally display VideoLengthSelect */}
								{/*{tabIndex !== 1 && (*/}
								{/*  <VideoLengthSelect*/}
								{/*    selectedVideoLength={selectedVideoLength}*/}
								{/*    setSelectedVideoLength={setSelectedVideoLength}*/}
								{/*  />*/}
								{/*)}*/}

								{/* Conditionally display VideoRatioSelect */}
								{tabIndex === 0 && (
									<>
										<VideoRatioSelect
											selectedVideoRatio={selectedVideoRatio}
											setSelectedVideoRatio={setSelectedVideoRatio}
										/>
									</>
								)}
							</div>
						</div>

						<div className="flex flex-col md:flex-row w-2/5 md:w-1/5">
							<div className="flex justify-end w-full">
								<Button
									disabled={isSubmitDisabled}
									className="flex gap-2 items-center w-full"
									variant="default"
									onClick={onSubmit}
								>
									<StoryLogo />
									{isLoading ? "Generating" : "Generate"}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<VerifyDialog
				open={openVerificationDialog}
				setOpen={setOpenVerificationDialog}
			/>

			<CheckoutDialog
				variant="credits"
				allowanceType={AllowanceType.Videos}
				open={openCreditsDialog}
				setOpen={setOpenCreditsDialog}
			/>

			<CheckoutDialog
				variant="credits"
				allowanceType={AllowanceType.StoryBooks}
				open={openStoryBooksDialog}
				setOpen={setOpenStoryBooksDialog}
			/>

			<UpgradeSubscriptionDialog
				open={openSubscriptionDialog}
				setOpen={setOpenSubscriptionDialog}
			/>
		</div>
	);
};

export default GenerateModalContentNew;
