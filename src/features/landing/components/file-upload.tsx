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
		<div>
			<input type="file" accept="video/*" onChange={handleFileChange} />
			{videoFile && <p>File selected: {videoFile.name}</p>}
		</div>
	);
}
