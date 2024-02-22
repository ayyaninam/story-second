import { ReactNode } from "react";
import SideNav from "./SideNav";

const getBackgroundGradient = (page: "scene") => {
	switch (page) {
		case "scene":
		default:
			return "linear-gradient(270deg, #A734EA 69.69%, #020817 99.69%)";
	}
};

const ScenesLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div
			className="flex w-screen h-screen bg-primary py-2 overflow-hidden"
			style={{ background: getBackgroundGradient("scene") }}
		>
			<SideNav />
			{children}
		</div>
	);
};

export default ScenesLayout;
