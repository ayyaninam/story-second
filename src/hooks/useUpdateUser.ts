import {useQueryClient} from "@tanstack/react-query";
import {QueryKeys} from "@/lib/queryKeys";

const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return {
    invalidateUser: () => queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] }),
  }
};

export default useUpdateUser;
