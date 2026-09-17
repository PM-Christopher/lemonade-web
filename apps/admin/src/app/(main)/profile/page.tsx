import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { profileKeys } from "@/features/profile/queries";
import { profileServerApi } from "@/features/profile/api.server";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: profileKeys.me(),
    queryFn: profileServerApi.getProfile,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileClient />
    </HydrationBoundary>
  );
}
