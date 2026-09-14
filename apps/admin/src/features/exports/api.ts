// Endpoint layer for the exports domain. Not routed through browserApi like
// every other domain — the backend's export endpoint streams a raw CSV
// body, not the standard {success,message,data} envelope browserApi
// unwraps — see app/api/exports/csv/route.ts for why this goes through its
// own dedicated proxy instead.
export const exportsApi = {
  getCSV: async (table: string): Promise<string> => {
    const response = await fetch(`/api/exports/csv?table=${encodeURIComponent(table)}`);
    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok || contentType.includes("application/json")) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body?.message || "Failed to export CSV");
    }

    return response.text();
  },
};
