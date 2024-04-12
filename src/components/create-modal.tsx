import React, { useEffect, useState } from "react";
import clsx from "clsx";
import toast from "react-hot-toast";
import { HTTPError } from "ky";
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
	languages,
	tabs,
	TabType,
	videoRatios,
} from "@/features/generate/constants";
import FileUpload from "@/components/file-upload";
import { CreateInitialStoryQueryParams } from "@/types";
import { ImageRatios } from "@/utils/image-ratio";
import {
	AllowanceType,
	DisplayAspectRatios,
	StoryInputTypes,
	StoryLanguages,
	StoryLengths,
	StoryOutputTypes,
} from "@/utils/enums";
import {
	LanguageSelect,
	VideoRatioSelect,
} from "@/features/generate/components/selection-constants";
import useUpdateUser from "@/hooks/useUpdateUser";
import { publicProxyApiFetcher } from "@/lib/fetcher";
import { useUserCanUseCredits } from "@/utils/payment";
import CheckoutDialog from "@/features/pricing/checkout-dialog";
import useEventLogger from "@/utils/analytics";
import UpgradeSubscriptionDialog from "@/features/pricing/upgrade-subscription-dialog";
import StoryLogo from "../../public/auth-prompt/story-logo";
import { useUser } from "@auth0/nextjs-auth0/client";

/**
 * Story generation form.
 * @todo Migrate to individual states React Hook Form to take advantage of validation and form states.
 */
const GenerateModalContent: React.FC<{
	className?: string;
	/**
	 * if true, escape iframe
	 */
	fromLanding?: boolean;
	tiktok?: boolean;
}> = ({ className = "", fromLanding = false, tiktok = false }) => {
	const eventLogger = useEventLogger();

	const [value, setValue] = useState<TabType>(
		tiktok ? TabType.Trends : TabType.Video
	);
	const [input, setInput] = useState("");
	const tabIndex = tabs.findIndex((tab) => tab.text.toLowerCase() === value);
	const [openCreditsDialog, setOpenCreditsDialog] = useState(false);
	const [openStoryBooksDialog, setOpenStoryBooksDialog] = useState(false);
	const [openSubscriptionDialog, setOpenSubscriptionDialog] = useState(false);

	const [selectedVideoRatio, setSelectedVideoRatio] = useState(
		videoRatios[0]?.value.toString() || ""
	);
	const [selectedVideoLength, setSelectedVideoLength] = useState(
		StoryLengths.Medium
	);
	const [selectedLanguage, setSelectedLanguage] = useState(
		languages[0]?.value || "English"
	);
	const [videoFileId, setVideoFileId] = useState<string | null>(null);

	const [isLoading, setIsLoading] = useState(false);
	const isSubmitDisabled = isLoading || (!input.trim() && !videoFileId);

	const { invalidateUser } = useUpdateUser();

	const { userCanUseCredits } = useUserCanUseCredits();

	const { user } = useUser();

	const onSubmit = async () => {
		if (!user) {
			if (window.location.pathname === "/prompt") {
				window.parent.location.href = "/auth/login?returnTo=/generate";
			} else {
				window.location.href = "/auth/login?returnTo=/generate";
			}
			return;
		}
		localStorage.setItem("prompt", input);
		const outputType = tabs.find((tab) => tab.text.toLowerCase() === value)
			?.enumValue as StoryOutputTypes;
		const isStoryBook = outputType === StoryOutputTypes.Story;

		if (isStoryBook) {
			const { error } = await userCanUseCredits({
				variant: "story book",
				storybookCredits: 1,
			});

			if (error) {
				console.log("error", error);
				if (error === "user not logged in") {
					if (window.location.pathname === "/prompt") {
						window.parent.location.href = "/auth/login?returnTo=/generate";
					} else {
						window.location.href = "/auth/login?returnTo=/generate";
					}
					return;
				}
				if (window.location.pathname === "/prompt") {
					window.parent.location.href = "/generate";
				} else if (error === "not enough credits") {
					setOpenStoryBooksDialog(true);
				} else if (
					error === "not paid subscription" ||
					error === "using custom plan"
				) {
					setOpenSubscriptionDialog(true);
				}

				setIsLoading(false);
				return;
			}
		} else {
			const { error } = await userCanUseCredits({
				variant: "video credits",
				videoCredits: 1,
			});

			if (error) {
				console.log("error", error);
				if (error === "user not logged in") {
					if (window.location.pathname === "/prompt") {
						window.parent.location.href = "/auth/login?returnTo=/generate";
					} else {
						window.location.href = "/auth/login?returnTo=/generate";
					}
					return;
				}
				if (window.location.pathname === "/prompt") {
					window.parent.location.href = "/generate";
				} else if (error === "not enough credits") {
					setOpenCreditsDialog(true);
				} else if (
					error === "not paid subscription" ||
					error === "using custom plan"
				) {
					setOpenSubscriptionDialog(true);
				}

				setIsLoading(false);
				return;
			}
		}

		eventLogger("generate_story");
		const videoRatio =
			tabIndex === 0 ? selectedVideoRatio : tabIndex === 2 ? "1:1" : "9:16";
		setIsLoading(true);

		const params: CreateInitialStoryQueryParams = {
			input_type: StoryInputTypes.Text,
			output_type: outputType,
			prompt: input,

			length: selectedVideoLength,
			language: StoryLanguages[selectedLanguage as keyof typeof StoryLanguages],
			image_resolution:
				ImageRatios[videoRatio.replace(":", "x") as keyof typeof ImageRatios]
					.enumValue,
			video_key: "",
			display_resolution:
				videoRatios.find((ratio) => ratio.value === videoRatio)?.enumValue ||
				DisplayAspectRatios["1024x576"],
		};

		if (videoFileId) {
			params["input_type"] = StoryInputTypes.Video;
			params["output_type"] = StoryOutputTypes.SplitScreen;
			params["video_key"] = videoFileId;
			params["image_resolution"] = ImageRatios["9x8"].enumValue;
		}

		await submitToBackend(params, invalidateUser, fromLanding, setIsLoading);
	};

	useEffect(() => {
		const prompt = localStorage.getItem("prompt") || "";
		if (prompt) {
			setInput(prompt);
		}
	}, []);

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

export default GenerateModalContent;

/**
 * Submit form data to the backend
 * @param params form data
 * @param invalidateUser
 * @param fromLanding true if the user is coming from the landing page
 * @param setIsLoading form submitting state
 */
export const submitToBackend = async (
	params: CreateInitialStoryQueryParams,
	invalidateUser: () => Promise<void>,
	fromLanding: boolean,
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
	const data = JSON.stringify(params);
	console.log(data);
	try {
		localStorage.setItem("prompt", params.prompt || "");
		const json: { storyPath: string } = await publicProxyApiFetcher
			.post("api/story/create", { body: data })
			.json();
		console.log(json);
		invalidateUser();

		if (json.storyPath == null) {
			toast.error("An unexpected error has occurred. Please try again.");
		} else {
			// Ok! Send the user to the story page
			localStorage.removeItem("prompt");
			redirect(json.storyPath, fromLanding);
		}
	} catch (error) {
		if (error instanceof HTTPError) {
			switch (error.response.status) {
				case 401: {
					redirect("/auth/login?returnTo=/generate", fromLanding);
					break;
				}
				case 402: {
					toast.error("Not enough balance to create story.");
					break;
				}
				default: {
					toast.error("Unable to generate your story. Please try again.");
					console.error(error.message, error.response.status);
				}
			}
		}
	} finally {
		setIsLoading(false);
	}
};

/**
 * Redirect user to `/generate` page.  Why not `useRouter.push()`?
 * This prompt component is used in both Next.js's legacy pages and the newer app dir in which
 * the router API has changed.  So we can't import both versions.
 *
 */
const redirect = (dest: string, escapeIFrame: boolean) => {
	if (escapeIFrame) {
		window.parent.location.href = dest;
	} else {
		window.location.href = dest;
	}
};
