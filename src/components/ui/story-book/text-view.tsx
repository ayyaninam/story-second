import React from "react";
import { TextPage } from "./constants";

interface TextViewProps {
	page: TextPage;
}

const TextView = ({ page }: TextViewProps) => (
	<div className="flex flex-col justify-center flex-1 w-full gap-2 min-w-[250px] max-w-[512px]">
		<div className="flex items-center justify-center w-full">
			<div className="flex flex-wrap items-end">
				<span className="text-center text-black">{page.textContent} </span>
			</div>
		</div>
	</div>
);

export default TextView;
