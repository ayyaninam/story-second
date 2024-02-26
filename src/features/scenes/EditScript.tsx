"use client";
import {
	Compass,
	CrossIcon,
	FlipVertical,
	Menu,
	Settings2,
} from "lucide-react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { GetImageRatio } from "@/utils/image-ratio";
import { mainSchema } from "@/api/schema";
import { env } from "@/env.mjs";
import useWebstoryContext from "../edit-story/providers/WebstoryContext";
import Stepper from "./components/Stepper";
import { StepperStep } from "@/utils/enums";
import Navbar from "./components/Navbar";
import VideoEditor from "./components/VideoEditor";
import VideoEditorStoryboard from "./components/VideoEditorStoryboard";

export default function EditScript() {
	const router = useRouter();
	const isDesktop = useMediaQuery("(min-width: 1280px)");

	const [enableQuery, setEnableQuery] = useState(true);
	const [story, setStory] = useWebstoryContext();

	// Queries
	const Webstory = useQuery<mainSchema["ReturnVideoStoryDTO"]>({
		queryFn: () =>
			api.video.get(
				router.query.genre!.toString(),
				router.query.id!.toString(),
				story.storyType
			),
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.STORY, router.asPath],
		initialData: story,
		refetchInterval: 1000,
		// Disable once all the videoKeys are obtained
		enabled: enableQuery,
	});

	useEffect(() => {
		if (Webstory.data) {
			setEnableQuery(
				!(
					Webstory.data.scenes
						?.flatMap((el) => el.videoSegments)
						.every((segment) => !!segment?.videoKey) &&
					Webstory.data.scenes?.flatMap((el) => el.videoSegments).length > 0
				)
			);
		}
		setStory(Webstory.data);
	}, [Webstory.data]);

	const isLoading = Webstory.isLoading || !Webstory.data;
	const ImageRatio = GetImageRatio(Webstory.data.resolution);

	return (
		<div className="w-full mr-2 rounded-lg overflow-y-scroll">
			{/* Navbar */}
			<Navbar
				ImageRatio={ImageRatio}
				WebstoryData={Webstory.data}
				genre={router.query.genre!.toString()}
			/>

			{/* Stepper */}
			<Stepper step={StepperStep.Scenes} />

			{/* MainSection */}
			<div
				className={`flex bg-background rounded-bl-lg rounded-br-lg p-2 gap-x-1.5 h-screen overflow-y-auto`}
			>
				{!env.NEXT_PUBLIC_DISABLE_UNIMPLEMENTED_FEATURES && (
					<div className="p-2 space-y-3 hidden sm:block">
						<Menu className="h-4 w-4 stroke-muted-foreground" />
						<FlipVertical className="h-4 w-4 stroke-muted-foreground" />

						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
						>
							<rect width="16" height="16" fill="white" fillOpacity="0.01" />
							<path
								d="M15.3412 10.7197L15.3412 10.7198C15.2534 11.3532 15.0881 11.7589 14.7915 12.1017L14.791 12.1023C14.7609 12.137 14.7162 12.1858 14.6818 12.2208M15.3412 10.7197L14.6813 12.2213C14.6815 12.2212 14.6817 12.221 14.6818 12.2208M15.3412 10.7197C15.4321 10.064 15.4333 9.22329 15.4333 8.02662C15.4333 6.81576 15.4321 5.96392 15.3412 5.30056C15.2534 4.65904 15.088 4.25072 14.7928 3.90909M15.3412 10.7197L14.6836 3.79018M14.6818 12.2208C14.3572 12.5525 13.9875 12.745 13.4293 12.8774L13.4293 12.8774C12.8439 13.0161 12.095 13.08 11.0152 13.17M14.6818 12.2208L11.0152 13.17M11.0152 13.17L10.9737 12.6717L11.0152 13.17C11.0152 13.17 11.0152 13.17 11.0152 13.17ZM11.0152 13.17C10.0775 13.2482 9.05676 13.3 8 13.3C6.94324 13.3 5.92247 13.2482 4.98484 13.17M11.0152 13.17L1.3164 3.7902C1.28287 3.82452 1.23877 3.87252 1.20744 3.90877L1.20743 3.90878C0.912218 4.25045 0.746672 4.65877 0.658761 5.30051M4.98484 13.17L5.02635 12.6717L4.9848 13.17C4.98482 13.17 4.98483 13.17 4.98484 13.17ZM4.98484 13.17C3.90507 13.08 3.1561 13.0161 2.5707 12.8774L2.57067 12.8774C2.01215 12.7449 1.64245 12.5523 1.31765 12.2203M1.31765 12.2203C1.31785 12.2205 1.31804 12.2207 1.31823 12.2209L1.67506 11.8706L1.31765 12.2203ZM1.31765 12.2203C1.28395 12.1859 1.23932 12.1373 1.20873 12.102L1.20849 12.1017C0.911867 11.7588 0.746589 11.3531 0.658794 10.7198L0.658793 10.7197C0.567904 10.064 0.566667 9.22329 0.566667 8.02662C0.566667 6.81579 0.567874 5.96391 0.658761 5.30051M0.658761 5.30051L1.15413 5.36838L0.658761 5.30051ZM14.6836 3.79018L14.6839 3.79047C14.7171 3.82449 14.7612 3.87249 14.7928 3.90909M14.6836 3.79018C14.3608 3.45978 13.9879 3.26595 13.4183 3.13156L14.6836 3.79018ZM14.7928 3.90909L14.4142 4.23565L14.7925 3.90871C14.7926 3.90884 14.7927 3.90897 14.7928 3.90909ZM1.15702 3.86516L1.15699 3.8652C0.850547 4.21986 0.681682 4.64195 0.592705 5.29147C0.501081 5.96031 0.5 6.81715 0.5 8.02662C0.5 9.22192 0.501105 10.0676 0.592761 10.7289C0.681649 11.3702 0.850321 11.7896 1.1581 12.1453L1.15823 12.1455C1.19007 12.1823 1.23577 12.232 1.26998 12.267C1.60579 12.6102 1.98793 12.8077 2.55529 12.9422C3.14653 13.0824 3.90087 13.1466 4.97925 13.2365C5.91842 13.3147 6.94108 13.3667 8 13.3667C9.0589 13.3667 10.0815 13.3147 11.0208 13.2365L1.15702 3.86516ZM1.15702 3.86516C1.18922 3.82788 1.23423 3.77891 1.2687 3.74363L1.26871 3.74362M1.15702 3.86516L1.26871 3.74362M1.26871 3.74362C1.60268 3.40178 1.9882 3.2031 2.56634 3.06667C3.16765 2.92478 3.93696 2.85839 5.0343 2.7655L4.99213 2.26728M1.26871 3.74362L4.99213 2.26728M4.99213 2.26728L5.03431 2.7655C5.97165 2.68615 6.97918 2.63336 8 2.63336C9.02082 2.63336 10.0283 2.68615 10.9657 2.7655C12.0631 2.85839 12.8324 2.92478 13.4337 3.06667C14.0118 3.2031 14.3973 3.40178 14.7313 3.74363L14.7314 3.7437M4.99213 2.26728L14.7314 3.7437M14.7314 3.7437C14.7656 3.77867 14.8105 3.8276 14.843 3.8652L14.7314 3.7437ZM14.8417 12.1456L14.8419 12.1453C15.1497 11.7896 15.3184 11.3702 15.4072 10.7289C15.4989 10.0676 15.5 9.22192 15.5 8.02662C15.5 6.81715 15.4989 5.96031 15.4073 5.29147C15.3183 4.64202 15.1495 4.21994 14.8431 3.8653L14.8417 12.1456ZM14.8417 12.1456C14.8099 12.1824 14.7643 12.232 14.7302 12.2667L14.73 12.267M14.8417 12.1456L14.73 12.267M14.73 12.267C14.3942 12.6102 14.0121 12.8077 13.4447 12.9422M14.73 12.267L13.4447 12.9422M5.03992 2.83193C5.9758 2.75271 6.98142 2.70003 8 2.70003C9.01858 2.70003 10.0242 2.75271 10.96 2.83193C12.0587 2.92493 12.8228 2.99102 13.4183 3.13156L5.03992 2.83193ZM5.03992 2.83193C3.94125 2.92494 3.17721 2.99102 2.58165 3.13156M5.03992 2.83193L2.58165 3.13156M2.58165 3.13156C2.01217 3.26594 1.63924 3.45977 1.31642 3.79018L2.58165 3.13156ZM13.4447 12.9422C12.8535 13.0824 12.0991 13.1466 11.0208 13.2365L13.4447 12.9422ZM6.1 9.90142V6.09864L10.4352 8.00003L6.1 9.90142Z"
								stroke="#64748B"
							/>
						</svg>

						<Compass className="h-4 w-4 stroke-muted-foreground" />
					</div>
				)}
				{/* <VideoEditor
					ImageRatio={ImageRatio}
					WebstoryData={Webstory.data}
					isError={Webstory.isError}
					isLoading={isLoading}
				/> */}
				<VideoEditorStoryboard
					ImageRatio={ImageRatio}
					WebstoryData={Webstory.data}
					isError={Webstory.isError}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
}
