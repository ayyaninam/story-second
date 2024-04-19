const toFormData = (values: Record<string, any>) => {
	const formData = new FormData();
	Object.entries(values).forEach(([key, value]) => {
		formData.append(key, value);
	});

	return formData;
};

export { toFormData };
