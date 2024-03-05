import clsx from "clsx";
import "@/styles/globals.css";
import localFont from "next/font/local";

/**
 * Layout for the Embedding group of pages.
 * @param param0
 * @returns
 */
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={clsx(randFont.className, "prompt-embedded-page")}>
				{children}
			</body>
		</html>
	);
}

const randFont = localFont({
	variable: "--font-rand",
	src: [
		{
			path: "../../pages/fonts/rand/Rand-Black-Italic.woff2",
			weight: "900",
			style: "italic",
		},
		{
			path: "../../pages/fonts/rand/Rand-Black.woff2",
			weight: "900",
			style: "normal",
		},
		{
			path: "../../pages/fonts/rand/Rand-Bold-Italic.woff2",
			weight: "700",
			style: "italic",
		},
		{
			path: "../../pages/fonts/rand/Rand-Bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "../../pages/fonts/rand/Rand-Heavy-Italic.woff2",
			weight: "800",
			style: "italic",
		},
		{
			path: "../../pages/fonts/rand/Rand-Heavy.woff2",
			weight: "800",
			style: "normal",
		},
		{
			path: "../../pages/fonts/rand/Rand-Italic.woff2",
			weight: "400",
			style: "italic",
		},
		{
			path: "../../pages/fonts/rand/Rand-Light-Italic.woff2",
			weight: "300",
			style: "italic",
		},
		{
			path: "../../pages/fonts/rand/Rand-Light.woff2",
			weight: "300",
			style: "normal",
		},
		{
			path: "../../pages/fonts/rand/Rand-Medium-Italic.woff2",
			weight: "500",
			style: "italic",
		},
		{
			path: "../../pages/fonts/rand/Rand-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../pages/fonts/rand/Rand-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../pages/fonts/rand/Rand-Thin-Italic.woff2",
			weight: "100",
			style: "italic",
		},
		{
			path: "../../pages/fonts/rand/Rand-Thin.woff2",
			weight: "100",
			style: "normal",
		},
	],
});
