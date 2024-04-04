export const createCategoryString = (category: object): string => {
	let currentCategory = category;
	let categoryString = "";

	while (
		typeof currentCategory === "object" &&
		Object.keys(currentCategory).length > 0
	) {
		const key = Object.keys(currentCategory)[0];
		categoryString =
			(categoryString ? `${categoryString} > ${key}` : key) || "";
		currentCategory = Object.values(currentCategory)[0];
	}

	return categoryString;
};
