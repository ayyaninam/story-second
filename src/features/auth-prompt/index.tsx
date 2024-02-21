import { Button } from "@/components/ui/button";
import { AuthPromptProps } from "@/types";
import { useRouter } from "next/router";

export default function AuthPrompt({ onLogIn, onSignUp }: AuthPromptProps) {
	return (
		<div
			className="flex w-full bg-cover bg-center h-screen"
			style={{
				backgroundImage: "url(/auth-prompt/background.svg)",
				backgroundColor: "#334155",
			}}
		>
			{/* Div 1 */}
			<div className="w-full flex flex-col justify-between p-8 lg:max-w-[68%] md:max-w-[50%]">
				<svg
					width="151"
					height="39"
					viewBox="0 0 151 39"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g clipPath="url(#clip0_1583_8146)">
						<mask
							id="mask0_1583_8146"
							style={{ maskType: "luminance" }}
							maskUnits="userSpaceOnUse"
							x="0"
							y="0"
							width="151"
							height="32"
						>
							<path
								d="M0.740234 8C0.740234 3.58172 4.32196 0 8.74023 0H142.66C147.079 0 150.66 3.58172 150.66 8V24C150.66 28.4183 147.079 32 142.66 32H8.74024C4.32196 32 0.740234 28.4183 0.740234 24V8Z"
								fill="white"
							/>
						</mask>
						<g mask="url(#mask0_1583_8146)">
							<mask
								id="mask1_1583_8146"
								style={{ maskType: "luminance" }}
								maskUnits="userSpaceOnUse"
								x="0"
								y="0"
								width="151"
								height="32"
							>
								<path
									d="M0.740234 8C0.740234 3.58172 4.32196 0 8.74023 0H142.66C147.079 0 150.66 3.58172 150.66 8V24C150.66 28.4183 147.079 32 142.66 32H8.74024C4.32196 32 0.740234 28.4183 0.740234 24V8Z"
									fill="white"
								/>
							</mask>
							<g mask="url(#mask1_1583_8146)">
								<mask
									id="mask2_1583_8146"
									style={{ maskType: "luminance" }}
									maskUnits="userSpaceOnUse"
									x="0"
									y="4"
									width="151"
									height="28"
								>
									<path
										d="M0.740234 12.0015C0.740234 7.58318 4.32196 4.00146 8.74023 4.00146H142.66C147.079 4.00146 150.66 7.58319 150.66 12.0015V23.9986C150.66 28.4169 147.079 31.9986 142.66 31.9986H8.74024C4.32196 31.9986 0.740234 28.4168 0.740234 23.9986V12.0015Z"
										fill="white"
									/>
								</mask>
								<g mask="url(#mask2_1583_8146)">
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
					</g>
					<defs>
						<clipPath id="clip0_1583_8146">
							<rect width="151" height="32" fill="white" />
						</clipPath>
					</defs>
				</svg>

				{/* This can be replaced with some dynamic data as well */}
				<div className="w-full space-y-3 max-w-[80%] text-background">
					<div className="w-full text-base">
						“This library has saved me countless hours of work and helped me
						deliver stunning designs to my clients faster than ever before.”
					</div>
					<div className="w-full text-sm">Sofia Davis</div>
				</div>
			</div>
			{/* Div 2 */}
			<div className="w-full lg:max-w-[32%] md:max-w-[50%] p-12 bg-purple-600">
				<div className="flex flex-col items-center justify-center space-y-2 bg-white w-[100%] h-[100%] text-slate-900 shadow-2xl">
					<div className="pb-2 text-lg font-semibold">Get Started</div>
					<Button
						className={`p-1 w-[60%] shadow-sm bg-purple-600 text-xs text-white`}
						variant="outline"
						onClick={onSignUp}
					>
						Sign Up
					</Button>
					<Button
						className={`p-1 w-[60%] shadow-sm bg-slate-700 text-xs text-white`}
						variant="outline"
						onClick={onLogIn}
					>
						Log In
					</Button>
					<div className="text-xs text-muted-foreground">
						<a href="#">
							<u>Terms of Service</u>
						</a>{" "}
						and{" "}
						<a href="#">
							<u>Privacy Policy</u>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
