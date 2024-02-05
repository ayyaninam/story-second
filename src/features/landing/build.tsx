import api from "@/api";
import storyLanguages from "@/utils/storyLanguages";
import {
	QueryClient,
	QueryClientProvider,
	useMutation,
} from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { useStoryForm } from "./hooks/useStoryForm";
import { StoryImageStyles, StoryLanguages, StoryLengths } from "@/utils/enums";
import { env } from "@/env.mjs";

const queryClient = new QueryClient();

const App = () => {
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const [isPromptClicked, setIsPromptClicked] = useState(false);

	const [prompt, setPrompt] = useState("");
	const [options, setOptions] = useState({
		language: StoryLanguages.English,
		length: StoryLengths.Short,
		style: StoryImageStyles.Realistic,
	});

	const [outputMode, setOutputMode] = useState<"video" | "book">("video");

	const expandTextBox = !!isPromptClicked;
	const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setPrompt(e.target.value);
		// @ts-expect-error - TS doesn't know about the scrollHeight property
		inputRef.current.style.height = "auto";
		// @ts-expect-error - TS doesn't know about the scrollHeight property
		inputRef.current.style.height = `${inputRef.current?.scrollHeight}px`;
	};

	const CreateWebstory = useMutation({
		mutationFn: api.webstory.createUnauthorized,
	});
	// Hooks
	// Handlers
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const WebStory = await CreateWebstory.mutateAsync({
			image_style: options.style,
			language: options.language,
			length: options.length,
			prompt: prompt,
		});
		window.location.href = `/library/${WebStory.url}`;
	};

	return (
		<form style={{ margin: 0 }} onSubmit={onSubmit}>
			<div className="first-form">
				<div style={{ width: "100%", display: "flex" }}>
					<textarea
						style={{
							resize: "none",
							border: "none",
							minWidth: "100%",
							textAlign: "left",
							paddingTop: "16px",
							fontSize: "20px",
							fontWeight: "400",
							transition: "height 0.6s",
						}}
						ref={inputRef}
						onClick={() => setIsPromptClicked(true)}
						// className="build-form-input w-input"
						// className={`${isPromptClicked ? "input-expanded" : "input-normal"}`}
						name="Prompt"
						data-name="Prompt"
						onChange={handlePromptChange}
						placeholder="What is your story about?"
						id="Prompt"
						required
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
							disabled={!prompt}
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
									fill={!prompt ? "#1F323D" : "#FFF"}
								/>
								<path
									d="M16.4693 7.67606C16.3669 3.48724 12.9974 0.117736 8.80859 0.0153198C8.81884 4.23487 12.2498 7.66582 16.4693 7.67606Z"
									fill={!prompt ? "#1F323D" : "#FFF"}
								/>
								<path
									d="M8.17051 0.00508118C3.98169 0.107497 0.612182 3.477 0.509766 7.66583C4.72931 7.65558 8.16027 4.22463 8.17051 0.00508118Z"
									fill={!prompt ? "#1F323D" : "#FFF"}
								/>
								<path
									d="M8.80836 15.9949H8.61377H16.4998V8.30348C12.2598 8.30348 8.80836 11.7549 8.80836 15.9949Z"
									fill={!prompt ? "#1F323D" : "#FFF"}
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
										stroke={!prompt ? "#94ABB8" : "#F8FAFC"}
										stroke-width="0.866667"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M8 3.33333L12.6667 8L8 12.6667"
										stroke={!prompt ? "#94ABB8" : "#F8FAFC"}
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
				<div
					style={{
						display: "flex",
						margin: "8px 0px 8px 0px",
						justifyContent: "space-between",
					}}
				>
					<div
						style={{
							display: "flex",
							gap: "8px",
							height: "100$",
						}}
					>
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
								className="appearance-none"
								style={{
									cursor: "pointer",
									backgroundColor: outputMode === "video" ? "white" : "#F1F5F9",
									padding: "4px 8px",
									borderRadius: "4px",
									margin: "auto",
								}}
								onClick={() => setOutputMode("video")}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke={outputMode === "video" ? "#020617" : "#64748B"}
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
								onClick={() => setOutputMode("book")}
							/>
							<label
								htmlFor="book"
								style={{
									cursor: "pointer",
									backgroundColor: outputMode === "book" ? "white" : "#F1F5F9",
									padding: "4px 8px",
									borderRadius: "4px",
									margin: "auto",
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke={outputMode === "book" ? "#020617" : "#64748B"}
									strokeWidth="1"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
									<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
								</svg>
							</label>
						</div>
						<select
							onChange={(e) =>
								// @ts-expect-error - TS doesn't know about the value property
								setOptions((prev) => ({ ...prev, language: e.target.value }))
							}
						>
							{Object.entries(StoryLanguages).map(([key, label], index) => (
								<option key={key}>{label}</option>
							))}
						</select>
						<select
							onChange={(e) =>
								// @ts-expect-error - TS doesn't know about the value property
								setOptions((prev) => ({ ...prev, length: e.target.value }))
							}
						>
							{Object.entries(StoryLengths).map(([key, label], index) => (
								<option key={key}>{label}</option>
							))}
						</select>
						<select
							onChange={(e) =>
								// @ts-expect-error - TS doesn't know about the value property
								setOptions((prev) => ({ ...prev, style: e.target.value }))
							}
						>
							{Object.entries(StoryImageStyles).map(([key, label], index) => (
								<option key={key}>{label}</option>
							))}
						</select>
					</div>
					<button
						type="submit"
						disabled={!prompt}
						className="button hero-submit-button w-button"
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
								fill={!prompt ? "#1F323D" : "#FFF"}
							/>
							<path
								d="M16.4693 7.67606C16.3669 3.48724 12.9974 0.117736 8.80859 0.0153198C8.81884 4.23487 12.2498 7.66582 16.4693 7.67606Z"
								fill={!prompt ? "#1F323D" : "#FFF"}
							/>
							<path
								d="M8.17051 0.00508118C3.98169 0.107497 0.612182 3.477 0.509766 7.66583C4.72931 7.65558 8.16027 4.22463 8.17051 0.00508118Z"
								fill={!prompt ? "#1F323D" : "#FFF"}
							/>
							<path
								d="M8.80836 15.9949H8.61377H16.4998V8.30348C12.2598 8.30348 8.80836 11.7549 8.80836 15.9949Z"
								fill={!prompt ? "#1F323D" : "#FFF"}
							/>
						</svg>

						<span>{CreateWebstory.isPending ? "Loading" : "Produce It"}</span>
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
									stroke={!prompt ? "#94ABB8" : "#F8FAFC"}
									stroke-width="0.866667"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M8 3.33333L12.6667 8L8 12.6667"
									stroke={!prompt ? "#94ABB8" : "#F8FAFC"}
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

const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get("k") ?? window.localStorage.getItem("k");
window.localStorage.setItem("k", accessToken ?? "");
if (accessToken !== env.NEXT_PUBLIC_TEMP_ACCESS_KEY)
	window.location.href = "/404";

const root = document.getElementById("prompt-form");
if (!root) throw new Error("Root element not found");

// console.log(root?.innerHTML);
root.innerHTML = "";

createRoot(root).render(
	<QueryClientProvider client={queryClient}>
		<App />
	</QueryClientProvider>
);
