import { Button } from "@/components/ui/button";
import GenLoader from "../loader/GenLoader";
import { useRouter } from "next/navigation";
function ProceedMobile({loadingText, finished}:{loadingText:string, finished:boolean}) {
	const router = useRouter();
	return (
		<div
			className="w-full bg-cover bg-center h-screen p-10"
			style={{
				// backgroundImage: "url(/pre-auth/background.svg)",
				backgroundColor: "#334155",
			}}
		>
			<div className="flex flex-col items-center justify-center space-y-2 w-[100%] h-[95%] bg-white text-slate-900 shadow-2xl">

			{finished ? (
					<>
						<div className="flex flex-col items-center justify-center space-y-2 bg-white w-[100%] h-[100%] text-slate-900 shadow-2xl">
						<Button
								className={`p-1 w-[100%] sm:w-[60%] shadow-sm bg-slate-700 text-xs text-white`}
								variant="outline"
								onClick={()=>{router.push("/")}}
							>
								Go Back
							</Button>
						</div>
					</>
				) : (
					<>
						<div className="flex flex-col items-center justify-center space-y-2 bg-white w-[100%] h-[100%] text-slate-900 shadow-2xl">
							<GenLoader />
							<div className="pb-2 text-lg font-semibold animate-pulse">{loadingText}</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
export default ProceedMobile;
