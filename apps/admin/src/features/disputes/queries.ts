import { useQuery } from "@tanstack/react-query";
import { disputesApi } from "./api";

export const disputeKeys = {
  all: () => ["dispute"] as const,
  lists: () => [...disputeKeys.all(), "list"] as const,
  list: (status: string) => [...disputeKeys.lists(), status] as const,
  details: () => [...disputeKeys.all(), "detail"] as const,
  detail: (id: string) => [...disputeKeys.details(), id] as const,
};

// Operational queue, 30s. "pending" maps to an omitted `?status=`, which the backend defaults to open.
export function useDisputeListQuery(status: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: disputeKeys.list(status),
    queryFn: () => disputesApi.getDisputes(status === "pending" ? undefined : status),
    staleTime: 30_000,
    enabled: options?.enabled,
  });
}

export function useDisputeDetailQuery(id: string | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: disputeKeys.detail(id ?? ""),
    queryFn: () => disputesApi.getDispute(id as string),
    staleTime: 30_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}
