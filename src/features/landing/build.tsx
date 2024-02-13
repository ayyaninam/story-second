import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import storyLanguages from "@/utils/storyLanguages";
import {
	AspectRatios,
	StoryImageStyles,
	StoryInputTypes,
	StoryLanguages,
	StoryLengths,
	StoryOutputTypes,
} from "@/utils/enums";
import Routes from "@/routes";
import FileUpload from "./components/file-upload";
import { CreateInitialStoryQueryParams } from "@/types";
import { ImageRatios } from "@/utils/image-ratio";

const queryClient = new QueryClient();

const keys = (Enum: any) => {
	return Object.keys(Enum).filter((key) => isNaN(Number(key)));
};

const App = () => {
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const [isPromptClicked, setIsPromptClicked] = useState(false);
	const [videoFileId, setVideoFileId] = useState<string | null>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [prompt, setPrompt] = useState("");
	const [options, setOptions] = useState({
		language: StoryLanguages.English,
		length: StoryLengths.Short,
		style: StoryImageStyles.Realistic,
	});

	const [outputType, setOutputType] = useState<
		StoryOutputTypes.Story | StoryOutputTypes.Video
	>(StoryOutputTypes.Video);

	const expandTextBox = !!isPromptClicked;
	const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setPrompt(e.target.value);
		// @ts-expect-error - TS doesn't know about the scrollHeight property
		inputRef.current.style.height = "auto";
		// @ts-expect-error - TS doesn't know about the scrollHeight property
		inputRef.current.style.height = `${inputRef.current?.scrollHeight}px`;
	};
	// Hooks
	// Handlers
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setIsLoading(true);
		e.preventDefault();
		const params: CreateInitialStoryQueryParams = {
			image_style:
				options.style as CreateInitialStoryQueryParams["image_style"],
			language: options.language,
			length: options.length,
			prompt: prompt,
			image_resolution: ImageRatios["9x16"].enumValue,
			input_type: StoryInputTypes.Text,
			output_type: outputType,
			video_key: "",
		};

		if (videoFileId) {
			params["input_type"] = StoryInputTypes.Video;
			params["output_type"] = StoryOutputTypes.SplitScreen;
			params["video_key"] = videoFileId;
			params["image_resolution"] = ImageRatios["9x8"].enumValue;
		}
		console.log(Routes.CreateStoryFromRoute(params));
		window.location.href = Routes.CreateStoryFromRoute(params);
	};

	const isButtonDisabled = !prompt && !videoFileId;
	return (
		<form style={{ margin: 0 }} onSubmit={onSubmit}>
			<div className="first-form">
				<div style={{ width: "100%", display: "flex" }}>
					<textarea
						className="prompt-input"
						ref={inputRef}
						onClick={() => setIsPromptClicked(true)}
						// className="build-form-input w-input"
						// className={`${isPromptClicked ? "input-expanded" : "input-normal"}`}
						name="Prompt"
						data-name="Prompt"
						onChange={handlePromptChange}
						placeholder="What is your story about?"
						id="Prompt"
						required={!videoFileId}
						onInput={(e) => {
							if (inputRef.current) {
								if (!!isPromptClicked) {
									inputRef.current.classList.remove("input-normal");
									inputRef.current.classList.add("input-expanded");
								} else {
									inputRef.current.classList.remove("input-expanded");
									inputRef.current.classList.add("input-normal");
								}
							}
						}}
					/>
				</div>
				{!expandTextBox && (
					<div>
						<button
							type="submit"
							// className={`${prompt.length ? "button hero-submit-button w-button" : ""} `}
							disabled={isButtonDisabled}
						>
							<svg
								width="17"
								height="16"
								viewBox="0 0 17 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M0.5 8.30348C0.602416 12.4923 3.97192 15.8618 8.16074 15.9744C8.1505 11.7549 4.71955 8.32397 0.5 8.30348Z"
									fill={"#FFF"}
								/>
								<path
									d="M16.4693 7.67606C16.3669 3.48724 12.9974 0.117736 8.80859 0.0153198C8.81884 4.23487 12.2498 7.66582 16.4693 7.67606Z"
									fill={"#FFF"}
								/>
								<path
									d="M8.17051 0.00508118C3.98169 0.107497 0.612182 3.477 0.509766 7.66583C4.72931 7.65558 8.16027 4.22463 8.17051 0.00508118Z"
									fill={"#FFF"}
								/>
								<path
									d="M8.80836 15.9949H8.61377H16.4998V8.30348C12.2598 8.30348 8.80836 11.7549 8.80836 15.9949Z"
									fill={"#FFF"}
								/>
							</svg>

							<span>Produce It</span>
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g opacity="0.5">
									<path
										d="M3.3335 8H12.6668"
										stroke={isButtonDisabled ? "#94ABB8" : "#F8FAFC"}
										stroke-width="0.866667"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M8 3.33333L12.6667 8L8 12.6667"
										stroke={isButtonDisabled ? "#94ABB8" : "#F8FAFC"}
										stroke-width="0.866667"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</g>
							</svg>
						</button>
					</div>
				)}
			</div>
			{expandTextBox && (
				<div className="prompt-actions-container">
					<div className="prompt-actions">
						<div
							style={{
								display: "flex",
								backgroundColor: "#F1F5F9",
								borderRadius: "8px",
								padding: "2px",
							}}
						>
							<input
								type="radio"
								name="Video"
								id="video"
								style={{ appearance: "none" }}
							/>
							<label
								htmlFor="video"
								style={{
									cursor: "pointer",
									backgroundColor:
										outputType === StoryOutputTypes.Video ? "white" : "#F1F5F9",
									padding: "4px 8px",
									borderRadius: "4px",
									margin: "auto",
								}}
								onClick={() => setOutputType(StoryOutputTypes.Video)}
							>
								<svg
									className="iconButton"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke={
										outputType === StoryOutputTypes.Video
											? "#020617"
											: "#64748B"
									}
									strokeWidth="1"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="m22 8-6 4 6 4V8Z" />
									<rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
								</svg>
							</label>
							<input
								type="radio"
								name="Book"
								id="book"
								style={{ appearance: "none" }}
								onClick={() => setOutputType(StoryOutputTypes.Story)}
							/>
							<label
								htmlFor="book"
								style={{
									cursor: "pointer",
									backgroundColor:
										outputType === StoryOutputTypes.Story ? "white" : "#F1F5F9",
									padding: "4px 8px",
									borderRadius: "4px",
									margin: "auto",
								}}
							>
								<svg
									className="iconButton"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke={
										outputType === StoryOutputTypes.Story
											? "#020617"
											: "#64748B"
									}
									strokeWidth="1"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
									<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
								</svg>
							</label>
						</div>
						<FileUpload
							setVideoFileId={setVideoFileId}
							videoFileId={videoFileId}
						/>

						<select
							onChange={(e) => {
								setOptions((prev) => ({
									...prev,
									language:
										StoryLanguages[
											e.target.value as keyof typeof StoryLanguages
										],
								}));
							}}
						>
							{keys(StoryLanguages).map((label, index) => (
								<option key={index}>{label}</option>
							))}
						</select>

						<select
							onChange={(e) =>
								setOptions((prev) => ({
									...prev,
									length:
										StoryLengths[e.target.value as keyof typeof StoryLengths],
								}))
							}
						>
							{keys(StoryLengths).map((label, index) => (
								<option key={index}>{label}</option>
							))}
						</select>
						<select
							onChange={(e) =>
								setOptions((prev) => ({
									...prev,
									style:
										StoryImageStyles[
											e.target.value as keyof typeof StoryImageStyles
										],
								}))
							}
						>
							{keys(StoryImageStyles).map((label, index) => (
								<option key={index}>{label}</option>
							))}
						</select>
					</div>
					<button type="submit" disabled={isButtonDisabled}>
						<svg
							width="17"
							height="16"
							viewBox="0 0 17 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M0.5 8.30348C0.602416 12.4923 3.97192 15.8618 8.16074 15.9744C8.1505 11.7549 4.71955 8.32397 0.5 8.30348Z"
								fill={isButtonDisabled ? "#1F323D" : "#FFF"}
							/>
							<path
								d="M16.4693 7.67606C16.3669 3.48724 12.9974 0.117736 8.80859 0.0153198C8.81884 4.23487 12.2498 7.66582 16.4693 7.67606Z"
								fill={isButtonDisabled ? "#1F323D" : "#FFF"}
							/>
							<path
								d="M8.17051 0.00508118C3.98169 0.107497 0.612182 3.477 0.509766 7.66583C4.72931 7.65558 8.16027 4.22463 8.17051 0.00508118Z"
								fill={isButtonDisabled ? "#1F323D" : "#FFF"}
							/>
							<path
								d="M8.80836 15.9949H8.61377H16.4998V8.30348C12.2598 8.30348 8.80836 11.7549 8.80836 15.9949Z"
								fill={isButtonDisabled ? "#1F323D" : "#FFF"}
							/>
						</svg>

						<span>{isLoading ? "Loading" : "Produce It"}</span>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g opacity="0.5">
								<path
									d="M3.3335 8H12.6668"
									stroke={isButtonDisabled ? "#94ABB8" : "#F8FAFC"}
									stroke-width="0.866667"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M8 3.33333L12.6667 8L8 12.6667"
									stroke={isButtonDisabled ? "#94ABB8" : "#F8FAFC"}
									stroke-width="0.866667"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</g>
						</svg>
					</button>
				</div>
			)}
		</form>
	);
};

const root = document.getElementById("prompt-form");
if (!root) throw new Error("Root element not found");

// console.log(root?.innerHTML);
root.innerHTML = "";

const CustomInput = () => (
	<QueryClientProvider client={queryClient}>
		<App />
	</QueryClientProvider>
);

const bottomInput = document.getElementById("prompt-form-2");
if (!bottomInput) {
	throw new Error("Bottom-input not found!");
}

createRoot(root).render(<CustomInput />);
createRoot(bottomInput).render(<CustomInput />);
