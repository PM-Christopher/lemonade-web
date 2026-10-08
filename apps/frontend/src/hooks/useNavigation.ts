"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type NavigateOptions = Parameters<ReturnType<typeof useRouter>["push"]>[1];

export type NavigationState = {
  from?: string;
  [key: string]: unknown;
};

export type UseNavigationReturn = {
  push: (to: string, options?: NavigateOptions) => void;
  replace: (to: string, options?: NavigateOptions) => void;
  back: () => void;
  forward: () => void;
  pushWithQuery: (to: string, query: Record<string, string>, options?: NavigateOptions) => void;
  pathname: string;
  search: string;
  isActive: (path: string, exact?: boolean) => boolean;
  getQueryParam: (key: string) => string | null;
};

/** App Router helper — prefer `push(routes.X)` over string literals. */
export function useNavigation(): UseNavigationReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const push = useCallback(
    (to: string, options?: NavigateOptions) => {
      router.push(to, options);
    },
    [router],
  );

  const replace = useCallback(
    (to: string, options?: NavigateOptions) => {
      router.replace(to, options);
    },
    [router],
  );

  const back = useCallback(() => {
    router.back();
  }, [router]);

  const forward = useCallback(() => {
    router.forward();
  }, [router]);

  const pushWithQuery = useCallback(
    (to: string, query: Record<string, string>, options?: NavigateOptions) => {
      const params = new URLSearchParams(query);
      router.push(`${to}?${params.toString()}`, options);
    },
    [router],
  );

  const isActive = useCallback(
    (path: string, exact = false): boolean => {
      if (exact) return pathname === path;
      return pathname === path || pathname.startsWith(`${path}/`);
    },
    [pathname],
  );

  const getQueryParam = useCallback(
    (key: string): string | null => searchParams.get(key),
    [searchParams],
  );

  return {
    push,
    replace,
    back,
    forward,
    pushWithQuery,
    pathname,
    search: searchParams.toString() ? `?${searchParams.toString()}` : "",
    isActive,
    getQueryParam,
  };
}
