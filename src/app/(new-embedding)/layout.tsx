'use client'
import { useState } from "react";
import clsx from "clsx";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import "@/styles/globals.css";
import { PromptProvider } from "@/features/PromptContext/PromptState";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


/**
 * Layout for the Embedding group of pages.
 */
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 1000 * 60 * 5,
					},
				},
			})
	);

	return (
		<html lang="en">
			<body className={clsx(randFont.className, "prompt-embedded-page")}>
			<QueryClientProvider client={queryClient}>

				<PromptProvider>
					{children}
				</PromptProvider>
			</QueryClientProvider>

				<Toaster />
			</body>
		</html>
	);
}

const randFont = localFont({
	variable: "--font-rand",
	src: [

		{
			path: "../../pages/fonts/rand/Rand-Bold.woff2",
			weight: "700",
			style: "normal",
		},
		
		{
			path: "../../pages/fonts/rand/Rand-Regular.woff2",
			weight: "400",
			style: "normal",
		}
	],
});
