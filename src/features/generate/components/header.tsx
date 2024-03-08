import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { CSSProperties } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { Plus } from "lucide-react";
import Routes from "@/routes";
import { useMediaQuery } from "usehooks-ts";
import GenerateIcon from "@/components/icons/side-nav/GenerateIcon";
import useEventLogger from "@/utils/analytics";

const mainHeaderContainer: {
	[key: string]: CSSProperties;
} = {
	light: {
		background:
			"radial-gradient(10.83% 5455.25% at 0% 50%, rgba(240, 214, 255, 0.5) 0%, rgba(240, 214, 255, 0) 100%),linear-gradient(0deg, #FFFFFF, #FFFFFF)",
		boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
	},
	// TODO: Dark variant
	dark: {
		background:
			"radial-gradient(10.83% 5455.25% at 0% 50%, rgba(40, 90, 85, 0.5) 0%, rgba(40, 90, 85, 0) 100%), linear-gradient(0deg, #2E2E2E, #2E2E2E)",
		boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
	},
};

const subHeaderContainer: CSSProperties = {
	borderTop: "0.5px solid var(--Colors-Slate-400, #94ABB8)",
	background: "var(--base-white, #FFF)",
};

export const GenerateHeader = ({}: {}) => {
	const { theme } = useTheme();
	const isMobile = useMediaQuery("(max-width: 768px)");
	const router = useRouter();
	const eventLogger = useEventLogger();

	return (
		<div
			style={{
				position: "sticky",
				top: "0",
			}}
			className="flex flex-col items-start pb-[1px] z-50 bg-background"
		>
			<div
				className="flex justify-between items-center px-[20px] py-[14px] w-full"
				style={theme ? mainHeaderContainer[theme] : mainHeaderContainer.light}
			>
				<div className="flex items-start w-[250px]">
					<div
						style={{
							width: 32,
							height: 32,
							position: "relative",
							boxShadow:
								"0px 2.999999761581421px 10.999999046325684px rgba(54.89, 55.76, 117.32, 0.12)",
						}}
					>
						<div
							style={{
								width: 32,
								height: 32,
								left: 0,
								top: 0,
								position: "absolute",
								background:
									"linear-gradient(0deg, #8F22CE 0%, #8F22CE 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)",
								boxShadow:
									"0px -0.800000011920929px 9.600000381469727px rgba(255, 255, 255, 0.12) inset",
								borderRadius: 8,
							}}
						/>
						<div
							style={{
								width: 28,
								height: 28,
								left: 2,
								top: 2,
								position: "absolute",
								background: "linear-gradient(192deg, #6060A6 0%, #F0D2FC 100%)",
								boxShadow:
									"0px 0.3720930516719818px 1.4883722066879272px rgba(0, 0, 0, 0.25) inset",
								borderRadius: 9999,
							}}
						/>
						<div
							style={{
								width: 28,
								height: 28,
								left: 2,
								top: 2,
								position: "absolute",
								background: "#3E095D",
								boxShadow:
									"0px 0.2499999850988388px 0.9999999403953552px rgba(0, 0, 0, 0.25) inset",
								borderRadius: 9999,
								border: "0.40px #7521A6 solid",
							}}
						/>
						<div
							style={{
								width: 19,
								height: 19,
								left: 6,
								top: 6,
								position: "absolute",
								boxShadow:
									"0px 1.600000023841858px 3.200000047683716px #5C0C8A",
							}}
						>
							<div
								style={{
									width: 19,
									height: 19,
									left: 0,
									top: 0,
									position: "absolute",
								}}
							/>
							<div
								style={{
									width: 21,
									height: 21,
									left: -1,
									top: -1,
									position: "absolute",
								}}
							/>
							<div
								style={{
									width: 24,
									height: 24,
									padding: 3,
									left: -2,
									top: -2,
									position: "absolute",
									justifyContent: "center",
									alignItems: "center",
									display: "inline-flex",
								}}
							>
								<GenerateIcon />
							</div>
						</div>
					</div>
					<div className="pl-[12px] flex flex-col items-start">
						<span className="text-slate-950 text-base font-bold">Generate</span>
						<span className="text-accent-700 text-sm font-normal">
							Create a New Experience
						</span>
					</div>
				</div>

				<div className="flex items-center gap-4">
					{!isMobile && (
						<Button
							className={`px-4 py-1.5 bg-accent-600 hover:bg-accent-700 border border-accent-700 text-background text-white text-sm font-medium flex gap-2 items-center h-fit`}
							variant="default"
							onClick={() => {
								eventLogger("create_new_clicked", {
									sourceUrl: router.asPath,
								});
								router.push(Routes.Generate());
							}}
						>
							<Plus className="h-4 w-4" /> Create New
						</Button>
					)}
				</div>
			</div>
			<div
				className="px-8 w-full flex justify-between items-center relative transition-all ease-in-out duration-300"
				style={subHeaderContainer}
			></div>
		</div>
	);
};
