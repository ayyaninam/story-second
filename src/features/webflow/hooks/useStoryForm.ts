import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import storyLanguages from "@/utils/storyLanguages";

export const storyFormSchema = z.object({
	prompt: z.string().min(20).max(100),
	storyLength: z.enum(["Short", "Medium", "Long"]),
	language: z.enum(storyLanguages),
});

export type StoryFormSchema = z.infer<typeof storyFormSchema>;

export const useStoryForm = () => {
	return useForm({
		resolver: zodResolver(storyFormSchema),
		reValidateMode: "onChange",
		defaultValues: {
			storyLength: "Short",
			prompt: "",
			language: "English",
		},
	});
};
