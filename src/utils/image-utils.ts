import imageCompression from "browser-image-compression";

export const compressImage = async (
	file: File,
	maxSizeMB: number = 1,
	maxWidthOrHeight: number = 256
): Promise<File> => {
	// 100KB as default maxSize
	const options = {
		maxSizeMB: maxSizeMB, // maximum file size in MB, here it's set to 0.05MB (or 500KB)
		maxWidthOrHeight: maxWidthOrHeight, // max width or height, whichever is hit first; this will keep aspect ratio
		useWebWorker: true,
	};

	return await imageCompression(file, options);
};
