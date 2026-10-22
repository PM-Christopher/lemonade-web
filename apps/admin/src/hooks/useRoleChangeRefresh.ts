"use client";

import { useQueryClient } from "@tanstack/react-query";
import { teamKeys } from "@/features/team/queries";
import { authKeys } from "@/features/authentication/queries";

// A role change can alter who may do what, so the team list and the signed-in profile refresh too.
export function useRoleChangeRefresh() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: teamKeys.all() });
    queryClient.invalidateQueries({ queryKey: authKeys.currentAdmin() });
  };
}
