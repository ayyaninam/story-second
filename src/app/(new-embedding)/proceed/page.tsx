'use client'
import { useState, useEffect } from "react";
import { NextSeo } from "next-seo";
import ProceedIndex from "@/components/proceed";
import ProceedMobile from "@/components/proceed/mobile";
import { useAuth } from "@/features/auth-prompt/providers/AuthContext";

import { HTTPError } from "ky";


import {
	AllowanceType,
	DisplayAspectRatios,
	StoryInputTypes,
	StoryLanguages,
	StoryLengths,
	StoryOutputTypes,
} from "@/utils/enums";

import { ImageRatios } from "@/utils/image-ratio";
import useEventLogger from "@/utils/analytics";
import { CreateInitialStoryQueryParams } from "@/types";
import { useUserCanUseCredits } from "@/utils/payment";
// backend 

import { publicProxyApiFetcher } from "@/lib/fetcher";
import toast from "react-hot-toast";
// import { HTTPError } from "ky";
import useUpdateUser from "@/hooks/useUpdateUser";
import { usePrompt } from "@/features/PromptContext/PromptState";
import { TabType, tabs, videoRatios } from "@/features/generate/constants";

// end 

import { useRouter } from "next/navigation";

const ProceedPage: React.FC = () => {

	const router = useRouter()
	const [finished, setFinished] = useState(false)
	const { user, refetchUserData, data, isUserLoading } = useAuth();
	const { userCanUseCredits } = useUserCanUseCredits();
	const { invalidateUser } = useUpdateUser();
	const eventLogger = useEventLogger();

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
		setIsLoading,
		setSelectedVideoRatio,
		setSelectedVideoLength,
		setSelectedLanguage,
		setVideoFileId,
		setValue,
		setOpenVerificationDialog,
	} = usePrompt()

	const tabIndex = tabs.findIndex((tab) => tab.text.toLowerCase() === value);

	const startGenerating = async () => {

		if (!user) {
			// if (window.location.pathname === "/nprompt") {
			// 	// window.parent.location.href = "/auth/login?returnTo=/generate";
			// 	router.push("/auth/login?returnTo=/generate")

			// } else {
			// 	router.push("/auth/login?returnTo=/generate")
			// }
			router.push("/auth/login?returnTo=/generate")
			return;
		}

		// await refetchUserData();

		const outputType = tabs.find((tab) => tab.text.toLowerCase() === value)
			?.enumValue as StoryOutputTypes;
		const isStoryBook = outputType === StoryOutputTypes.Story;

		if (isStoryBook) {
			const { error } = await userCanUseCredits({
				variant: "story book",
				storybookCredits: 1,
			});

			if (error) {
				if (error === "user not logged in") {
					// if (window.location.pathname === "/prompt") {
					// 	window.parent.location.href = "/auth/login?returnTo=/generate";
					// } else {
					// 	window.location.href = "/auth/login?returnTo=/generate";
					// }
					router.push("/auth/login?returnTo=/generate")
					return;
				}
				if (window.location.pathname === "/prompt") {
					// window.parent.location.href = "/generate";
					router.push("/generate")
				} else if (error === "not enough credits") {
					setOpenStoryBooksDialog(true);
					setFinished(true)
				} else if (
					error === "not paid subscription" ||
					error === "using custom plan"
				) {
					setOpenSubscriptionDialog(true);
					setFinished(true)
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
				if (error === "user not logged in") {
					// if (window.location.pathname === "/prompt") {
					// 	window.parent.location.href = "/auth/login?returnTo=/generate";
					// } else {
					// 	window.location.href = "/auth/login?returnTo=/generate";
					// }
					router.push("/auth/login?returnTo=/generate")
					return;
				}
				if (window.location.pathname === "/prompt") {
					// window.parent.location.href = "/generate";
					router.push("/generate")
				} else if (error === "not enough credits") {
					setOpenCreditsDialog(true);
					setFinished(true)
				} else if (
					error === "not paid subscription" ||
					error === "using custom plan"
				) {
					setOpenSubscriptionDialog(true);
					setFinished(true)
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

		await submitToBackend(params, invalidateUser, true, setIsLoading);
	};

	useEffect(() => {
		const prompt = localStorage.getItem("prompt") || "";

		const gettedselectedVideoRatio = localStorage.getItem("selectedVideoRatio") || "";
		const gettedselectedVideoLength = localStorage.getItem("selectedVideoLength") || "";
		const gettedselectedLanguage = localStorage.getItem("selectedLanguage") || "";
		const gettedvalue = localStorage.getItem("value") || "";
		const gettedvideoFileId = localStorage.getItem("videoFileId") || "";

		if (prompt) {
			setInput(prompt);
		}
		
		if (gettedselectedVideoRatio) {setSelectedVideoRatio(gettedselectedVideoRatio)}

		if (gettedselectedLanguage) {setSelectedLanguage(gettedselectedLanguage)}
		if (gettedvalue) {setValue(gettedvalue)}
		if (gettedvideoFileId) {setVideoFileId(gettedvideoFileId)}

		if (gettedselectedVideoLength) {
			const parsedVal = parseInt(gettedselectedVideoLength)
			if (parsedVal === (1||2||3||undefined)){
				setSelectedVideoLength(parsedVal)

			}else{
				setSelectedVideoLength(undefined)
			}
		}

	}, []);


	useEffect(() => {
		const updateUser = async () => { await refetchUserData()}

		if (!isUserLoading){
			startGenerating()
		}else{
			updateUser();
		}
	}, [isUserLoading])


	return (
		<>
			<NextSeo
				title="Get Started"
				description="Login to your account"
				openGraph={{
					title: "Get Started",
					description: "Login to your account",
				}}
				noindex
			/>
			<style jsx global>
				{`
					:root {
						.intercom-launcher {
							display: none;
						}
					}
				`}
			</style>
			<div className="hidden lg:block ">
				<ProceedIndex loadingText={isUserLoading ? "Checking User, Please wait...": "Generating..."} finished={finished}/>
			</div>
			<div className="block lg:hidden">
				<ProceedMobile loadingText={isUserLoading ? "Checking User, Please wait...": "Generating..."} finished={finished}/>
			</div>


		</>
	);
}


export default ProceedPage;



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
	try {
		localStorage.setItem("prompt", params.prompt || "");
		const json: { storyPath: string } = await publicProxyApiFetcher
			.post("api/story/create", { body: data })
			.json();
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
					error.response
						.json()
						.then((data) => {
							const backendErrorMessage =
								data.error || "Unknown error occurred";
							toast.error(
								`Unable to generate your story: ${backendErrorMessage}`
							);
						})
						.catch((e) => {
							toast.error(
								"An unexpected error occurred while processing your request."
							);
						});
					break;
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
