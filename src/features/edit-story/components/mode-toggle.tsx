import * as React from "react";
import { useTheme } from "next-themes";
import { Contrast, Moon } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

export function ModeToggle() {
	const { setTheme, theme } = useTheme();

	const isSystemThemeDark = useMediaQuery("(prefers-color-scheme: dark)");

	if (theme && (theme === "light" || theme === "system"))
		return (
			<Contrast
				className="rotate-45 h-[18.286px] w-[18.286px] flex-shrink-0 stroke-slate-400 [&>path]:fill-slate-400 hover:cursor-pointer"
				onClick={() => {
					if (isSystemThemeDark && theme === "system") {
						setTheme("light");
						return;
					}
					setTheme("dark");
				}}
			/>
		);
	return (
		<Contrast
			className="-rotate-45 h-[18.286px] w-[18.286px] flex-shrink-0 stroke-slate-400 [&>path]:fill-slate-400 hover:cursor-pointer"
			onClick={() => setTheme("light")}
		/>
	);
}
