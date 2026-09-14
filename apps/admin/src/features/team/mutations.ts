import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teamApi, type CreateTeamMemberPayload } from "./api";
import { teamKeys } from "./queries";

export function useAddTeamMemberMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateTeamMemberPayload) => teamApi.addTeamMember(payload),
        onSuccess: () => {
            // The old thunk-based modal never refreshed the list after adding —
            // a new member wouldn't show up without a manual reload. Fixed here
            // as a side effect of mutations owning their own invalidation.
            queryClient.invalidateQueries({ queryKey: teamKeys.list() });
        },
    });
}
