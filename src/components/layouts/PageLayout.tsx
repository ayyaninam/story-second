import React, { ReactNode } from "react";
import SideNav from "./SideNav";
import BottomNav from "@/components/layouts/BottomNav";
import { useMediaQuery } from "usehooks-ts";

const PageLayout = ({
	children,
	pageIndex = 0,
}: {
	children: ReactNode;
	pageIndex?: number;
}) => {
	const isMobile = useMediaQuery("(max-width: 1024px)");

	return (
		<div
			className="flex flex-col lg:flex-row w-screen h-screen bg-primary lg:p-2 overflow-hidden"
			style={{
				background: isMobile
					? "linear-gradient(180deg, var(--accent-color-600) 86.59%, #021017 100%)"
					: "linear-gradient(270deg, var(--accent-color-700) 69.69%, #020817 99.69%)",
			}}
		>
			<SideNav pageIndex={pageIndex} />
			<div className="flex-1 overflow-y-scroll rounded lg:pb-0">{children}</div>
			<BottomNav pageIndex={pageIndex} />
		</div>
	);
};

export default PageLayout;
