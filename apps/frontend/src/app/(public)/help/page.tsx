import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { HelpCenter } from "@/components/legal/HelpCenter";
import { PublicShell } from "@/components/legal/PublicShell";
import { helpKeys } from "@/features/help/queries";
import { helpServerApi } from "@/features/help/api.server";

export const metadata: Metadata = { title: "Help center" };

export default async function HelpPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({ queryKey: helpKeys.faqs(), queryFn: helpServerApi.getFaqs });

  return (
    <PublicShell>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HelpCenter />
      </HydrationBoundary>
    </PublicShell>
  );
}
