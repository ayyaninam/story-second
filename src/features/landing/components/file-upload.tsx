import api from "@/api";
import React from "react";

export default function FileUpload({
	videoFile,
	setVideoFile,
}: {
	videoFile: File | null;
	setVideoFile: (file: File | null) => void;
}) {
	// Handle file change
	const handleFileChange = async (e) => {
		// Check if files are selected and if the first file is a video
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			if (file.type.startsWith("video/")) {
				setVideoFile(file);
				const UploadUrl = await api.video.getUploadUrl({
					fileName: file.name,
					conteentType: file.type,
				});
				if (UploadUrl.data)
					await fetch(UploadUrl.data, { method: "PUT", body: file });
			} else {
				alert("Please select a video file.");
				setVideoFile(null); // Reset or handle as necessary
			}
		}
	};

	return (
		<div
			style={{
				display: "flex",
				backgroundColor: "#F1F5F9",
				borderRadius: "8px",
				padding: "2px",
			}}
		>
			<input
				type="file"
				accept="video/*"
				id="upload-video"
				style={{ appearance: "none" }}
				onChange={handleFileChange}
				hidden
			/>
			<label
				htmlFor="upload-video"
				style={{
					cursor: "pointer",
					backgroundColor: "#F1F5F9",
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
					stroke={"#64748B"}
					stroke-width="1"
					stroke-linecap="round"
					stroke-linejoin="round"
					className="lucide lucide-file-video-2"
				>
					<path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
					<path d="M14 2v4a2 2 0 0 0 2 2h4" />
					<rect width="8" height="6" x="2" y="12" rx="1" />
					<path d="m10 15.5 4 2.5v-6l-4 2.5" />
				</svg>
			</label>
		</div>
	);
}
