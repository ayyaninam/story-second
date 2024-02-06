import "@/styles/globals.css";
import localFont from "next/font/local";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const randFont = localFont({
	variable: "--font-rand",
	src: [
		{
			path: "./fonts/rand/Rand-Black-Italic.woff2",
			weight: "900",
			style: "italic",
		},
		{
			path: "./fonts/rand/Rand-Black.woff2",
			weight: "900",
			style: "normal",
		},
		{
			path: "./fonts/rand/Rand-Bold-Italic.woff2",
			weight: "700",
			style: "italic",
		},
		{
			path: "./fonts/rand/Rand-Bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "./fonts/rand/Rand-Heavy-Italic.woff2",
			weight: "800",
			style: "italic",
		},
		{
			path: "./fonts/rand/Rand-Heavy.woff2",
			weight: "800",
			style: "normal",
		},
		{
			path: "./fonts/rand/Rand-Italic.woff2",
			weight: "400",
			style: "italic",
		},
		{
			path: "./fonts/rand/Rand-Light-Italic.woff2",
			weight: "300",
			style: "italic",
		},
		{
			path: "./fonts/rand/Rand-Light.woff2",
			weight: "300",
			style: "normal",
		},
		{
			path: "./fonts/rand/Rand-Medium-Italic.woff2",
			weight: "500",
			style: "italic",
		},
		{
			path: "./fonts/rand/Rand-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "./fonts/rand/Rand-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "./fonts/rand/Rand-Thin-Italic.woff2",
			weight: "100",
			style: "italic",
		},
		{
			path: "./fonts/rand/Rand-Thin.woff2",
			weight: "100",
			style: "normal",
		},
	],
});

const randMonoFont = localFont({
	variable: "--font-rand-mono",
	src: [
		{
			path: "./fonts/rand-mono/Rand-Mono-Bold-Italic.woff2",
			weight: "700",
			style: "italic",
		},
		{
			path: "./fonts/rand-mono/Rand-Mono-Bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "./fonts/rand-mono/Rand-Mono-Heavy-Italic.woff2",
			weight: "800",
			style: "italic",
		},
		{
			path: "./fonts/rand-mono/Rand-Mono-Heavy.woff2",
			weight: "800",
			style: "normal",
		},
		{
			path: "./fonts/rand-mono/Rand-Mono-Italic.woff2",
			weight: "400",
			style: "italic",
		},
		{
			path: "./fonts/rand-mono/Rand-Mono-Medium-Italic.woff2",
			weight: "500",
			style: "italic",
		},
		{
			path: "./fonts/rand-mono/Rand-Mono-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "./fonts/rand-mono/Rand-Mono-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "./fonts/rand-mono/Rand-Mono-Thin-Italic.woff2",
			weight: "100",
			style: "italic",
		},
		{
			path: "./fonts/rand-mono/Rand-Mono-Thin.woff2",
			weight: "100",
			style: "normal",
		},
	],
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<main className={randFont.className}>
				<UserProvider>
					<Component {...pageProps} />
				</UserProvider>
			</main>
		</QueryClientProvider>
	);
}
