import video from "@/api/routes/video";
import TailwindSpinner from "@/components/file-upload/tw-spinner";
import { useMutation } from "@tanstack/react-query";
import React from "react";

export default function Index({
	setVideoFileId,
	videoFileId,
}: {
	setVideoFileId: (file: string | null) => void;
	videoFileId: string | null;
}) {
	const UploadFile = useMutation({ mutationFn: video.getUploadUrl });
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
					headers: {
						"Content-Type": file.type,
					},
				});
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
					strokeWidth="1"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="lucide lucide-file-check iconButton"
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
					strokeWidth="1"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="lucide lucide-file-video-2 iconButton"
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
			className="flex w-full justify-center items-center rounded-md border border-gray-300 bg-gray-100 cursor-pointer"
			style={{
				backgroundColor: "#F1F5F9",
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
					padding: "2px 8px",
					borderRadius: "4px",
					margin: "auto",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Icon />
				<p style={{ fontSize: 14 }}>
					{isVideoUploading
						? "Loading"
						: UploadFile.data?.data
							? "Uploaded"
							: "Upload a tiktok"}
				</p>
			</label>
		</div>
	);
}
