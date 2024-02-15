import { mainSchema } from "@/api/schema";
import React, { createContext, useContext, useState } from "react";

// Create the context
const WebstoryContext = createContext<
	[
		mainSchema["ReturnVideoStoryDTO"],
		React.Dispatch<React.SetStateAction<mainSchema["ReturnVideoStoryDTO"]>>,
	]
	// @ts-expect-error Not typing correctly
>([null, null]);

// Custom hook to access the context value
const useWebstoryContext = () => {
	const context = useContext(WebstoryContext);
	if (!context) {
		throw new Error(
			"useWebstoryContext must be used within a WebStoryProvider"
		);
	}
	return context;
};

interface WebstoryProviderProps {
	children: React.ReactNode;
	initialValue: mainSchema["ReturnVideoStoryDTO"];
}

export const WebStoryProvider: React.FC<WebstoryProviderProps> = ({
	children,
	initialValue,
}) => {
	const [data, setData] =
		useState<mainSchema["ReturnVideoStoryDTO"]>(initialValue);

	return (
		<WebstoryContext.Provider value={[data, setData]}>
			{children}
		</WebstoryContext.Provider>
	);
};

export default useWebstoryContext;
