import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportingApi } from "./api";
import { reportingKeys } from "./queries";

export function useResolveReportMutation(id: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => reportingApi.resolveReport(id as number),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportingKeys.list() });
      if (id) queryClient.invalidateQueries({ queryKey: reportingKeys.detail(id) });
    },
  });
}

export function useDeleteReportContentMutation(id: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => reportingApi.deleteReportContent(id as number, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportingKeys.list() });
      if (id) queryClient.invalidateQueries({ queryKey: reportingKeys.detail(id) });
    },
  });
}
