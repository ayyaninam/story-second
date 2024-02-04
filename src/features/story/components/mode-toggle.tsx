{
	/* <Contrast className="rotate-45 h-[18.286px] w-[18.286px] flex-shrink-0 stroke-slate-400 [&>path]:fill-slate-400" /> */
}
import * as React from "react";
import { useTheme } from "next-themes";
import { Contrast, Moon } from "lucide-react";

export function ModeToggle() {
	const { setTheme, theme } = useTheme();

	if (theme && (theme === "light" || theme === "system"))
		return (
			<Contrast
				className="rotate-45 h-[18.286px] w-[18.286px] flex-shrink-0 stroke-slate-400 [&>path]:fill-slate-400 hover:cursor-pointer"
				onClick={() => setTheme("dark")}
			/>
		);
	return (
		<Moon
			className="h-[18.286px] w-[18.286px] flex-shrink-0 stroke-slate-400 fill-slate-400 hover:cursor-pointer"
			onClick={() => setTheme("light")}
		/>
	);
}
