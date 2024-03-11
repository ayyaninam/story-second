export const validateRequiredFormData = (formData: FormData): boolean => {
	const language = formData.get("language");
	const length = formData.get("length");
	const prompt = formData.get("prompt");
	const videoKey = formData.get("video_key");
	const outputType = formData.get("output_type");
	const inputType = formData.get("input_type");
	const imageResolution = formData.get("image_resolution");

	return (
		language != null &&
		length != null &&
		(prompt != null || videoKey != null) &&
		outputType != null &&
		inputType != null &&
		imageResolution != null
	);
};
