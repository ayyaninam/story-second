import React, { ReactNode } from 'react';
import SideNav, { menuItems } from "./SideNav";
import BottomNav from "@/components/layouts/BottomNav";

const PageLayout = ({
											children,
											pageIndex = 0,
										}: {
	children: ReactNode;
	pageIndex?: number;
}) => {
	return (
		<div className="flex flex-col lg:flex-row w-screen h-screen bg-primary lg:p-2 overflow-hidden"
				 style={{
					 background: menuItems[pageIndex]?.background || "var(--primary-background-color)",
				 }}>
			<SideNav pageIndex={pageIndex} />
			<div className="flex-1 overflow-auto">
				{children}
			</div>
			<BottomNav pageIndex={pageIndex} />
		</div>
	);
};

export default PageLayout;
