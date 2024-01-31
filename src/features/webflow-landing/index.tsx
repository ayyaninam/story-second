export default function Landing() {
	return (
		<>
			<meta charSet="utf-8" />
			<title>Authorly</title>
			<meta content="Authorly" property="og:title" />
			<meta content="Authorly" property="twitter:title" />
			<meta content="width=device-width, initial-scale=1" name="viewport" />
			<meta content="Webflow" name="generator" />
			<script
				src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
				type="text/javascript"
				async
			></script>
			<script
				type="text/javascript"
				src={`WebFont.load({  google: {    families: ["Lato:100,100italic,300,300italic,400,400italic,700,700italic,900,900italic","Changa One:400,400italic","Inter:regular,500,600,700,800,900","Inter Tight:regular,500,600,700,800,900"]  }});`}
				async
			/>
			<script
				type="text/javascript"
				src={`!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);`}
				async
			></script>
			<link
				href="/landing/css/normalize.css"
				rel="stylesheet"
				type="text/css"
			/>
			<link href="/landing/css/webflow.css" rel="stylesheet" type="text/css" />
			<link
				href="/landing/css/authorlyai-boilerplate-ae9454200d6bad4f.webflow.css"
				rel="stylesheet"
				type="text/css"
			/>
			<link href="https://fonts.googleapis.com" rel="preconnect" />
			<link
				href="https://fonts.gstatic.com"
				rel="preconnect"
				crossOrigin="anonymous"
			/>
			<link
				href="/landing/images/favicon.png"
				rel="shortcut icon"
				type="image/x-icon"
			/>
			<link href="/landing/images/webclip.png" rel="apple-touch-icon" />
			<div
				data-animation="over-left"
				data-collapse="medium"
				data-duration={400}
				data-easing="ease"
				data-easing2="ease"
				data-doc-height={1}
				role="banner"
				className="navbar w-nav"
			>
				<div className="nav-container w-container">
					<div className="nav-menu-wrapper">
						<a
							href="index.html"
							aria-current="page"
							className="brand w-nav-brand w--current"
						>
							<div className="w-embed">
								<svg
									width={151}
									height={32}
									viewBox="0 0 151 32"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g clipPath="url(#clip0_35_26)">
										<g clipPath="url(#clip1_35_26)">
											<g clipPath="url(#clip2_35_26)">
												<path
													d="M0.740234 15.4902C0.880073 21.2096 5.48078 25.8103 11.2002 25.9641C11.1862 20.2028 6.50159 15.5182 0.740234 15.4902Z"
													fill="white"
												/>
												<path
													d="M22.5459 14.6338C22.4061 8.91438 17.8053 4.31367 12.0859 4.17383C12.0999 9.93519 16.7846 14.6198 22.5459 14.6338Z"
													fill="white"
												/>
												<path
													d="M11.2119 4.15967C5.49251 4.29951 0.891792 8.90021 0.751953 14.6196C6.5133 14.6056 11.1979 9.92102 11.2119 4.15967Z"
													fill="white"
												/>
												<path
													d="M12.0841 25.9921H11.8184H22.586V15.4902C16.7966 15.4902 12.0841 20.2028 12.0841 25.9921Z"
													fill="white"
												/>
												<path
													d="M146.186 11.4688H150.449L144.732 26.355C143.252 30.2545 141.096 31.9623 137.961 31.9623C136.657 31.9623 135.554 31.7914 134.475 31.5069L134.877 27.7497C135.779 28.0344 136.757 28.1766 137.56 28.1766C139.039 28.1766 140.218 27.4652 140.77 26.0135L140.97 25.4727H139.992L133.522 11.4688H138.412L142.575 21.1747L146.186 11.4688Z"
													fill="white"
												/>
												<path
													d="M128.018 5.96045H132.682V25.9275H128.018V5.96045Z"
													fill="white"
												/>
												<path
													d="M116.832 25.9277V11.4684H121.496L121.246 14.7701H121.396C121.722 12.8346 123.076 11.2976 125.258 11.2976C125.634 11.2976 126.035 11.3261 126.512 11.4399V15.9087C125.734 15.7094 125.007 15.6525 124.656 15.6525C122.575 15.6525 121.496 17.2464 121.496 20.0643V25.9277H116.832Z"
													fill="white"
												/>
												<path
													d="M106.742 26.4971C101.852 26.4971 98.3408 23.3092 98.3408 18.6981C98.3408 14.144 101.826 10.8992 106.742 10.8992C111.632 10.8992 115.142 14.1155 115.142 18.6981C115.142 23.2522 111.682 26.4971 106.742 26.4971ZM106.767 23.1953C108.873 23.1953 110.352 21.3167 110.352 18.6981C110.352 15.9941 108.823 14.1155 106.716 14.1155C104.635 14.1155 103.131 15.9941 103.131 18.6697C103.131 21.3167 104.66 23.1953 106.767 23.1953Z"
													fill="white"
												/>
												<path
													d="M91.2998 11.184C94.7604 11.184 96.8667 13.6888 96.8667 17.8159V25.928H92.2025V18.3852C92.2025 16.0228 91.1996 14.628 89.4692 14.628C87.7139 14.628 86.6857 15.9658 86.6857 18.2429V25.928H82.0215V5.96094H86.6857V14.5142H86.7108C87.3879 12.4648 89.093 11.184 91.2998 11.184Z"
													fill="white"
												/>
												<path
													d="M77.5351 26.1269C74.5008 26.1269 72.3191 24.2768 72.3191 20.0358V14.7131H69.9619V11.4683H71.266C72.1938 11.4683 72.6952 10.8137 72.6952 9.64668V7.71118H77.4098V8.10967C77.4098 9.90286 76.9332 11.0129 76.0305 11.3545V11.4683H80.3938V14.7131H76.9332V19.3527C76.9332 21.2028 77.7106 22.2559 79.1149 22.2559C79.4159 22.2559 79.9926 22.2559 80.3938 22.1705V25.8992C79.5412 26.0415 78.5633 26.1269 77.5351 26.1269Z"
													fill="white"
												/>
												<path
													d="M68.3941 21.1747L68.4693 25.9281H63.8802L63.8552 22.7687H63.6176L63.7298 22.6263C63.1279 24.875 61.498 26.2127 59.1408 26.2127C55.7554 26.2127 53.5488 23.6226 53.5488 19.5239V11.4688H58.2131V18.8692C58.2131 21.3455 59.1909 22.7687 60.9714 22.7687C62.6766 22.7687 63.7298 21.4878 63.7298 19.0969V11.4688H68.3941V21.1747Z"
													fill="white"
												/>
												<path
													d="M48.2923 25.9282L46.4867 20.9756H38.3619L36.5563 25.9282H31.541L39.2145 6.00391H45.6843L53.3578 25.9282H48.2923ZM39.5906 17.6454H45.258L42.4242 9.93183L39.5906 17.6454Z"
													fill="white"
												/>
											</g>
										</g>
									</g>
									<defs>
										<clipPath id="clip0_35_26">
											<path
												d="M0.740234 8C0.740234 3.58172 4.32196 0 8.74023 0H142.66C147.079 0 150.66 3.58172 150.66 8V24C150.66 28.4183 147.079 32 142.66 32H8.74024C4.32196 32 0.740234 28.4183 0.740234 24V8Z"
												fill="white"
											/>
										</clipPath>
										<clipPath id="clip1_35_26">
											<path
												d="M0.740234 8C0.740234 3.58172 4.32196 0 8.74023 0H142.66C147.079 0 150.66 3.58172 150.66 8V24C150.66 28.4183 147.079 32 142.66 32H8.74024C4.32196 32 0.740234 28.4183 0.740234 24V8Z"
												fill="white"
											/>
										</clipPath>
										<clipPath id="clip2_35_26">
											<path
												d="M0.740234 12.0015C0.740234 7.58318 4.32196 4.00146 8.74023 4.00146H142.66C147.079 4.00146 150.66 7.58319 150.66 12.0015V23.9986C150.66 28.4169 147.079 31.9986 142.66 31.9986H8.74024C4.32196 31.9986 0.740234 28.4168 0.740234 23.9986V12.0015Z"
												fill="white"
											/>
										</clipPath>
									</defs>
								</svg>
							</div>
						</a>
						<nav role="navigation" className="nav-menu w-nav-menu">
							<div className="tablet-menu">
								<a
									href="index.html"
									aria-current="page"
									className="brand-tablet w-nav-brand w--current"
								>
									<img
										src="/landing/images/Light-Logo-Type-AI.svg"
										loading="lazy"
										alt="Logo Light"
										height={52}
									/>
								</a>
								<div className="close-menu-button w-nav-button">
									<img
										src="/landing/images/close-btn.svg"
										loading="lazy"
										alt="icon"
										className="nav-close-icon"
									/>
								</div>
							</div>
							<div className="menu-wrap">
								<a href="#" className="nav-link w-nav-link">
									Menu
								</a>
								<a href="#" className="nav-link w-nav-link">
									Menu
								</a>
								<a href="#" className="nav-link w-nav-link">
									Menu
								</a>
								<a href="#" className="nav-link w-nav-link">
									Menu
								</a>
								<div
									data-w-id="e29c6a3b-4baa-3683-d3e7-ecea7db3db47"
									className="nav-button-wrapper hidden"
								>
									<a
										href="contact-us.html"
										className="primary-button-black white-color w-button"
									>
										Get Started
									</a>
								</div>
							</div>
						</nav>
						<div
							data-w-id="835e7a36-0bd9-c0ee-0eee-ba31bc15d20b"
							className="nav-button-wrapper"
						>
							<a
								href="contact-us.html"
								className="primary-button-black w-button"
							>
								Join
							</a>
						</div>
						<div className="menu-button w-nav-button">
							<img
								src="/landing/images/menu-btn.svg"
								loading="lazy"
								alt="icon"
								height={16}
								className="image-burger"
							/>
						</div>
					</div>
				</div>
				<div className="nav-shadow" />
			</div>
			<div className="styles---glowing-button w-embed">
				<style
					dangerouslySetInnerHTML={{
						__html:
							"\n * {\n     -webkit-font-smoothing: antialiased;\n     -moz-osx-font-smoothing: grayscale;\n     font-smoothing: antialiased;\n     text-rendering: optimizeLegibility;\n}\n  html { font-size: calc(0.625rem + 0.41666666666666663vw); }\n  @media screen and (max-width:1920px) { html { font-size: calc(0.625rem + 0.41666666666666674vw); } }\n  @media screen and (max-width:1440px) { html { font-size: calc(0.8126951092611863rem + 0.20811654526534862vw); } }\n  @media screen and (max-width:479px) { html { font-size: calc(0.7494769874476988rem + 0.8368200836820083vw); } }\n.glowing-wrapper-button:after {\n\tbackground: radial-gradient(85% 120% at 50% 120%, rgba(255, 255, 255, .24) 0%, rgba(255, 255, 255, 0) 100%);\n\tborder-radius: 999px;\n\tcontent: \"\";\n\theight: calc(100% + 4px);\n\tleft: -2px;\n\topacity: 0;\n\tposition: absolute;\n\ttop: -2px;\n\ttransition: 1s all;\n\twidth: calc(100% + 4px)\n}\n.glowing-wrapper-button:hover:after {\n\topacity: .7\n}\n.glowing-wrapper-active .glowing-wrapper-animations,\n.glowing-wrapper-active .glowing-wrapper-borders-masker {\n\topacity: 1\n}\n.glowing-wrapper-animations:before,\n.glowing-wrapper-borders:before {\n\tcontent: \"\";\n\tfloat: left;\n\tpadding-top: 100%\n}\n.glowing-wrapper-animations:after,\n.glowing-wrapper-borders:after {\n\tclear: both;\n\tcontent: \"\";\n\tdisplay: block\n}\n.glowing-wrapper-animations {\n\tpointer-events: none;\n}\n.glowing-wrapper-animations * {\n\theight: 100%;\n\tleft: 0;\n\tposition: absolute;\n\ttop: 0;\n\twidth: 100%\n}\n.glowing-wrapper-borders,\n.glowing-wrapper-glow,\n.glowing-wrapper-mask {\n\tanimation: borderTurn 2.5s infinite linear;\n\tbackground-image: conic-gradient(from 0 at 50% 50%, rgba(255, 255, 255, .5) 0deg, rgba(255, 255, 255, 0) 60deg, rgba(255, 255, 255, 0) 310deg, rgba(255, 255, 255, .5) 360deg);\n\tbackground-position: center center;\n\tbackground-repeat: no-repeat;\n\tbackground-size: cover\n}\n.glowing-wrapper-mask-wrapper {\n\t-webkit-mask: url(\"data:image/svg+xml,url('data:image/svg+xml,%253Csvg width='28' height='24' viewBox='0 0 28 24' fill='none' xmlns='http://www.w3.org/2000/svg'%253E%253Crect width='28' height='24' fill='black'/%253E%253C/svg%253E%250A');\");\n\tmask: url(\"data:image/svg+xml,url('data:image/svg+xml,%253Csvg width='28' height='24' viewBox='0 0 28 24' fill='none' xmlns='http://www.w3.org/2000/svg'%253E%253Crect width='28' height='24' fill='black'/%253E%253C/svg%253E%250A');\");\n\tmask-repeat: repeat;\n\t-webkit-mask-size: auto;\n\tmask-size: auto\n}\n.glowing-wrapper-borders {\n\tanimation-name: borderTurnWithTranslate\n}\n.glowing-wrapper-borders-masker {\n\tcontent: \"\";\n\tinset: 0;\n\t-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);\n\tmask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);\n\tmask-composite: xor;\n\t-webkit-mask-composite: xor;\n\tmask-composite: exclude;\n\tpointer-events: none;\n}\n@keyframes borderTurn {\n\t0% {\n\t\ttransform: rotate(0)\n\t}\n\tto {\n\t\ttransform: rotate(360deg)\n\t}\n}\n@keyframes borderTurnWithTranslate {\n\t0% {\n\t\ttransform: translate(-50%, -50%) rotate(0)\n\t}\n\tto {\n\t\ttransform: translate(-50%, -50%) rotate(360deg)\n\t}\n}\n                    ",
					}}
				/>
			</div>
			<div className="top-sections">
				<div className="section-2 hero-section">
					<div className="hero-background">
						<div className="hero-bg-grid">
							<div
								data-poster-url="https://uploads-ssl.webflow.com/65b6aa6f8f16376d85227601/65b7212024593033c5b0f2a4_untitled (1080p) (2)-poster-00001.jpg"
								data-video-urls="https://uploads-ssl.webflow.com/65b99dee9363b664a107e756/65b99dee9363b664a107e873_untitled%20(1080p)%20(2)-transcode.mp4,https://uploads-ssl.webflow.com/65b99dee9363b664a107e756/65b99dee9363b664a107e873_untitled%20(1080p)%20(2)-transcode.webm"
								data-autoplay="true"
								data-loop="true"
								data-wf-ignore="true"
								data-w-id="70670d0a-9aa9-0de0-e30f-b239d6a4f9c7"
								className="background-video-2 w-background-video w-background-video-atom"
							>
								<video
									id="70670d0a-9aa9-0de0-e30f-b239d6a4f9c7-video"
									autoPlay=""
									loop=""
									style={{
										backgroundImage:
											'url("https://uploads-ssl.webflow.com/65b6aa6f8f16376d85227601/65b7212024593033c5b0f2a4_untitled (1080p) (2)-poster-00001.jpg")',
									}}
									muted=""
									playsInline=""
									data-wf-ignore="true"
									data-object-fit="cover"
								>
									<source
										src="https://uploads-ssl.webflow.com/65b99dee9363b664a107e756/65b99dee9363b664a107e873_untitled%20(1080p)%20(2)-transcode.mp4"
										data-wf-ignore="true"
									/>
									<source
										src="https://uploads-ssl.webflow.com/65b99dee9363b664a107e756/65b99dee9363b664a107e873_untitled%20(1080p)%20(2)-transcode.webm"
										data-wf-ignore="true"
									/>
								</video>
							</div>
						</div>
					</div>
					<div className="container">
						<div className="hero-section-holder">
							<div className="hero-section-container">
								<div className="hero-section-title">
									<h1 className="hero-text">
										The First Long-Form AI&nbsp;Video Creator for Storytellers
									</h1>
								</div>
								<div className="hero-section-paragraph-holder">
									<div className="hero-description">
										Produce in Authorly to engage your audience with long-form
										AI&nbsp;generated videos that flow beautifully from start to
										finish—{" "}
										<span className="green">
											with game-changing duration &amp;&nbsp;coherence.
										</span>
									</div>
								</div>
								<div className="hero-section-button-holder">
									<div className="cta-wrapper">
										<div className="hero-cta-input-holder">
											<div className="ai-form w-form">
												<form
													id="email-form"
													name="email-form"
													data-name="Email Form"
													method="get"
													className="ai-form-content"
													data-wf-page-id="65b99dee9363b664a107e75c"
													data-wf-element-id="cba1a4b4-f959-4bbe-275a-4824f1bba85a"
												>
													<input
														className="build-form-input w-input"
														maxLength={256}
														name="Prompt"
														data-name="Prompt"
														placeholder="What is your story about?"
														type="text"
														id="Prompt"
														required=""
													/>
													<input
														type="submit"
														data-wait="Please wait..."
														className="button hero-submit-button w-button"
														defaultValue="Produce It"
													/>
												</form>
												<div className="success-message-2 w-form-done">
													<div>
														Thank you! Your submission has been received!
													</div>
												</div>
												<div className="error-message-hero w-form-fail">
													<div>👋 This is the form submission in Webflow!</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="demo" className="section-2">
					<div
						data-w-id="cba1a4b4-f959-4bbe-275a-4824f1bba864"
						className="circle-section"
					>
						<div className="circle-sticky">
							<div className="circle-sticky-content">
								<div className="circle-titles">
									<div className="circles-prompt-holder">
										<div className="circle-prompt-box">Videos For</div>
									</div>
									<div className="circles-prompt-text-holder">
										<div className="perspective perspective-relative">
											<div className="circle-title-holder _1">
												<div className="circle-title">Storytellers</div>
											</div>
										</div>
										<div className="perspective">
											<div className="circle-title-holder _2">
												<div className="circle-title">
													Authors &amp;&nbsp;Writers
												</div>
											</div>
										</div>
										<div className="perspective">
											<div className="circle-title-holder _3">
												<div className="circle-title">TikTok Influencers</div>
											</div>
										</div>
									</div>
								</div>
								<div className="circle-container">
									<div className="circle-images">
										<div className="circle-image-parent">
											<div className="circle-image-holder">
												<img
													src="/landing/images/About-Image-01_1About-Image-01.webp"
													loading="lazy"
													sizes="(max-width: 479px) 400px, 720px"
													srcSet="/landing/images/About-Image-01_1-p-500.jpg 500w, /landing/images/About-Image-01_1About-Image-01.webp 513w"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">
														Futuristic, cyberpunk
													</div>
												</div>
											</div>
										</div>
										<div className="circle-image-parent _2">
											<div className="circle-image-holder">
												<img
													src="/landing/images/Ai-Image-03_1Ai-Image-03.webp"
													loading="lazy"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">
														Game, player, fun
													</div>
												</div>
											</div>
										</div>
										<div className="circle-image-parent _3">
											<div className="circle-image-holder">
												<img
													src="/landing/images/Ai-Image-06_1Ai-Image-06.webp"
													loading="lazy"
													sizes="(max-width: 991px) 100vw, 1174.97998046875px"
													srcSet="/landing/images/Ai-Image-06_1-p-500.jpg 500w, /landing/images/Ai-Image-06_1Ai-Image-06.webp 500w"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">Dark, dazzling</div>
												</div>
											</div>
										</div>
										<div className="circle-image-parent _4">
											<div className="circle-image-holder">
												<img
													src="/landing/images/Ai-Image-08_1Ai-Image-08.webp"
													loading="lazy"
													sizes="(max-width: 991px) 100vw, 1238.33154296875px"
													srcSet="/landing/images/Ai-Image-08_1-p-500.jpg 500w, /landing/images/Ai-Image-08_1Ai-Image-08.webp 500w"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">
														Bright, flowers
													</div>
												</div>
											</div>
										</div>
										<div className="circle-image-parent _5">
											<div className="circle-image-holder">
												<img
													src="/landing/images/Ai-Image-04_1Ai-Image-04.webp"
													loading="lazy"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">
														Futuristic, dazzling
													</div>
												</div>
											</div>
										</div>
										<div className="circle-image-parent _6">
											<div className="circle-image-holder">
												<img
													src="/landing/images/Ai-Image-02_1Ai-Image-02.webp"
													loading="lazy"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">Fly, cyberpunk</div>
												</div>
											</div>
										</div>
										<div className="circle-image-parent _7">
											<div className="circle-image-holder">
												<img
													src="/landing/images/Ai-Image-01_1Ai-Image-01.webp"
													loading="lazy"
													sizes="(max-width: 991px) 100vw, (max-width: 1919px) 1174.462890625px, 61vw"
													srcSet="/landing/images/Ai-Image-01_1-p-500.jpg 500w, /landing/images/Ai-Image-01_1Ai-Image-01.webp 500w"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">
														Futuristic, dazzling
													</div>
												</div>
											</div>
										</div>
										<div className="circle-image-parent _8">
											<div className="circle-image-holder">
												<img
													src="/landing/images/Ai-Image-05_1Ai-Image-05.webp"
													loading="lazy"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">Watcher, dark</div>
												</div>
											</div>
										</div>
										<div className="circle-image-parent _9">
											<div className="circle-image-holder">
												<img
													src="/landing/images/About-Image-02_1About-Image-02.webp"
													loading="lazy"
													sizes="(max-width: 991px) 100vw, 1174.9794921875px"
													srcSet="/landing/images/About-Image-02_1-p-500.jpg 500w, /landing/images/About-Image-02_1About-Image-02.webp 635w"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">
														Futuristic, dazzling, car
													</div>
												</div>
											</div>
										</div>
										<div className="circle-image-parent _10">
											<div className="circle-image-holder">
												<img
													src="/landing/images/Ai-Image-01_1Ai-Image-01.webp"
													loading="lazy"
													sizes="(max-width: 991px) 100vw, 996.24951171875px"
													srcSet="/landing/images/Ai-Image-01_1-p-500.jpg 500w, /landing/images/Ai-Image-01_1Ai-Image-01.webp 500w"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">
														Brid, amazing, grey
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="circle-images _2">
										<div className="circle-image-parent">
											<div className="circle-image-holder">
												<img
													src="/landing/images/About-Image-01_1About-Image-01.webp"
													loading="lazy"
													sizes="(max-width: 479px) 400px, 720px"
													srcSet="/landing/images/About-Image-01_1-p-500.jpg 500w, /landing/images/About-Image-01_1About-Image-01.webp 513w"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">
														Futuristic, cyberpunk
													</div>
												</div>
											</div>
										</div>
										<div className="circle-image-parent _2">
											<div className="circle-image-holder">
												<img
													src="/landing/images/Ai-Image-03_1Ai-Image-03.webp"
													loading="lazy"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">
														Game, player, fun
													</div>
												</div>
											</div>
										</div>
										<div className="circle-image-parent _3">
											<div className="circle-image-holder">
												<img
													src="/landing/images/Ai-Image-06_1Ai-Image-06.webp"
													loading="lazy"
													sizes="(max-width: 991px) 100vw, 1174.97998046875px"
													srcSet="/landing/images/Ai-Image-06_1-p-500.jpg 500w, /landing/images/Ai-Image-06_1Ai-Image-06.webp 500w"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">Dark, dazzling</div>
												</div>
											</div>
										</div>
										<div className="circle-image-parent _4">
											<div className="circle-image-holder">
												<img
													src="/landing/images/Ai-Image-08_1Ai-Image-08.webp"
													loading="lazy"
													sizes="(max-width: 991px) 100vw, 1238.33154296875px"
													srcSet="/landing/images/Ai-Image-08_1-p-500.jpg 500w, /landing/images/Ai-Image-08_1Ai-Image-08.webp 500w"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">
														Bright, flowers
													</div>
												</div>
											</div>
										</div>
										<div className="circle-image-parent _5">
											<div className="circle-image-holder">
												<img
													src="/landing/images/Ai-Image-04_1Ai-Image-04.webp"
													loading="lazy"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">
														Futuristic, dazzling
													</div>
												</div>
											</div>
										</div>
										<div className="circle-image-parent _6">
											<div className="circle-image-holder">
												<img
													src="/landing/images/Ai-Image-02_1Ai-Image-02.webp"
													loading="lazy"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">Fly, cyberpunk</div>
												</div>
											</div>
										</div>
										<div className="circle-image-parent _7">
											<div className="circle-image-holder">
												<img
													src="/landing/images/Ai-Image-01_1Ai-Image-01.webp"
													loading="lazy"
													sizes="(max-width: 991px) 100vw, 1174.462890625px"
													srcSet="/landing/images/Ai-Image-01_1-p-500.jpg 500w, /landing/images/Ai-Image-01_1Ai-Image-01.webp 500w"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">
														Futuristic, dazzling
													</div>
												</div>
											</div>
										</div>
										<div className="circle-image-parent _8">
											<div className="circle-image-holder">
												<img
													src="/landing/images/Ai-Image-05_1Ai-Image-05.webp"
													loading="lazy"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">Watcher, dark</div>
												</div>
											</div>
										</div>
										<div className="circle-image-parent _9">
											<div className="circle-image-holder">
												<img
													src="/landing/images/About-Image-02_1About-Image-02.webp"
													loading="lazy"
													sizes="(max-width: 991px) 100vw, 1174.9794921875px"
													srcSet="/landing/images/About-Image-02_1-p-500.jpg 500w, /landing/images/About-Image-02_1About-Image-02.webp 635w"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">
														Futuristic, dazzling, car
													</div>
												</div>
											</div>
										</div>
										<div className="circle-image-parent _10">
											<div className="circle-image-holder">
												<img
													src="/landing/images/Ai-Image-01_1Ai-Image-01.webp"
													loading="lazy"
													sizes="(max-width: 991px) 100vw, 996.24951171875px"
													srcSet="/landing/images/Ai-Image-01_1-p-500.jpg 500w, /landing/images/Ai-Image-01_1Ai-Image-01.webp 500w"
													alt=""
													className="circle-image"
												/>
											</div>
											<div className="circle-item-text-container">
												<div className="circle-item-bg" />
												<div className="circle-item-text-holder">
													<div className="circle-item-commant">/image:</div>
													<div className="circle-item-text">
														Brid, amazing, grey
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="center-circle">
										<div className="circle-logo">
											<div className="w-embed">
												<svg
													width={151}
													height={32}
													viewBox="0 0 151 32"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<g clipPath="url(#clip0_35_26)">
														<g clipPath="url(#clip1_35_26)">
															<g clipPath="url(#clip2_35_26)">
																<path
																	d="M0.740234 15.4902C0.880073 21.2096 5.48078 25.8103 11.2002 25.9641C11.1862 20.2028 6.50159 15.5182 0.740234 15.4902Z"
																	fill="white"
																/>
																<path
																	d="M22.5459 14.6338C22.4061 8.91438 17.8053 4.31367 12.0859 4.17383C12.0999 9.93519 16.7846 14.6198 22.5459 14.6338Z"
																	fill="white"
																/>
																<path
																	d="M11.2119 4.15967C5.49251 4.29951 0.891792 8.90021 0.751953 14.6196C6.5133 14.6056 11.1979 9.92102 11.2119 4.15967Z"
																	fill="white"
																/>
																<path
																	d="M12.0841 25.9921H11.8184H22.586V15.4902C16.7966 15.4902 12.0841 20.2028 12.0841 25.9921Z"
																	fill="white"
																/>
																<path
																	d="M146.186 11.4688H150.449L144.732 26.355C143.252 30.2545 141.096 31.9623 137.961 31.9623C136.657 31.9623 135.554 31.7914 134.475 31.5069L134.877 27.7497C135.779 28.0344 136.757 28.1766 137.56 28.1766C139.039 28.1766 140.218 27.4652 140.77 26.0135L140.97 25.4727H139.992L133.522 11.4688H138.412L142.575 21.1747L146.186 11.4688Z"
																	fill="white"
																/>
																<path
																	d="M128.018 5.96045H132.682V25.9275H128.018V5.96045Z"
																	fill="white"
																/>
																<path
																	d="M116.832 25.9277V11.4684H121.496L121.246 14.7701H121.396C121.722 12.8346 123.076 11.2976 125.258 11.2976C125.634 11.2976 126.035 11.3261 126.512 11.4399V15.9087C125.734 15.7094 125.007 15.6525 124.656 15.6525C122.575 15.6525 121.496 17.2464 121.496 20.0643V25.9277H116.832Z"
																	fill="white"
																/>
																<path
																	d="M106.742 26.4971C101.852 26.4971 98.3408 23.3092 98.3408 18.6981C98.3408 14.144 101.826 10.8992 106.742 10.8992C111.632 10.8992 115.142 14.1155 115.142 18.6981C115.142 23.2522 111.682 26.4971 106.742 26.4971ZM106.767 23.1953C108.873 23.1953 110.352 21.3167 110.352 18.6981C110.352 15.9941 108.823 14.1155 106.716 14.1155C104.635 14.1155 103.131 15.9941 103.131 18.6697C103.131 21.3167 104.66 23.1953 106.767 23.1953Z"
																	fill="white"
																/>
																<path
																	d="M91.2998 11.184C94.7604 11.184 96.8667 13.6888 96.8667 17.8159V25.928H92.2025V18.3852C92.2025 16.0228 91.1996 14.628 89.4692 14.628C87.7139 14.628 86.6857 15.9658 86.6857 18.2429V25.928H82.0215V5.96094H86.6857V14.5142H86.7108C87.3879 12.4648 89.093 11.184 91.2998 11.184Z"
																	fill="white"
																/>
																<path
																	d="M77.5351 26.1269C74.5008 26.1269 72.3191 24.2768 72.3191 20.0358V14.7131H69.9619V11.4683H71.266C72.1938 11.4683 72.6952 10.8137 72.6952 9.64668V7.71118H77.4098V8.10967C77.4098 9.90286 76.9332 11.0129 76.0305 11.3545V11.4683H80.3938V14.7131H76.9332V19.3527C76.9332 21.2028 77.7106 22.2559 79.1149 22.2559C79.4159 22.2559 79.9926 22.2559 80.3938 22.1705V25.8992C79.5412 26.0415 78.5633 26.1269 77.5351 26.1269Z"
																	fill="white"
																/>
																<path
																	d="M68.3941 21.1747L68.4693 25.9281H63.8802L63.8552 22.7687H63.6176L63.7298 22.6263C63.1279 24.875 61.498 26.2127 59.1408 26.2127C55.7554 26.2127 53.5488 23.6226 53.5488 19.5239V11.4688H58.2131V18.8692C58.2131 21.3455 59.1909 22.7687 60.9714 22.7687C62.6766 22.7687 63.7298 21.4878 63.7298 19.0969V11.4688H68.3941V21.1747Z"
																	fill="white"
																/>
																<path
																	d="M48.2923 25.9282L46.4867 20.9756H38.3619L36.5563 25.9282H31.541L39.2145 6.00391H45.6843L53.3578 25.9282H48.2923ZM39.5906 17.6454H45.258L42.4242 9.93183L39.5906 17.6454Z"
																	fill="white"
																/>
															</g>
														</g>
													</g>
													<defs>
														<clipPath id="clip0_35_26">
															<path
																d="M0.740234 8C0.740234 3.58172 4.32196 0 8.74023 0H142.66C147.079 0 150.66 3.58172 150.66 8V24C150.66 28.4183 147.079 32 142.66 32H8.74024C4.32196 32 0.740234 28.4183 0.740234 24V8Z"
																fill="white"
															/>
														</clipPath>
														<clipPath id="clip1_35_26">
															<path
																d="M0.740234 8C0.740234 3.58172 4.32196 0 8.74023 0H142.66C147.079 0 150.66 3.58172 150.66 8V24C150.66 28.4183 147.079 32 142.66 32H8.74024C4.32196 32 0.740234 28.4183 0.740234 24V8Z"
																fill="white"
															/>
														</clipPath>
														<clipPath id="clip2_35_26">
															<path
																d="M0.740234 12.0015C0.740234 7.58318 4.32196 4.00146 8.74023 4.00146H142.66C147.079 4.00146 150.66 7.58319 150.66 12.0015V23.9986C150.66 28.4169 147.079 31.9986 142.66 31.9986H8.74024C4.32196 31.9986 0.740234 28.4168 0.740234 23.9986V12.0015Z"
																fill="white"
															/>
														</clipPath>
													</defs>
												</svg>
											</div>
										</div>
										<div className="circle-bg-grid" />
									</div>
								</div>
								<div className="circle-gradient" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="home-1-banner-section hide">
				<div className="w-layout-blockcontainer base-container w-container">
					<div className="banner-title-wrapper">
						<h1
							data-w-id="65096021-fc1b-4661-9c6d-c05c5150aa65"
							style={{ opacity: 0 }}
						>
							Your Ultimate AI Text Generator Hub.
						</h1>
						<p
							data-w-id="984da48b-27d6-cb7e-866e-7992db20d545"
							style={{ opacity: 0 }}
							className="banner-description"
						>
							Experience the marvels of artificial intelligence at your
							fingertips.
						</p>
						<div
							data-w-id="b7023885-11c5-1c95-a3db-5e1ae4bad205"
							style={{ opacity: 0 }}
							className="button-wrap"
						>
							<a
								href="our-services-1.html"
								className="button-learn-more w-button"
							>
								Learn More
							</a>
						</div>
					</div>
				</div>
				<div className="banner-gradient-1" />
				<div className="banner-images-block">
					<div className="lines-banner-block">
						<img
							src="/landing/images/Lines-Left-Dark_1Lines-Left-Dark.webp"
							loading="lazy"
							style={{ opacity: 0 }}
							data-w-id="ba84bb94-dba5-1b7c-26a2-e7d41cc91071"
							alt="Image Lines"
						/>
					</div>
					<div className="banner-cards-wrapper">
						<img
							className="card-light"
							src="/landing/images/Card-Light-Big_1Card-Light-Big.webp"
							alt="Card Light"
							style={{ opacity: 0 }}
							sizes="100vw"
							data-w-id="db87da72-e347-5e20-0881-8391dd9a91ef"
							loading="lazy"
							srcSet="/landing/images/Card-Light-Big_1-p-500.png 500w, /landing/images/Card-Light-Big_1-p-800.png 800w, /landing/images/Card-Light-Big_1-p-1080.png 1080w, /landing/images/Card-Light-Big_1Card-Light-Big.webp 1170w"
						/>
						<img
							src="/landing/images/Card_1Card.webp"
							loading="lazy"
							height=""
							alt="Card"
							style={{ opacity: 0 }}
							data-w-id="59c13da0-cee9-0f3e-6ae5-11cef649f570"
							className="card-dark"
						/>
					</div>
					<div className="lines-banner-block">
						<img
							src="/landing/images/Lines-Right-Dark.webp"
							loading="lazy"
							style={{ opacity: 0 }}
							data-w-id="abaa5e7f-cb1d-fa0a-2b07-850575af8541"
							alt="Lines Right Dark"
						/>
					</div>
				</div>
			</div>
			<div className="section-texture without-bottom-spacing">
				<div className="base-container w-container">
					<div className="gradient-figure-1-home-1" />
					<div
						data-w-id="92dba6dd-f1b4-079e-312a-4872224e313a"
						style={{ opacity: 0 }}
						className="section-title-wrapper"
					>
						<h2
							id="provide-assistance"
							data-w-id="92dba6dd-f1b4-079e-312a-4872224e313f"
							style={{ opacity: 0 }}
							className="capitalize"
						>
							Authorly enables you to produce more, faster.
						</h2>
					</div>
					<div
						data-current="Tab 1"
						data-easing="ease"
						data-duration-in={500}
						data-duration-out={100}
						className="section-bottom-spacing w-tabs"
					>
						<div
							data-w-id="80e3ec2a-9974-5716-afc3-d73cc7ed1151"
							style={{ opacity: 0 }}
							className="tabs-menu-home-1 w-tab-menu"
						>
							<a
								data-w-tab="Tab 1"
								className="tab-item w-inline-block w-tab-link w--current"
							>
								<div className="tab-content">
									<div className="tab-title-wrapper">
										<h4 className="tab-item-title">More Than 4 Seconds</h4>
									</div>
									<p className="tab-description">
										Produce mini-stories and AI&nbsp;generated videos up to 60
										seconds long with unprecedented coherence.{" "}
									</p>
								</div>
							</a>
							<a
								data-w-tab="Tab 2"
								className="tab-item w-inline-block w-tab-link"
							>
								<div className="tab-content">
									<div className="tab-title-wrapper">
										<h4 className="tab-item-title">More Control</h4>
									</div>
									<p className="tab-description">
										For the first time, AI can produce long-form narratives from
										your own text narratives. Plotlines, characters &amp; ideas
										stay consistent.
									</p>
								</div>
							</a>
							<a
								data-w-tab="Tab 3"
								className="tab-item last-child w-inline-block w-tab-link"
							>
								<div className="tab-content">
									<div className="tab-title-wrapper">
										<h4 className="tab-item-title">More Story-Centric</h4>
									</div>
									<p className="tab-description">
										We model a storyboard progression to achieve plots that form
										story arcs—from introduction to climax to resolution.
									</p>
								</div>
							</a>
						</div>
						<div className="w-tab-content">
							<div
								data-w-tab="Tab 1"
								data-w-id="80e3ec2a-9974-5716-afc3-d73cc7ed115c"
								style={{ opacity: 0 }}
								className="tab-item-content w-tab-pane w--tab-active"
							>
								<img
									width={1200}
									height={500}
									alt="Image Person"
									src="/landing/images/Image-Person-1_1Image-Person-1.webp"
									loading="lazy"
									srcSet="/landing/images/Image-Person-1_1-p-500.jpg 500w, /landing/images/Image-Person-1_1-p-800.jpg 800w, /landing/images/Image-Person-1_1-p-1080.jpg 1080w, /landing/images/Image-Person-1_1Image-Person-1.webp 1920w"
									sizes="(max-width: 479px) 94vw, (max-width: 767px) 96vw, (max-width: 1279px) 97vw, 1170px"
									className="tab-image"
								/>
								<img
									loading="lazy"
									src="/landing/images/Card-Tab.png"
									alt="Card Tab"
									className="image-card-tab"
								/>
							</div>
							<div data-w-tab="Tab 2" className="tab-item-content w-tab-pane">
								<img
									width={1200}
									height={500}
									alt="Image Person"
									src="/landing/images/Image-Person-2_1Image-Person-2.webp"
									loading="lazy"
									srcSet="/landing/images/Image-Person-2_1-p-500.jpg 500w, /landing/images/Image-Person-2_1-p-800.jpg 800w, /landing/images/Image-Person-2_1-p-1080.jpg 1080w, /landing/images/Image-Person-2_1-p-1600.jpg 1600w, /landing/images/Image-Person-2_1Image-Person-2.webp 1920w"
									sizes="(max-width: 479px) 94vw, (max-width: 767px) 96vw, (max-width: 1279px) 97vw, 1170px"
									className="tab-image"
								/>
								<img
									loading="lazy"
									src="/landing/images/Card-Tab.png"
									alt="Card Tab"
									className="image-card-tab"
								/>
							</div>
							<div data-w-tab="Tab 3" className="tab-item-content w-tab-pane">
								<img
									width={1200}
									height={500}
									alt="Image Person"
									src="/landing/images/Image-Person-3_1Image-Person-3.webp"
									loading="lazy"
									srcSet="/landing/images/Image-Person-3_1-p-500.jpg 500w, /landing/images/Image-Person-3_1-p-800.jpg 800w, /landing/images/Image-Person-3_1-p-1080.jpg 1080w, /landing/images/Image-Person-3_1Image-Person-3.webp 1920w"
									sizes="(max-width: 479px) 94vw, (max-width: 767px) 96vw, (max-width: 1279px) 97vw, 1170px"
									className="tab-image"
								/>
								<img
									loading="lazy"
									src="/landing/images/Card-Tab.png"
									alt="Card Tab"
									className="image-card-tab"
								/>
							</div>
						</div>
					</div>
					<div className="section-title-wrapper">
						<h2
							id="provide-assistance"
							data-w-id="0a3a8a66-e53c-a798-98e5-7edecc474e4c"
							style={{ opacity: 0 }}
							className="heading"
						>
							For Creators Like You,
							<br />
							Who Need <span className="purp">A&nbsp;Minute</span>.
						</h2>
					</div>
					<div className="features-wrapper">
						<div
							data-w-id="e80cf79a-500b-b35d-3ffe-ec22c5607467"
							style={{ opacity: 0 }}
							className="feature-block"
						>
							<div className="icon-feature mb-50">
								<img src="/landing/images/file.svg" loading="lazy" alt="Icon" />
							</div>
							<h4 className="mb-15">Animators</h4>
							<p className="paragraph-large">
								Bring your animated characters to life with rich backstories.
								Generate vivid 60-second shorts faster for pilots and demos to
								showcase your style. Focus creativity on character design while
								our Al handles coherent story arcs and continuity.
							</p>
						</div>
						<div
							data-w-id="7c5794ee-1389-99f7-ac15-0f5ddc0f14e0"
							style={{ opacity: 0 }}
							className="feature-block"
						>
							<div className="icon-feature mb-50">
								<img
									src="/landing/images/playlist.svg"
									loading="lazy"
									alt="Icon"
								/>
							</div>
							<h4 className="mb-15">Influencers</h4>
							<p className="paragraph-large">
								Explode your follower count with an endless stream of short
								viral videos with jokes, stunts and cliffhangers tailored to
								your brand. Don't waste hours stitching clips hoping one
								sticks—let Authorly generate narrative possibilities &amp;
								select the best.
							</p>
						</div>
						<div
							data-w-id="c4a98186-6adf-e609-dd26-366c370999ec"
							style={{ opacity: 0 }}
							className="feature-block"
						>
							<div className="icon-feature mb-50">
								<img
									src="/landing/images/bar-chart.svg"
									loading="lazy"
									alt="Icon"
								/>
							</div>
							<h4 className="mb-15">Video Pros</h4>
							<p className="paragraph-large">
								Amplify your capabilities by starting with AI-generated
								60-second rough cuts for ads, trailers and promos. Choose
								various story directions or guide generation with simple text
								prompts. Authorly helps you brainstorm so you can refine, polish
								and apply your creative expertise to make visual magic at scale.
							</p>
						</div>
						<div
							data-w-id="e9634f33-63fd-847b-0cc5-d99194950707"
							style={{ opacity: 0 }}
							className="feature-block"
						>
							<div className="icon-feature mb-50">
								<img
									src="/landing/images/users.svg"
									loading="lazy"
									alt="Icon"
								/>
							</div>
							<h4 className="mb-15">Storytellers</h4>
							<p className="paragraph-large">
								At last, generate the captivating tales your imagination
								overflows with and exhibit your signature style. Manifest that
								avant-garde miniseries concept networks balked at risking. Craft
								a phenomenal pilot conveying your vision faster than conceivably
								imaginable before AI augmentation.
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className="section-texture">
				<div className="gradient-figure-1" />
				<div className="dark-wrapper section-spacing-bottom no-padding-bottom">
					<div className="gradient-figure-15" />
					<div className="loop-wrap">
						<div
							data-w-id="b58f9da2-a4e3-422c-acd0-574c603c4b65"
							className="top-loop-row"
						>
							<div className="top-loop-wrapper">
								<div className="loop-item-wrapper">
									<div className="loop-item">
										<div className="item-text">Marketing</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Email</div>
									</div>
									<div className="loop-item">
										<div className="item-text">TikTok</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Blog</div>
									</div>
									<div className="loop-item">
										<div className="item-text">explainers</div>
									</div>
									<div className="loop-item">
										<div className="item-text">News</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Storytelling</div>
									</div>
									<div className="loop-item">
										<div className="item-text">training</div>
									</div>
									<div className="loop-item">
										<div className="item-text">youtube</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Ads</div>
									</div>
									<div className="loop-item">
										<div className="item-text">instagram</div>
									</div>
									<div className="loop-item">
										<div className="item-text">reels</div>
									</div>
									<div className="loop-item">
										<div className="item-text">shorts</div>
									</div>
									<div className="loop-item">
										<div className="item-text">fiction</div>
									</div>
									<div className="loop-item">
										<div className="item-text">FAQ</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Podcast</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Articles</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Articles</div>
									</div>
								</div>
								<div className="loop-item-wrapper">
									<div className="loop-item">
										<div className="item-text">Marketing</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Email</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Podcast</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Blog</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Articles</div>
									</div>
									<div className="loop-item">
										<div className="item-text">News</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Storytelling</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Text</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Editor</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Ads</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Homework</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Ideas</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Social Media</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Code</div>
									</div>
									<div className="loop-item">
										<div className="item-text">FAQ</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Podcast</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Articles</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Articles</div>
									</div>
								</div>
							</div>
						</div>
						<div
							data-w-id="8c0203cc-87b9-a83b-5212-91d1e86f3159"
							className="bottom-loop-row"
						>
							<div className="bottom-loop-wrapper">
								<div className="loop-item-wrapper">
									<div className="loop-item">
										<div className="item-text">Marketing</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Email</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Podcast</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Blog</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Articles</div>
									</div>
									<div className="loop-item">
										<div className="item-text">News</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Storytelling</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Text</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Editor</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Ads</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Homework</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Ideas</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Social Media</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Code</div>
									</div>
									<div className="loop-item">
										<div className="item-text">FAQ</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Podcast</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Articles</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Articles</div>
									</div>
								</div>
								<div className="loop-item-wrapper">
									<div className="loop-item">
										<div className="item-text">Marketing</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Email</div>
									</div>
									<div className="loop-item">
										<div className="item-text">fanfic</div>
									</div>
									<div className="loop-item">
										<div className="item-text">trailer</div>
									</div>
									<div className="loop-item">
										<div className="item-text">promo</div>
									</div>
									<div className="loop-item">
										<div className="item-text">manuscript</div>
									</div>
									<div className="loop-item">
										<div className="item-text">demos</div>
									</div>
									<div className="loop-item">
										<div className="item-text">showreels</div>
									</div>
									<div className="loop-item">
										<div className="item-text">portfolios</div>
									</div>
									<div className="loop-item">
										<div className="item-text">video Ads</div>
									</div>
									<div className="loop-item">
										<div className="item-text">commercials</div>
									</div>
									<div className="loop-item">
										<div className="item-text">animations</div>
									</div>
									<div className="loop-item">
										<div className="item-text">music videos</div>
									</div>
									<div className="loop-item">
										<div className="item-text">dramas</div>
									</div>
									<div className="loop-item">
										<div className="item-text">memes</div>
									</div>
									<div className="loop-item">
										<div className="item-text">posts</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Articles</div>
									</div>
									<div className="loop-item">
										<div className="item-text">Email</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="w-layout-blockcontainer base-container w-container">
						<div className="dual-grid">
							<div className="space-between-vertical justyfy-end">
								<div className="mb-50">
									<h2
										data-w-id="cadaf212-77c0-3594-cac0-3c50b1a68ad5"
										style={{ opacity: 0 }}
										className="heading-white mb-25"
									>
										Infinite Possibilities
									</h2>
									<p
										data-w-id="2af7463c-dbce-7c2b-7bba-ebdb2900c645"
										style={{ opacity: 0 }}
										className="paragraph-large text-white"
									>
										<strong>
											Bring movie trailers to life in minutes without costly
											studios.{" "}
										</strong>
										Dream up AI-generated clips highlight intriguing characters.
										The possibilities are endless with a machine learning
										assistant that can weave logical mini-movie narratives.
										<br />
										<br />
										In minutes, you can explore endless inspired narrative
										directions, vividly rendered. No more struggling trying to
										coerce emotion and continuity from fragmented clips under
										tight deadlines that kill creativity.
										<br />‍<br />
										Authorly frees you to accelerate by focusing efforts on the
										essence of directing compelling video stories at scale. This
										changes everything. What unique 60-second video
										possibilities might you explore?
									</p>
								</div>
								<a
									data-w-id="d759c6c7-4dd7-7c04-254c-ac1f9c094ed3"
									style={{ opacity: 0 }}
									href="contact-us.html"
									className="secondary-button w-button"
								>
									Let's generate
								</a>
							</div>
							<div
								id="w-node-_1616b6d0-0619-d227-2001-7774af69ae7e-a107e75c"
								className="chart-image-wrapper"
							>
								<a
									href="#"
									className="glowing-wrapper glowing-wrapper-active w-inline-block"
								>
									<div className="styles---glowing-card w-embed">
										<style
											dangerouslySetInnerHTML={{
												__html:
													"\n * {\n     -webkit-font-smoothing: antialiased;\n     -moz-osx-font-smoothing: grayscale;\n     font-smoothing: antialiased;\n     text-rendering: optimizeLegibility;\n}\n  html { font-size: calc(0.625rem + 0.41666666666666663vw); }\n  @media screen and (max-width:1920px) { html { font-size: calc(0.625rem + 0.41666666666666674vw); } }\n  @media screen and (max-width:1440px) { html { font-size: calc(0.8126951092611863rem + 0.20811654526534862vw); } }\n  @media screen and (max-width:479px) { html { font-size: calc(0.7494769874476988rem + 0.8368200836820083vw); } }\n.glowing-wrapper-card:after {\n\tbackground: radial-gradient(85% 120% at 50% 120%, rgba(255, 255, 255, .24) 0%, rgba(255, 255, 255, 0) 100%);\n\tborder-radius: 999px;\n\tcontent: \"\";\n\theight: calc(100% + 4px);\n\tleft: -2px;\n\topacity: 0;\n\tposition: absolute;\n\ttop: -2px;\n\ttransition: 1s all;\n\twidth: calc(100% + 4px)\n}\n.glowing-wrapper-card:hover:after {\n\topacity: 0%\n}\n.glowing-wrapper-active .glowing-wrapper-animations,\n.glowing-wrapper-active .glowing-wrapper-borders-masker {\n\topacity: 1\n}\n.glowing-wrapper-animations:before,\n.glowing-wrapper-borders:before {\n\tcontent: \"\";\n\tfloat: left;\n\tpadding-top: 100%\n}\n.glowing-wrapper-animations:after,\n.glowing-wrapper-borders:after {\n\tclear: both;\n\tcontent: \"\";\n\tdisplay: block\n}\n.glowing-wrapper-animations {\n\tpointer-events: none;\n}\n.glowing-wrapper-animations * {\n\theight: 100%;\n\tleft: 0;\n\tposition: absolute;\n\ttop: 0;\n\twidth: 100%\n}\n.glowing-wrapper-borders,\n.glowing-wrapper-glow,\n.glowing-wrapper-mask {\n\tanimation: borderTurn 4.5s infinite linear;\n\tbackground-image: conic-gradient(from 0 at 50% 50%, rgba(255, 255, 255, .5) 0deg, rgba(255, 255, 255, 0) 60deg, rgba(255, 255, 255, 0) 310deg, rgba(255, 255, 255, .5) 360deg);\n\tbackground-position: center center;\n\tbackground-repeat: repeat;\n\tbackground-size: cover\n}\n.glowing-wrapper-mask-wrapper {\n\t-webkit-mask: url(\"data:image/svg+xml,url('data:image/svg+xml,%253Csvg width='99%' height='99%' viewBox='0 0 28 24' fill='none' xmlns='http://www.w3.org/2000/svg'%253E%253Crect width='28' height='24' fill='black'/%253E%253C/svg%253E%250A');\");\n\tmask: url(\"data:image/svg+xml,url('data:image/svg+xml,%253Csvg width='28' height='24' viewBox='0 0 28 24' fill='none' xmlns='http://www.w3.org/2000/svg'%253E%253Crect width='28' height='24' fill='black'/%253E%253C/svg%253E%250A');\");\n\tmask-repeat: repeat;\n\t-webkit-mask-size: auto;\n\tmask-size: auto\n}\n.glowing-wrapper-borders {\n\tanimation-name: borderTurnWithTranslate\n}\n.glowing-wrapper-borders-masker {\n\tcontent: \"\";\n\tinset: 0;\n\t-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);\n\tmask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);\n\tmask-composite: xor;\n\t-webkit-mask-composite: xor;\n\tmask-composite: exclude;\n\tpointer-events: none;\n}\n@keyframes borderTurn {\n\t0% {\n\t\ttransform: rotate(0)\n\t}\n\tto {\n\t\ttransform: rotate(360deg)\n\t}\n}\n@keyframes borderTurnWithTranslate {\n\t0% {\n\t\ttransform: translate(-50%, -50%) rotate(0)\n\t}\n\tto {\n\t\ttransform: translate(-50%, -50%) rotate(360deg)\n\t}\n}\n                    ",
											}}
										/>
									</div>
									<div className="glowing-wrapper-animations">
										<div className="glowing-wrapper-mask-wrapper">
											<div className="glowing-wrapper-mask" />
										</div>
									</div>
									<div className="glowing-wrapper-borders-masker">
										<div className="glowing-wrapper-borders" />
									</div>
									<div className="glowing-wrapper-card">
										<div className="card">
											<div className="card-content">
												<div
													data-w-id="f5d25a33-a724-bd02-ee1a-bb2413f09762"
													className="lottie-banner"
												>
													<div className="lines-d1">
														<div
															style={{ width: 1, height: "0%" }}
															className="line-banner-w"
														/>
														<div
															style={{ width: 1, height: "0%" }}
															className="line-banner-w"
														/>
														<div
															style={{ width: 1, height: "0%" }}
															className="line-banner-w"
														/>
														<div
															style={{ width: 1, height: "0%" }}
															className="line-banner-w"
														/>
														<div
															style={{ width: 1, height: "0%" }}
															className="line-banner-w"
														/>
														<div
															style={{ width: 1, height: "0%" }}
															className="line-banner-w"
														/>
													</div>
													<div className="lines-d2">
														<div
															style={{ width: "0%", height: 1 }}
															className="line-banner-h"
														/>
														<div
															style={{ width: "0%", height: 1 }}
															className="line-banner-h"
														/>
														<div
															style={{ width: "0%", height: 1 }}
															className="line-banner-h"
														/>
														<div
															style={{ width: "0%", height: 1 }}
															className="line-banner-h"
														/>
														<div
															style={{ width: "0%", height: 1 }}
															className="line-banner-h"
														/>
														<div
															style={{ width: "0%", height: 1 }}
															className="line-banner-h"
														/>
													</div>
													<div className="block-lottie-banner">
														<div
															data-w-id="f5d25a33-a724-bd02-ee1a-bb2413f09772"
															data-is-ix2-target={1}
															className="lottie-animation-1-banner"
															data-animation-type="lottie"
															data-src="https://uploads-ssl.webflow.com/656f760e7277054608e328af/656f760e7277054608e32923_Lottie%20D1%20Blue.json"
															data-loop={0}
															data-direction={1}
															data-autoplay={0}
															data-renderer="svg"
															data-default-duration="2.5"
															data-duration={0}
														/>
														<div
															className="lottie-animation-2-banner"
															data-w-id="f5d25a33-a724-bd02-ee1a-bb2413f09773"
															data-animation-type="lottie"
															data-src="https://uploads-ssl.webflow.com/656f760e7277054608e328af/656f760e7277054608e32932_Lottie%20D2%20Yellow.json"
															data-loop={0}
															data-direction={1}
															data-autoplay={1}
															data-is-ix2-target={0}
															data-renderer="svg"
															data-default-duration={2}
															data-duration={0}
														/>
														<div
															className="lottie-animation-2-blur-banner"
															data-w-id="f5d25a33-a724-bd02-ee1a-bb2413f09774"
															data-animation-type="lottie"
															data-src="https://uploads-ssl.webflow.com/656f760e7277054608e328af/656f760e7277054608e32932_Lottie%20D2%20Yellow.json"
															data-loop={0}
															data-direction={1}
															data-autoplay={1}
															data-is-ix2-target={0}
															data-renderer="svg"
															data-default-duration={2}
															data-duration={0}
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								</a>
							</div>
						</div>
						<div className="work-steps-wrapper">
							<div className="chart-images-wrapper">
								<a
									href="#"
									className="glowing-wrapper glowing-wrapper-active w-inline-block"
								>
									<div className="styles---glowing-card w-embed">
										<style
											dangerouslySetInnerHTML={{
												__html:
													"\n * {\n     -webkit-font-smoothing: antialiased;\n     -moz-osx-font-smoothing: grayscale;\n     font-smoothing: antialiased;\n     text-rendering: optimizeLegibility;\n}\n  html { font-size: calc(0.625rem + 0.41666666666666663vw); }\n  @media screen and (max-width:1920px) { html { font-size: calc(0.625rem + 0.41666666666666674vw); } }\n  @media screen and (max-width:1440px) { html { font-size: calc(0.8126951092611863rem + 0.20811654526534862vw); } }\n  @media screen and (max-width:479px) { html { font-size: calc(0.7494769874476988rem + 0.8368200836820083vw); } }\n.glowing-wrapper-card:after {\n\tbackground: radial-gradient(85% 120% at 50% 120%, rgba(255, 255, 255, .24) 0%, rgba(255, 255, 255, 0) 100%);\n\tborder-radius: 999px;\n\tcontent: \"\";\n\theight: calc(100% + 4px);\n\tleft: -2px;\n\topacity: 0;\n\tposition: absolute;\n\ttop: -2px;\n\ttransition: 1s all;\n\twidth: calc(100% + 4px)\n}\n.glowing-wrapper-card:hover:after {\n\topacity: 0%\n}\n.glowing-wrapper-active .glowing-wrapper-animations,\n.glowing-wrapper-active .glowing-wrapper-borders-masker {\n\topacity: 1\n}\n.glowing-wrapper-animations:before,\n.glowing-wrapper-borders:before {\n\tcontent: \"\";\n\tfloat: left;\n\tpadding-top: 100%\n}\n.glowing-wrapper-animations:after,\n.glowing-wrapper-borders:after {\n\tclear: both;\n\tcontent: \"\";\n\tdisplay: block\n}\n.glowing-wrapper-animations {\n\tpointer-events: none;\n}\n.glowing-wrapper-animations * {\n\theight: 100%;\n\tleft: 0;\n\tposition: absolute;\n\ttop: 0;\n\twidth: 100%\n}\n.glowing-wrapper-borders,\n.glowing-wrapper-glow,\n.glowing-wrapper-mask {\n\tanimation: borderTurn 4.5s infinite linear;\n\tbackground-image: conic-gradient(from 0 at 50% 50%, rgba(255, 255, 255, .5) 0deg, rgba(255, 255, 255, 0) 60deg, rgba(255, 255, 255, 0) 310deg, rgba(255, 255, 255, .5) 360deg);\n\tbackground-position: center center;\n\tbackground-repeat: repeat;\n\tbackground-size: cover\n}\n.glowing-wrapper-mask-wrapper {\n\t-webkit-mask: url(\"data:image/svg+xml,url('data:image/svg+xml,%253Csvg width='99%' height='99%' viewBox='0 0 28 24' fill='none' xmlns='http://www.w3.org/2000/svg'%253E%253Crect width='28' height='24' fill='black'/%253E%253C/svg%253E%250A');\");\n\tmask: url(\"data:image/svg+xml,url('data:image/svg+xml,%253Csvg width='28' height='24' viewBox='0 0 28 24' fill='none' xmlns='http://www.w3.org/2000/svg'%253E%253Crect width='28' height='24' fill='black'/%253E%253C/svg%253E%250A');\");\n\tmask-repeat: repeat;\n\t-webkit-mask-size: auto;\n\tmask-size: auto\n}\n.glowing-wrapper-borders {\n\tanimation-name: borderTurnWithTranslate\n}\n.glowing-wrapper-borders-masker {\n\tcontent: \"\";\n\tinset: 0;\n\t-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);\n\tmask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);\n\tmask-composite: xor;\n\t-webkit-mask-composite: xor;\n\tmask-composite: exclude;\n\tpointer-events: none;\n}\n@keyframes borderTurn {\n\t0% {\n\t\ttransform: rotate(0)\n\t}\n\tto {\n\t\ttransform: rotate(360deg)\n\t}\n}\n@keyframes borderTurnWithTranslate {\n\t0% {\n\t\ttransform: translate(-50%, -50%) rotate(0)\n\t}\n\tto {\n\t\ttransform: translate(-50%, -50%) rotate(360deg)\n\t}\n}\n                    ",
											}}
										/>
									</div>
									<div className="glowing-wrapper-animations">
										<div className="glowing-wrapper-mask-wrapper">
											<div className="glowing-wrapper-mask" />
										</div>
									</div>
									<div className="glowing-wrapper-borders-masker">
										<div className="glowing-wrapper-borders" />
									</div>
									<div className="glowing-wrapper-card">
										<div className="card">
											<div className="card-content">
												<div
													data-w-id="5ce9bd5f-1fe7-3bc9-bfbd-73c1204c1492"
													className="lottie"
												>
													<div className="lines-b1">
														<div
															style={{ width: 1, height: "0%" }}
															className="line-w"
														/>
														<div
															style={{ width: 1, height: "0%" }}
															className="line-w"
														/>
														<div
															style={{ width: 1, height: "0%" }}
															className="line-w"
														/>
														<div
															style={{ width: 1, height: "0%" }}
															className="line-w"
														/>
														<div
															style={{ width: 1, height: "0%" }}
															className="line-w"
														/>
														<div
															style={{ width: 1, height: "0%" }}
															className="line-w"
														/>
													</div>
													<div className="lines-b2">
														<div
															style={{ width: "0%", height: 1 }}
															className="line-h"
														/>
														<div
															style={{ width: "0%", height: 1 }}
															className="line-h"
														/>
														<div
															style={{ width: "0%", height: 1 }}
															className="line-h"
														/>
														<div
															style={{ width: "0%", height: 1 }}
															className="line-h"
														/>
														<div
															style={{ width: "0%", height: 1 }}
															className="line-h"
														/>
														<div
															style={{ width: "0%", height: 1 }}
															className="line-h"
														/>
													</div>
													<div className="block-lottie">
														<div
															data-w-id="5ce9bd5f-1fe7-3bc9-bfbd-73c1204c14a2"
															data-is-ix2-target={1}
															className="lottie-animation-3"
															data-animation-type="lottie"
															data-src="https://uploads-ssl.webflow.com/656f760e7277054608e328af/656f760e7277054608e32922_Lottie%20B1%20White.json"
															data-loop={0}
															data-direction={1}
															data-autoplay={0}
															data-renderer="svg"
															data-default-duration="2.5"
															data-duration={0}
														/>
														<div
															className="lottie-animation-2"
															data-w-id="5ce9bd5f-1fe7-3bc9-bfbd-73c1204c14a3"
															data-animation-type="lottie"
															data-src="https://uploads-ssl.webflow.com/656f760e7277054608e328af/656f760e7277054608e32925_Lottie%20B2%20Blue.json"
															data-loop={1}
															data-direction={1}
															data-autoplay={1}
															data-is-ix2-target={0}
															data-renderer="svg"
															data-default-duration={16}
															data-duration={0}
														/>
														<div
															className="lottie-animation-2-blur"
															data-w-id="5ce9bd5f-1fe7-3bc9-bfbd-73c1204c14a4"
															data-animation-type="lottie"
															data-src="https://uploads-ssl.webflow.com/656f760e7277054608e328af/656f760e7277054608e32925_Lottie%20B2%20Blue.json"
															data-loop={1}
															data-direction={1}
															data-autoplay={1}
															data-is-ix2-target={0}
															data-renderer="svg"
															data-default-duration={16}
															data-duration={0}
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								</a>
							</div>
							<div className="about-description-wrapper">
								<h2
									data-w-id="672338e5-60c3-f484-b7d8-8b43313aee74"
									style={{ opacity: 0 }}
									className="heading-white mb-25"
								>
									Four Simple Steps
								</h2>
								<div className="about-wrapper">
									<div className="about-row">
										<div
											data-w-id="52d9e085-6bcd-ab18-7b30-40873fb63a71"
											style={{ opacity: 0 }}
											className="number-item"
										>
											<p className="number">1</p>
										</div>
										<h4
											data-w-id="8c81e468-8aff-c41b-d8b1-ab81043daaee"
											style={{ opacity: 0 }}
											className="heading-white-mono"
										>
											input your script &amp;&nbsp;hit produce
										</h4>
									</div>
									<div className="about-row">
										<div
											data-w-id="fb94ad5e-057d-a057-34fc-ff3700fb9a92"
											style={{ opacity: 0 }}
											className="number-item"
										>
											<p className="number">2</p>
										</div>
										<h4
											data-w-id="fb94ad5e-057d-a057-34fc-ff3700fb9a95"
											style={{ opacity: 0 }}
											className="heading-white-mono"
										>
											ai produces a video based on your script
										</h4>
									</div>
									<div className="about-row">
										<div
											data-w-id="7df088f7-3d81-f08f-efea-6fd1f6e1d505"
											style={{ opacity: 0 }}
											className="number-item"
										>
											<p className="number">3</p>
										</div>
										<h4
											data-w-id="7df088f7-3d81-f08f-efea-6fd1f6e1d508"
											style={{ opacity: 0 }}
											className="heading-white-mono"
										>
											edit storyline and visuals with ai tools
										</h4>
									</div>
									<div className="about-row">
										<div
											data-w-id="c70cfba4-675a-fefb-95e5-c6969f97fced"
											style={{ opacity: 0 }}
											className="number-item"
										>
											<p className="number">4</p>
										</div>
										<h4
											data-w-id="c70cfba4-675a-fefb-95e5-c6969f97fcf0"
											style={{ opacity: 0 }}
											className="heading-white-mono"
										>
											export &amp; share anywhere
										</h4>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="logo-companies-block with-paddings">
					<div
						data-w-id="4d28c50b-1930-f6fe-403c-f37d45d17b88"
						style={{ opacity: 0 }}
						className="number-100"
					>
						4s
					</div>
					<div
						data-w-id="4d28c50b-1930-f6fe-403c-f37d45d17b8a"
						style={{ opacity: 0 }}
						className="title-wrapper"
					>
						<h2
							id="provide-assistance"
							data-w-id="4d28c50b-1930-f6fe-403c-f37d45d17b8b"
							style={{ opacity: 0 }}
							className="heading-2"
						>
							Break the rule of
						</h2>
					</div>
				</div>
			</div>
			<div className="section-texture without-top-spacing">
				<div className="w-layout-blockcontainer base-container w-container">
					<div
						data-w-id="a563eff6-9d99-1b49-6c16-e5bdb1367c75"
						style={{ opacity: 0 }}
						className="section-title-wrapper"
					>
						<h2
							id="provide-assistance"
							data-w-id="a563eff6-9d99-1b49-6c16-e5bdb1367c76"
							style={{ opacity: 0 }}
						>
							You need at least one good, long, minute—don't you?
						</h2>
					</div>
					<div className="counter-wrapper">
						<div
							data-w-id="9d1143e5-2389-7c57-7712-c0c8d553e2e1"
							style={{ opacity: 0 }}
							className="counter-block"
						>
							<h3>2M+</h3>
							<p className="paragraph-large">Active users</p>
						</div>
						<div
							data-w-id="0f453cbf-0b05-ab46-9b6c-1916be74e599"
							style={{ opacity: 0 }}
							className="counter-block second-item"
						>
							<h3>32,032,000s</h3>
							<p className="paragraph-large">Generated AI&nbsp;Video</p>
						</div>
						<div
							data-w-id="d78a3f14-2d87-20da-0a99-12f8b406043c"
							style={{ opacity: 0 }}
							className="counter-block second-item"
						>
							<h3>1.21</h3>
							<p className="paragraph-large">Jigawatts</p>
						</div>
						<div
							data-w-id="669e8e0c-6e4b-471d-ee2f-4c50d1d418ff"
							style={{ opacity: 0 }}
							className="counter-block second-item"
						>
							<h3>24+</h3>
							<p className="paragraph-large">Trusted partners</p>
						</div>
					</div>
				</div>
			</div>
			<div className="section-texture without-top-spacing">
				<div className="base-container w-container">
					<div className="section-title-testimonials">
						<h2
							id="provide-assistance"
							data-w-id="7f441917-cc83-3032-7f50-2616820ef91f"
							style={{ opacity: 0 }}
						>
							Some of our beta feedback
						</h2>
					</div>
					<div className="_2-column-wrapper-testimonials">
						<div className="column-testimonials-left">
							<div
								data-w-id="dc16bb77-a14a-b600-6053-5f44ac9ddfb5"
								style={{ opacity: 0 }}
								className="testimonials-item-wide"
							>
								<div className="quote-content">
									<img
										src="/landing/images/Icon-Quote-Grey.svg"
										loading="lazy"
										alt="Icon Quote"
										height=""
									/>
									<p className="paragraph-large">
										Storytelling on Steroids! My team used to waste precious
										brainpower endlessly trying out and piecing together clips
										hoping for a coherent sequence of B-roll for our content
										team. Now, Authorly handles intelligently weaving
										imaginative 60-second shorts that hit the sweet spot between
										speed and originality. Then, we just edit, improve and
										export the best ones. It's like our creative bandwidth has
										tripled.
									</p>
								</div>
								<div className="name-wrapper">
									<h5>Annette Black</h5>
									<div className="job-position">Marketer</div>
								</div>
							</div>
						</div>
						<div className="column-testimonials-right">
							<div
								data-w-id="15e24b7e-0d27-fae5-7c9e-9bafdc0013bb"
								style={{ opacity: 0 }}
								className="testimonials-item-wide"
							>
								<div className="quote-content">
									<img
										src="/landing/images/Icon-Quote-Grey.svg"
										loading="lazy"
										alt="Icon Quote"
										height=""
									/>
									<p className="paragraph-large">
										I always dreamed of bringing my 3D animated character
										universe to screens but couldn't dedicate years to complex
										film projects. In just one month I directed a phenomenal 6
										episode pilot season faster than I imagined possible thanks
										to Authorly!
									</p>
								</div>
								<div className="name-wrapper">
									<h5>Cameron Williamson</h5>
									<div className="job-position">Storyteller</div>
								</div>
							</div>
							<div
								data-w-id="9870a521-897c-a4af-54ee-5ed90f7320ea"
								style={{ opacity: 0 }}
								className="testimonials-item-narrow"
							>
								<div className="quote-content">
									<img
										src="/landing/images/Icon-Quote-Grey.svg"
										loading="lazy"
										alt="Icon Quote"
										height=""
									/>
									<p className="paragraph-large">
										As a TikTok comedian, I live or die by continuously pumping
										out funny shorts. I used to wreck my mental health chasing
										video ideas that might go viral. Now I just describe a new
										meme idea to Authorly and instantly get 100 hilarious
										narrative iterations—I just pick the best and ride the views
										wave!
										<br />
									</p>
								</div>
								<div className="name-wrapper">
									<h5>Ralph Edwards</h5>
									<div className="job-position">TikTokker</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="section-start-with-us texture">
				<div className="start-with-us-wrapper">
					<div className="gradient-figure-start-with-us" />
					<div
						data-w-id="6151fead-962d-f6cf-e397-2af0d71fb48d"
						className="section-subtitle mb-20"
					>
						ask yourself this one simple question
					</div>
					<h1 className="hero-text white-footer-text">
						Does Your story need more than 4 seconds to tell?
					</h1>
					<div className="hero-section-button-holder">
						<div className="cta-wrapper">
							<div className="hero-cta-input-holder">
								<div className="ai-form w-form">
									<form
										id="email-form"
										name="email-form"
										data-name="Email Form"
										method="get"
										className="ai-form-content"
										data-wf-page-id="65b99dee9363b664a107e75c"
										data-wf-element-id="1514ebb8-a758-3e8a-c13f-c317c70d34d7"
									>
										<input
											className="build-form-input w-input"
											maxLength={256}
											name="Prompt-2"
											data-name="Prompt 2"
											placeholder="What is your story about?"
											type="text"
											id="Prompt-2"
											required=""
										/>
										<input
											type="submit"
											data-wait="Please wait..."
											className="button hero-submit-button w-button"
											defaultValue="Produce It"
										/>
									</form>
									<div className="success-message-2 w-form-done">
										<div>Thank you! Your submission has been received!</div>
									</div>
									<div className="error-message-hero w-form-fail">
										<div>👋 This is the form submission in Webflow!</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="footer-texture">
				<div className="w-layout-blockcontainer base-container w-container">
					<div className="footer-wrapper">
						<div className="footer-top-wrapper-links">
							<a
								href="index.html"
								data-w-id="060724b0-a823-15f3-0e98-4e53eb4aae79"
								aria-current="page"
								className="footer-brand w-nav-brand w--current"
							>
								<img
									src="/landing/images/Authorly-Logo.svg"
									loading="lazy"
									alt=""
									height={24}
									className="footer-logo"
								/>
							</a>
							<div
								data-w-id="060724b0-a823-15f3-0e98-4e53eb4aae7b"
								className="footer-links-block"
							>
								<a href="#" className="footer-top-link">
									Showcase
								</a>
								<a href="#" className="footer-top-link">
									Showcase
								</a>
								<a href="#" className="footer-top-link">
									Formats
								</a>
								<a href="#" className="footer-top-link">
									FAQ
								</a>
								<a href="#" className="footer-top-link">
									Pricing
								</a>
								<a href="#" className="footer-top-link">
									Blog
								</a>
								<a href="#" className="footer-top-link">
									Help
								</a>
								<a href="#" className="footer-top-link">
									Docs
								</a>
								<a href="#" className="footer-top-link">
									Careers
								</a>
							</div>
						</div>
						<div
							data-w-id="060724b0-a823-15f3-0e98-4e53eb4aae9f"
							className="footer-licensing-wrapper"
						>
							<div className="footer-copyright">
								© Authorly AI. All Rights Reserved 2023.{" "}
								<a href="templates/licensing.html" className="footer-copyright">
									Licensing
								</a>
							</div>
							<div className="footer-copyright">
								We're hiring.{" "}
								<a href="#" className="footer-copyright">
									See open roles
								</a>
							</div>
						</div>
					</div>
				</div>
				<div className="footer-2">
					<div className="container footer-container">
						<div className="footer-holder">
							<div className="infinite-ai-images-holder infinite-ai-images-footer">
								<div className="infinite-ai-images-container ai-images-footer-container">
									<div className="infinite-ai-images-grid ai-images-grid-footer">
										<div className="infinite-ai-image-wrapper">
											<img
												src="/landing/images/Ai-Image-01_1Ai-Image-01.webp"
												loading="lazy"
												sizes="(max-width: 479px) 30vw, (max-width: 767px) 24vw, (max-width: 991px) 23vw, 18vw"
												srcSet="/landing/images/Ai-Image-01_1-p-500.jpg 500w, /landing/images/Ai-Image-01_1Ai-Image-01.webp 500w"
												alt=""
												className="infnite-image withfilters"
											/>
											<img
												src="/landing/images/Ai-Image-02_1Ai-Image-02.webp"
												loading="lazy"
												alt=""
												className="infnite-image withfilters"
											/>
										</div>
										<div className="infinite-ai-image-wrapper _02">
											<img
												src="/landing/images/Ai-Image-03_1Ai-Image-03.webp"
												loading="lazy"
												alt=""
												className="infnite-image withfilters"
											/>
											<img
												src="/landing/images/Ai-Image-06_1Ai-Image-06.webp"
												loading="lazy"
												sizes="(max-width: 479px) 30vw, (max-width: 767px) 24vw, (max-width: 991px) 23vw, 18vw"
												srcSet="/landing/images/Ai-Image-06_1-p-500.jpg 500w, /landing/images/Ai-Image-06_1Ai-Image-06.webp 500w"
												alt=""
												className="infnite-image withfilters"
											/>
										</div>
										<div className="infinite-ai-image-wrapper _03">
											<img
												src="/landing/images/Ai-Image-04_1Ai-Image-04.webp"
												loading="lazy"
												alt=""
												className="infnite-image withfilters"
											/>
											<img
												src="/landing/images/Ai-Image-05_1Ai-Image-05.webp"
												loading="lazy"
												alt=""
												className="infnite-image withfilters"
											/>
										</div>
										<div className="infinite-ai-image-wrapper _02">
											<img
												src="/landing/images/Ai-Image-07_1Ai-Image-07.webp"
												loading="lazy"
												sizes="(max-width: 479px) 35vw, (max-width: 767px) 24vw, (max-width: 991px) 23vw, 18vw"
												srcSet="/landing/images/Ai-Image-07_1-p-500.jpg 500w, /landing/images/Ai-Image-07_1Ai-Image-07.webp 564w"
												alt=""
												className="infnite-image withfilters"
											/>
											<a
												href="#"
												target="_blank"
												className="footer-instagram-profile-link w-inline-block"
											>
												<div>View Instagram</div>
											</a>
										</div>
										<div className="infinite-ai-image-wrapper">
											<img
												src="/landing/images/Ai-Image-08_1Ai-Image-08.webp"
												loading="lazy"
												sizes="(max-width: 479px) 30vw, (max-width: 767px) 24vw, (max-width: 991px) 23vw, 18vw"
												srcSet="/landing/images/Ai-Image-08_1-p-500.jpg 500w, /landing/images/Ai-Image-08_1Ai-Image-08.webp 500w"
												alt=""
												className="infnite-image withfilters"
											/>
											<img
												src="/landing/images/Ai-Image-02_1Ai-Image-02.webp"
												loading="lazy"
												alt=""
												className="infnite-image withfilters"
											/>
										</div>
									</div>
									<div className="infinite-ai-images-grid ai-images-grid-footer">
										<div className="infinite-ai-image-wrapper">
											<img
												src="/landing/images/Ai-Image-01_1Ai-Image-01.webp"
												loading="lazy"
												sizes="(max-width: 479px) 30vw, (max-width: 767px) 24vw, (max-width: 991px) 23vw, 18vw"
												srcSet="/landing/images/Ai-Image-01_1-p-500.jpg 500w, /landing/images/Ai-Image-01_1Ai-Image-01.webp 500w"
												alt=""
												className="infnite-image withfilters"
											/>
											<img
												src="/landing/images/Ai-Image-02_1Ai-Image-02.webp"
												loading="lazy"
												alt=""
												className="infnite-image withfilters"
											/>
										</div>
										<div className="infinite-ai-image-wrapper _02">
											<img
												src="/landing/images/Ai-Image-03_1Ai-Image-03.webp"
												loading="lazy"
												alt=""
												className="infnite-image withfilters"
											/>
											<img
												src="/landing/images/Ai-Image-06_1Ai-Image-06.webp"
												loading="lazy"
												sizes="(max-width: 479px) 30vw, (max-width: 767px) 24vw, (max-width: 991px) 23vw, 18vw"
												srcSet="/landing/images/Ai-Image-06_1-p-500.jpg 500w, /landing/images/Ai-Image-06_1Ai-Image-06.webp 500w"
												alt=""
												className="infnite-image withfilters"
											/>
										</div>
										<div className="infinite-ai-image-wrapper _03">
											<img
												src="/landing/images/Ai-Image-04_1Ai-Image-04.webp"
												loading="lazy"
												alt=""
												className="infnite-image withfilters"
											/>
											<img
												src="/landing/images/Ai-Image-05_1Ai-Image-05.webp"
												loading="lazy"
												alt=""
												className="infnite-image withfilters"
											/>
										</div>
										<div className="infinite-ai-image-wrapper _02">
											<img
												src="/landing/images/Ai-Image-07_1Ai-Image-07.webp"
												loading="lazy"
												sizes="(max-width: 479px) 35vw, (max-width: 767px) 24vw, (max-width: 991px) 23vw, 18vw"
												srcSet="/landing/images/Ai-Image-07_1-p-500.jpg 500w, /landing/images/Ai-Image-07_1Ai-Image-07.webp 564w"
												alt=""
												className="infnite-image withfilters"
											/>
											<a
												href="https://instagram.com/wedoflow"
												target="_blank"
												className="footer-instagram-profile-link w-inline-block"
											>
												<div>View Instagram</div>
											</a>
										</div>
										<div className="infinite-ai-image-wrapper">
											<img
												src="/landing/images/Ai-Image-08_1Ai-Image-08.webp"
												loading="lazy"
												sizes="(max-width: 479px) 30vw, (max-width: 767px) 24vw, (max-width: 991px) 23vw, 18vw"
												srcSet="/landing/images/Ai-Image-08_1-p-500.jpg 500w, /landing/images/Ai-Image-08_1Ai-Image-08.webp 500w"
												alt=""
												className="infnite-image withfilters"
											/>
											<img
												src="/landing/images/Ai-Image-02_1Ai-Image-02.webp"
												loading="lazy"
												alt=""
												className="infnite-image withfilters"
											/>
										</div>
									</div>
								</div>
								<div className="left-gradient-black" />
								<div className="bottom-gradient-black" />
								<div className="right-garadient" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<script
				src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=65b99dee9363b664a107e756"
				type="text/javascript"
				integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
				crossOrigin="anonymous"
				async
			></script>
			<script
				src="/landing/js/webflow.js"
				type="text/javascript"
				async
			></script>
		</>
	);
}
