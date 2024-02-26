import { ReactNode } from "react";
import SideNav, { menuItems } from "./SideNav";

const getBackgroundGradient = (page?: string) => {
	switch (page) {
		case "explore":
			return "linear-gradient(270deg, #3A54CB 69.69%, #020817 99.69%)";
		case "generate":
			return "linear-gradient(270deg, #BB55F7 69.69%, #020817 99.69%)";
		case "library":
			return "linear-gradient(270deg, #157A6E 69.69%, #020817 99.69%)";
		default:
			return "linear-gradient(270deg, #A734EA 69.69%, #020817 99.69%)";
	}
};

const ScenesLayout = ({
	children,
	pageIndex = 0,
}: {
	children: ReactNode;
	pageIndex?: number;
}) => {
	return (
		<div
			className="flex w-screen h-screen bg-primary py-2 overflow-hidden"
			style={{
				background: getBackgroundGradient(
					menuItems[pageIndex]?.text?.toLowerCase()
				),
			}}
		>
			<SideNav pageIndex={pageIndex} />
			{children}
		</div>
	);
};

export default ScenesLayout;
