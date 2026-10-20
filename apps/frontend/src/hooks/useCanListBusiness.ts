import { useUserProfileQuery } from "@/features/settings/queries";

// False only when the plan explicitly excludes listing; the server still enforces it.
export function useCanListBusiness() {
  const { data, isLoading } = useUserProfileQuery();
  return { canList: data?.subscriptions?.benefits.business_listing !== false, isLoading };
}
