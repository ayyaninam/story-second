import SpinnerArc from "@/components/icons/scene-editor/spinner-arc";
import { cn } from "@/utils";
import { Sparkle } from "lucide-react";
import React from "react";

function ImageRegenerationLoader({
	arcSize,
	starSize,
	circleSize,
}: {
	arcSize: number;
	starSize: number;
	circleSize: number;
}) {
	return (
		<div
			className="border-[0.5px] border-purple-200 rounded=[1.5px] flex justify-center items-center w-full h-full"
			style={{
				background: "linear-gradient(180deg, #F1F6F9 0%, #FBF5FF 100%)",
			}}
		>
			<div
				className={cn(
					"rounded-full p-2.5 flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
					// expanded ? "w-12 h-12" : "w-6 h-6"
				)}
				style={{
					background:
						"linear-gradient(180deg, rgba(151, 71, 255, 0.20) 0%, rgba(151, 71, 255, 0.00) 100%)",
					width: `${circleSize}px`,
					height: `${circleSize}px`,
				}}
			>
				<div className="animate-spin absolute w-full h-full flex justify-center items-center">
					{/* <SpinnerArc width={expanded ? 43 : 21} height={expanded ? 43 : 21} /> */}
					<SpinnerArc width={arcSize} height={arcSize} />
				</div>
				<div className="absolute w-full h-full flex justify-center items-center">
					<Sparkle
						fill="#A734EA"
						stroke="#A734EA"
						width={starSize}
						height={starSize}
					/>
				</div>
			</div>
		</div>
	);
}

export default ImageRegenerationLoader;
