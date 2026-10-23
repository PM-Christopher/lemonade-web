import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { settingsKeys } from "@/features/settings/queries";
import { settingsServerApi } from "@/features/settings/api.server";
import LoginClient from "./LoginClient";

export const metadata: Metadata = { title: "Log in" };

export default async function Page() {
  const queryClient = getQueryClient();

  // The logo is public, so the login page can show it on first paint.
  await queryClient.prefetchQuery({
    queryKey: settingsKeys.branding(),
    queryFn: settingsServerApi.getBranding,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LoginClient />
    </HydrationBoundary>
  );
}
