import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TextPage } from "../../constants";

interface TextViewProps {
	page: TextPage;
}

const TextView = ({ page }: TextViewProps) => {
	const isLoading = !page.textContent;

	if (isLoading) {
		return (
			<div className="flex flex-col gap-2 justify-center items-center">
				<Skeleton className="h-4 w-[400px]" />
				<Skeleton className="h-4 w-[400px]" />
				<Skeleton className="h-4 w-[400px]" />
				<Skeleton className="h-4 w-[400px]" />
				Loading text...
			</div>
		);
	}

	return (
		<div className="flex flex-col justify-center flex-1 w-full gap-2 min-w-[250px] max-w-[512px]">
			<div className="flex items-center justify-center w-full">
				<div className="flex flex-wrap items-end">
					<span className="text-center text-black">{page.textContent} </span>
				</div>
			</div>
		</div>
	);
};

export default TextView;
