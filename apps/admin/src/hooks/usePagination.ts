import { useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";

// Pages a list that is already loaded in full. Pass a key that changes with the filters to go back to page 1.
export function usePagination<T>(items: T[], resetKey = "") {
  const [page, setPage] = useState(1);
  const [seenKey, setSeenKey] = useState(resetKey);
  if (seenKey !== resetKey) {
    setSeenKey(resetKey);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(items.length / DEFAULT_PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * DEFAULT_PAGE_SIZE;

  return {
    page: current,
    setPage,
    totalPages,
    pageItems: items.slice(start, start + DEFAULT_PAGE_SIZE),
  };
}
