export const keys = (Enum: any) => {
	return Object.keys(Enum).filter((key) => isNaN(Number(key)));
};
