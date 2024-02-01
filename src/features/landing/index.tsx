import api from "@/api";
import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { StoryFormSchema, useStoryForm } from "./hooks/useStoryForm";
import { useRouter } from "next/router";
import storyLanguages from "@/utils/storyLanguages";

export default function Landing() {
	// State
	// Queries
	// Mutations
	const CreateWebstory = useMutation({
		mutationFn: api.webstory.createUnauthorized,
	});

	// Hooks
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useStoryForm();

	const router = useRouter();

	// Handlers
	const onSubmit = handleSubmit(async (data) => {
		const WebStory = await CreateWebstory.mutateAsync({
			imageStyle: "None",
			language: "English",
			storyLength: data.storyLength,
			prompt: data.prompt,
		});
		router.push(`/library/${WebStory.data?.url}`);
	});

	useEffect(() => {
		console.log(errors);
	}, [errors]);
	return (
		<div className="flex flex-col items-center justify-center">
			<form onSubmit={onSubmit}>
				<input
					type="text"
					className="w-96 h-12 p-4 border-2 border-gray-300 rounded-md"
					placeholder="Prompt"
					{...register("prompt")}
				/>

				<RadioGroup
					defaultValue="Short"
					onValueChange={(value) => setValue("storyLength", value)}
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="Short" id="r1" />
						<Label htmlFor="r1">Short</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="Medium" id="r2" />
						<Label htmlFor="r2">Medium</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="Long" id="r3" />
						<Label htmlFor="r3">Long</Label>
					</div>
				</RadioGroup>

				<DropdownMenu>
					<DropdownMenuTrigger>Open</DropdownMenuTrigger>

					<DropdownMenuContent>
						{storyLanguages.map((language) => (
							<DropdownMenuItem key={language}>{language}</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
				<button
					className="w-96 h-12 bg-blue-500 text-white rounded-md"
					type="submit"
				>
					Submit
				</button>
				{errors && (
					<p>
						{errors.prompt?.message} {errors.storyLength?.message}
					</p>
				)}
			</form>
		</div>
	);
}
