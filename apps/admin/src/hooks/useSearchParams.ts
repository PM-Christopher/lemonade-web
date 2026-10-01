import { useSearchParams as useNextSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

// For use in only normal client components
const useSearchParams = () => {
  const searchParams = useNextSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Function to create a new query string with multiple search parameters
  const createQueryString = useCallback(
    (paramsObject: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Loop through the object and set each search param
      Object.keys(paramsObject).forEach((key) => {
        const value = paramsObject[key];
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key); // Remove param if value is undefined or empty
        }
      });

      return params.toString();
    },
    [searchParams],
  );

  // Function to update the search parameters with an object of key-value pairs
  const setSearchParams = useCallback(
    (paramsObject: Record<string, string | undefined>) => {
      const newQueryString = createQueryString(paramsObject);
      // Already there — a push of the current path refreshes the page, and
      // the search effects call this on mount with an empty value.
      if (newQueryString === searchParams.toString()) return;
      // An empty query must be the bare path. Pushing "/transactions?" leaves
      // the previous search params in place, so a tab switch never leaves page=2.
      router.push(newQueryString ? `${pathname}?${newQueryString}` : pathname);
    },
    [createQueryString, router, pathname, searchParams],
  );

  return { searchParams, setSearchParams };
};

export default useSearchParams;
