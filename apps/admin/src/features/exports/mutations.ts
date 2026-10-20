import { useMutation } from "@tanstack/react-query";
import { exportsApi, type ExportType } from "./api";

/** Imperative, one-shot (generate + download) — not cacheable server state, so a mutation, not a query. */
export function useExportCsvMutation() {
  return useMutation({
    mutationFn: (table: string) => exportsApi.getCSV(table),
  });
}

export function useExportFileMutation() {
  return useMutation({
    mutationFn: ({ table, type }: { table: string; type: ExportType }) =>
      exportsApi.getFile(table, type),
  });
}
