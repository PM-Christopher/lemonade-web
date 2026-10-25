import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pagesApi, type PageCategory } from "./api";
import { pageKeys } from "./queries";

export function useSavePolicyPageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ category, content }: { category: PageCategory; content: string }) =>
      pagesApi.savePage(category, content),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: pageKeys.all() }),
  });
}
