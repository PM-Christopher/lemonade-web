import { useNavigation } from "@/hooks/useNavigation";
import { useSearchParams as useNextSearchParams } from "next/navigation";
import { useCallback } from "react";

// URL search params plus a stable setter for client components.
const useSearchParams = () => {
  const searchParams = useNextSearchParams();
  const { push } = useNavigation();

  // Reads the live URL at call time so the setter's identity never changes.
  const setSearchParams = useCallback(
    (paramsObject: Record<string, string | undefined>) => {
      const params = new URLSearchParams(window.location.search);
      const current = params.toString();
      Object.entries(paramsObject).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });

      const next = params.toString();
      // Skip a no-op push, which would refresh the page.
      if (next === current) return;
      // An empty query must be the bare path, or old params linger.
      const { pathname } = window.location;
      push(next ? `${pathname}?${next}` : pathname);
    },
    [push],
  );

  return { searchParams, setSearchParams };
};

export default useSearchParams;
