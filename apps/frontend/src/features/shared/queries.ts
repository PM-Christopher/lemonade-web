import { useQuery } from "@tanstack/react-query";
import { sharedApi } from "./api";

export const sharedKeys = {
    all: () => ["shared"] as const,
    banks: () => [...sharedKeys.all(), "banks"] as const,
};

// Reference data (the servicing-bank list) — CLAUDE.md's "reference data"
// staleness bucket (1h).
export function useBanksQuery(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: sharedKeys.banks(),
        queryFn: sharedApi.getBanks,
        staleTime: 60 * 60_000,
        enabled: options?.enabled,
    });
}
