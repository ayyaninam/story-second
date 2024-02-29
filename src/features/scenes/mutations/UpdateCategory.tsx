import {
	DefinedUseQueryResult,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { EditStoryAction, EditStoryDraft } from "../reducers/edit-reducer";
import { mainSchema } from "@/api/schema";
import {
	GenerateSceneDiff,
	GenerateSceneDiffDto,
	GenerateStoryDiff,
	GenerateStoryDiffDto,
	WebstoryToStoryDraft,
} from "../utils/storydraft";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";

export const useUpdateCategory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ category }: { category: string }) => {
			console.log(category);
		},
	});
};
