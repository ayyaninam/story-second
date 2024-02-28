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
	const [isMobile, setIsMobile] = React.useState(true);

	React.useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="flex flex-col lg:flex-row w-screen h-screen bg-primary lg:p-2 overflow-hidden"
				 style={{
					 background: (isMobile ? "linear-gradient(180deg, var(--accent-color-600) 86.59%, #021017 100%)"
						 : "linear-gradient(270deg, var(--accent-color-700) 69.69%, #020817 99.69%)"),
				 }}>
			<SideNav pageIndex={pageIndex} />
			<div className="flex-1 overflow-auto rounded">
				{children}
			</div>
			<BottomNav pageIndex={pageIndex} />
		</div>
	);
};

export default PageLayout;
