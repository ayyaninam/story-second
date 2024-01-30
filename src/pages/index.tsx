import Image from "next/image";
import { Inter } from "next/font/google";
import api from "@/api";
import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm, SubmitHandler } from "react-hook-form";
import schema from "@/api/schema";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	// State

	// Queries

	// Mutations
	const CreateWebstory = useMutation({
		mutationFn: api.webstory.create,
	});

	// Handlers
	const onSubmit = async () => {
		CreateWebstory.mutateAsync({
			imageStyle: "None",
			language: "English",
			storyLength: "Short",
			prompt: "",
		});
	};

	// Hooks
	// const { register, handleSubmit, watch, formState } = useForm<
	// >{};

	return (
		<main
			className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
		>
			<div className="flex flex-col items-center justify-center">
				<input
					type="text"
					className="w-96 h-12 p-4 border-2 border-gray-300 rounded-md"
					placeholder="Prompt"
				/>

				<RadioGroup defaultValue="comfortable">
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="default" id="r1" />
						<Label htmlFor="r1">Default</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="comfortable" id="r2" />
						<Label htmlFor="r2">Comfortable</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="compact" id="r3" />
						<Label htmlFor="r3">Compact</Label>
					</div>
				</RadioGroup>
				<button className="w-96 h-12 bg-blue-500 text-white rounded-md">
					Submit
				</button>
			</div>
		</main>
	);
}
