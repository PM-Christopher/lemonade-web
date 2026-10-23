import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import MainLayout from "@/components/layouts/MainLayout";
import { authKeys } from "@/features/authentication/queries";
import { authServerApi } from "@/features/authentication/api.server";
import { getQueryClient } from "@/lib/query-client.server";
import { settingsKeys } from "@/features/settings/queries";
import { settingsServerApi } from "@/features/settings/api.server";

// One shell for every console page, so the sidebar and top bar stay mounted between pages.
export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  // Sidebar items depend on permissions, so load them before first paint.
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: authKeys.currentAdmin(),
      queryFn: authServerApi.getCurrentAdmin,
    }),
    // Logo, menu order and the idle timeout are needed on every page.
    queryClient.prefetchQuery({
      queryKey: settingsKeys.detail(),
      queryFn: settingsServerApi.getSettings,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainLayout>{children}</MainLayout>
    </HydrationBoundary>
  );
}
