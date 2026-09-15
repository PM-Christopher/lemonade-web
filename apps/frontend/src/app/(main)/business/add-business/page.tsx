// Server Component — prefetches the business-category catalog on the
// server. This page was still on the legacy useRequest hook until this
// pass, migrated to a real TanStack Query (useBusinessCategoriesQuery,
// features/shared) specifically so it could become a Server Component
// candidate too — see docs/ARCHITECTURE.md Phase 6 and
// event/[id]/details/page.tsx for the general pattern. No dynamic params.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { sharedKeys } from "@/features/shared/queries";
import { sharedServerApi } from "@/features/shared/api.server";
import AddBusinessClient from "./AddBusinessClient";

export default async function AddBusinessPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: sharedKeys.businessCategories(),
    queryFn: sharedServerApi.getBusinessCategories,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AddBusinessClient />
    </HydrationBoundary>
  );
}
