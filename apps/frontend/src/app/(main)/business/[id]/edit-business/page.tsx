// Server Component — prefetches this business record and the
// business-category catalog on the server. getBusiness reuses
// businessServerApi (same query key as business/[id]/page.tsx). The
// category catalog was migrated off the legacy useRequest hook onto
// useBusinessCategoriesQuery (features/shared) in the same pass — see
// docs/ARCHITECTURE.md Phase 6. See event/[id]/details/page.tsx for the
// general SSR-prefetch pattern.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { businessKeys } from "@/features/business/queries";
import { businessServerApi } from "@/features/business/api.server";
import { sharedKeys } from "@/features/shared/queries";
import { sharedServerApi } from "@/features/shared/api.server";
import EditBusinessClient from "./EditBusinessClient";

export default async function EditBusinessPage(props: {
  params: Promise<{ id: number }>;
}) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: businessKeys.detail(params.id),
      queryFn: () => businessServerApi.getBusiness(params.id),
    }),
    queryClient.prefetchQuery({
      queryKey: sharedKeys.businessCategories(),
      queryFn: sharedServerApi.getBusinessCategories,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditBusinessClient id={params.id} />
    </HydrationBoundary>
  );
}
