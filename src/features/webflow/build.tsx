import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const App = () => {
	const [prompt, setPrompt] = useState("");

	const handleClick = (e: React.MouseEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(prompt);
	};
	return (
		<form
			id="email-form"
			name="email-form"
			data-name="Email Form"
			onSubmit={handleClick}
			className="ai-form-content"
			data-wf-page-id="65b99dee9363b664a107e75c"
			data-wf-element-id="cba1a4b4-f959-4bbe-275a-4824f1bba85a"
		>
			<input
				className="build-form-input w-input"
				name="Prompt"
				data-name="Prompt"
				onChange={(e) => setPrompt(e.target.value)}
				placeholder="What is your story about?"
				type="text"
				id="Prompt"
				required
			/>
			<input
				type="submit"
				data-wait="Please wait..."
				className="button hero-submit-button w-button"
				value="Produce It"
			/>
		</form>
	);
};

const root = document.getElementById("prompt-form");

if (!root) throw new Error("Root element not found");
createRoot(root).render(<App />);
