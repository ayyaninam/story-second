import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateCategory = () => {
	const queryClient = useQueryClient(); // TODO: Implement once editor is not dependent on URL route
	return useMutation({
		mutationFn: async ({ category }: { category: string }) => {},
	});
};
