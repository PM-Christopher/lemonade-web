import { useMutation } from "@tanstack/react-query";
import { exportsApi } from "./api";

/** Imperative, one-shot (generate + download) — not cacheable server state, so a mutation, not a query. */
export function useExportCsvMutation() {
    return useMutation({
        mutationFn: (table: string) => exportsApi.getCSV(table),
    });
}
