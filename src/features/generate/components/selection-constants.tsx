import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	languages,
	videoLengths,
	videoRatios,
} from "@/features/generate/constants";
import Image from "next/image";

export const LanguageSelect = ({
	selectedLanguage,
	setSelectedLanguage,
}: {
	selectedLanguage: string;
	setSelectedLanguage: (value: string) => void;
}) => (
	<Select
		defaultValue={selectedLanguage}
		onValueChange={(e) => setSelectedLanguage(e)}
	>
		<SelectTrigger className="w-full h-fit focus:ring-0 focus:ring-offset-0 px-2">
			<SelectValue placeholder="Language" />
		</SelectTrigger>
		<SelectContent>
			{languages.map((lang, index) => (
				<SelectItem key={index} value={lang.value}>
					<div className="flex gap-2">
						<Image
							width={16}
							height={16}
							alt={lang.value.toString()}
							src={lang.icon}
							className="rounded-full"
						/>
						{lang.value}
					</div>
				</SelectItem>
			))}
		</SelectContent>
	</Select>
);

export const VideoLengthSelect = ({
	selectedVideoLength,
	setSelectedVideoLength,
}: {
	selectedVideoLength: string;
	setSelectedVideoLength: (value: string) => void;
}) => (
	<Select
		defaultValue={selectedVideoLength}
		onValueChange={(e) => setSelectedVideoLength(e)}
	>
		<SelectTrigger className="w-full h-fit focus:ring-0 focus:ring-offset-0 px-2">
			<SelectValue placeholder="Video Length" />
		</SelectTrigger>
		<SelectContent>
			{videoLengths.map((length, index) => (
				<SelectItem key={index} value={length.value}>
					{length.value}
				</SelectItem>
			))}
		</SelectContent>
	</Select>
);

export const VideoRatioSelect = ({
	selectedVideoRatio,
	setSelectedVideoRatio,
}: {
	selectedVideoRatio: string;
	setSelectedVideoRatio: (value: string) => void;
}) => (
	<Select
		defaultValue={selectedVideoRatio}
		onValueChange={(e) => setSelectedVideoRatio(e)}
	>
		<SelectTrigger className="w-full h-fit focus:ring-0 focus:ring-offset-0 px-2">
			<SelectValue placeholder="Video Ratio" />
		</SelectTrigger>
		<SelectContent>
			{videoRatios.slice(0, 2).map((ratio, index) => (
				<SelectItem
					key={index}
					value={ratio.value.replace(" ", "_").toLowerCase()}
				>
					<div className="flex gap-2 items-center">
						{ratio.icon}
						{ratio.value}
					</div>
				</SelectItem>
			))}
		</SelectContent>
	</Select>
);
