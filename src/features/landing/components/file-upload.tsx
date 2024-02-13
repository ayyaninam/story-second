import api from "@/api";
import TailwindSpinner from "@/features/landing/components/tw-spinner";
import { cn } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import React from "react";

export default function FileUpload({
	setVideoFileId,
	videoFileId,
}: {
	setVideoFileId: (file: string | null) => void;
	videoFileId: string | null;
}) {
	const UploadFile = useMutation({ mutationFn: api.video.getUploadUrl });
	const [isVideoUploading, setIsVideoUploading] = React.useState(false);
	// Handle file change
	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setIsVideoUploading(true);
			const file = e.target.files[0];
			if (file.type.startsWith("video/")) {
				const uploadData = await UploadFile.mutateAsync({
					fileName: file.name,
					contentType: file.type,
				});

				if (!uploadData.data?.preSignedUrl) return;
				await fetch(uploadData.data.preSignedUrl, {
					method: "PUT",
					body: file,
				});
				console.log(uploadData.data.objectKey);
				setVideoFileId(uploadData.data.objectKey ?? "");
			}
		}
		setIsVideoUploading(false);
	};

	const Icon = () => {
		if (isVideoUploading) {
			return <TailwindSpinner />;
		} else if (videoFileId) {
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#64748B"
					stroke-width="1"
					stroke-linecap="round"
					stroke-linejoin="round"
					className="lucide lucide-file-check"
				>
					<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
					<path d="M14 2v4a2 2 0 0 0 2 2h4" />
					<path d="m9 15 2 2 4-4" />
				</svg>
			);
		} else {
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke={isVideoUploading ? "#7f8894" : "#64748B"}
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
			);
		}
	};

	return (
		<div
			style={{
				display: "flex",
				backgroundColor:
					videoFileId || isVideoUploading ? "#FFFFFF" : "#F1F5F9",
				// backgroundColor: "#F1F5F9",
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
				disabled={UploadFile.isPending}
				hidden
			/>
			<label
				htmlFor="upload-video"
				style={{
					cursor: "pointer",
					padding: "4px 8px",
					borderRadius: "4px",
					margin: "auto",
				}}
			>
				<Icon />
			</label>
		</div>
	);
}
