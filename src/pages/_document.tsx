import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en" data-theme="dark">
			<Head>
				<meta name="application-name" content="Story.com" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="Story.com" />
				<meta name="description" content="Imagination meets creativity" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="msapplication-config" content="/icons/browserconfig.xml" />
				<meta name="msapplication-TileColor" content="#2B5797" />
				<meta name="msapplication-tap-highlight" content="no" />
				<meta name="theme-color" content="#000000" />

				<link
					rel="apple-touch-icon"
					href="/images/icons/apple-touch-icon.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="152x152"
					href="/images/icons/apple-touch-icon.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/images/icons/apple-touch-icon.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="167x167"
					href="/images/icons/apple-touch-icon.png"
				/>

				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/images/icons/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/images/icons/favicon-16x16.png"
				/>
				<link rel="manifest" href="/manifest.json" />
				<link rel="shortcut icon" href="/favicon.ico" />
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
