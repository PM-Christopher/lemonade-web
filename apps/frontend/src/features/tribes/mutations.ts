import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  tribesApi,
  type AddTribeMemberPayload,
  type CreateThreadPayload,
  type CreateTribePayload,
  type EditThreadPayload,
  type PostCommentPayload,
  type ReportThreadPayload,
  type SubmitVotePayload,
  type ThreadsResponse,
} from "./api";
import { tribeKeys } from "./queries";

// Flips a tribe between public and private (owner only); refetch rather than guess the result.
export function useChangeTribeTypeMutation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => tribesApi.changeTribeType(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tribeKeys.detail(slug) });
      queryClient.invalidateQueries({ queryKey: tribeKeys.lists() });
    },
  });
}

export function useJoinTribeMutation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { redirect_url?: string | null }) => tribesApi.joinTribe(slug, data),
    onSuccess: () => {
      // Never optimistic for a paid membership state change — refetch
      // the authoritative has_joined flag instead of guessing it.
      queryClient.invalidateQueries({ queryKey: tribeKeys.detail(slug) });
    },
  });
}

// CreateTribeThread/SortTribeThreads (backend) resolve the tribe by its raw
// id (Tribe::find()/findTribeByIdOrFail), not by slug — unlike
// GetTribe/ListTribeThreads/GetPinnedTribeThreads, which are slug-based.
// That split is a real backend inconsistency (confirmed via
// route:list + reading every Tribe action's lookup call), not something to
// paper over: these hooks take the tribe's SLUG so their cache writes land
// in the same tribeKeys.threads()/pinnedThreads() entry the slug-keyed
// queries read, and take the tribe's raw id separately, at call time, for
// the endpoints that actually require it.
// Lets the page show an "uploading" bar while the post is in flight.
export const createThreadMutationKey = (tribeSlug: string) =>
  ["tribes", "create-thread", tribeSlug] as const;

export function useCreateThreadMutation(tribeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: createThreadMutationKey(tribeSlug),
    mutationFn: ({ tribeId, data }: { tribeId: string | number; data: CreateThreadPayload }) =>
      tribesApi.createThread(tribeId, data),
    // Refetch so the new thread shows in the server's order, with the tribe's counts.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tribeKeys.threads(tribeSlug) });
      queryClient.invalidateQueries({ queryKey: tribeKeys.detail(tribeSlug) });
    },
  });
}

// Local optimistic like-count updates live in ThreadCard itself (a
// non-money UI counter) — this mutation intentionally does no cache write
// on success, matching the original reducer, which never synced the
// server's thread back into state either.
export function useLikeThreadMutation() {
  return useMutation({
    mutationFn: ({ tribeId, threadId }: { tribeId: string | number; threadId: string }) =>
      tribesApi.likeThread(tribeId, threadId),
  });
}

export function useSubmitVoteMutation(tribeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tribeId,
      threadId,
      pollId,
      data,
    }: {
      tribeId: string | number;
      threadId: string;
      pollId: number;
      data: SubmitVotePayload;
    }) => tribesApi.submitVote(tribeId, threadId, pollId, data),
    onSuccess: (result) => {
      queryClient.setQueryData<ThreadsResponse>(tribeKeys.threads(tribeSlug), (old) => {
        if (!old) return old;
        return { threads: old.threads.map((t) => (t.id === result.thread.id ? result.thread : t)) };
      });
    },
  });
}

export function useFilterThreadsMutation(tribeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tribeId, filter }: { tribeId: string | number; filter: string }) =>
      tribesApi.filterThreads(tribeId, { filter }),
    onSuccess: (result) => {
      queryClient.setQueryData<ThreadsResponse>(tribeKeys.threads(tribeSlug), result);
    },
  });
}

// A per-click lookup triggered from "view profile" — not cacheable
// list/detail state, same pattern as business's useGetJobMutation. The
// caller reads `.data` directly instead of a Redux `user` field.
export function useViewProfileMutation() {
  return useMutation({
    mutationFn: (id: string) => tribesApi.viewProfile(id),
  });
}

// pin-thread/delete-thread only take a threadId in the URL — tribeSlug here
// is purely a cache-key concern (must match the slug useThreadsQuery /
// usePinnedThreadsQuery were called with).
//
// The endpoint is a toggle and its response carries no pinned/unpinned
// signal the frontend can read (see api.ts's PinThreadResponse comment) —
// the caller passes in whether the thread was pinned *before* this call, so
// the new state can be inferred by flipping it.
export function usePinThreadMutation(tribeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ threadId }: { threadId: string; wasPinned: boolean }) =>
      tribesApi.pinThread(threadId),
    onSuccess: (result, variables) => {
      const thread = result.message;
      const isPinned = !variables.wasPinned;

      queryClient.setQueryData<ThreadsResponse>(tribeKeys.threads(tribeSlug), (old) => {
        if (!old) return old;
        return {
          threads: old.threads.map((t) => (t.id === thread.id ? { ...t, pinned: isPinned } : t)),
        };
      });

      // Pinned threads now share the same full Thread shape as the
      // main list (the old reducer stubbed a separate {id, topic,
      // image} shape here that only matched getPinThreads' real
      // response by coincidence).
      queryClient.setQueryData<ThreadsResponse>(tribeKeys.pinnedThreads(tribeSlug), (old) => {
        const list = old?.threads ?? [];
        if (isPinned) {
          if (list.some((t) => t.id === thread.id)) return old;
          return { threads: [...list, thread] };
        }
        return { threads: list.filter((t) => t.id !== thread.id) };
      });
    },
  });
}

export function useReportThreadMutation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReportThreadPayload }) =>
      tribesApi.reportThread(id, data),
  });
}

// Owner removes a member; refetch the tribe so the list and counts match the server.
export function useRemoveTribeMemberMutation(tribeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => tribesApi.removeTribeMember(tribeSlug, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tribeKeys.detail(tribeSlug) });
    },
  });
}

export function useDeleteThreadMutation(tribeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tribesApi.deleteThread(id),
    onSuccess: (result) => {
      queryClient.setQueryData<ThreadsResponse>(tribeKeys.threads(tribeSlug), (old) =>
        old ? { threads: old.threads.filter((t) => t.id !== result.thread_id) } : old,
      );
      queryClient.setQueryData<ThreadsResponse>(tribeKeys.pinnedThreads(tribeSlug), (old) =>
        old ? { threads: old.threads.filter((t) => t.id !== result.thread_id) } : old,
      );
    },
  });
}

// Rewrites one thread in both cached lists (all threads and pinned).
function patchThread(
  queryClient: ReturnType<typeof useQueryClient>,
  tribeSlug: string,
  threadId: string,
  change: (thread: ThreadsResponse["threads"][number]) => ThreadsResponse["threads"][number],
) {
  for (const key of [tribeKeys.threads(tribeSlug), tribeKeys.pinnedThreads(tribeSlug)]) {
    queryClient.setQueryData<ThreadsResponse>(key, (old) =>
      old
        ? {
            threads: old.threads.map((thread) =>
              thread.id === threadId ? change(thread) : thread,
            ),
          }
        : old,
    );
  }
}

// The author changes a thread's title or content.
export function useEditThreadMutation(tribeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditThreadPayload }) =>
      tribesApi.editThread(id, data),
    onSuccess: (result) =>
      patchThread(queryClient, tribeSlug, result.thread_id, (thread) => ({
        ...thread,
        topic: result.topic,
        thoughts: result.thoughts,
        edited_at: result.edited_at,
      })),
  });
}

// A commenter changes their own comment.
export function useEditCommentMutation(tribeSlug: string, threadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: string }) => tribesApi.editComment(id, body),
    onSuccess: (result) =>
      patchThread(queryClient, tribeSlug, threadId, (thread) => ({
        ...thread,
        all_comments: (thread.all_comments ?? []).map((comment) =>
          comment.id === result.comment_id
            ? { ...comment, body: result.body, edited_at: result.edited_at }
            : comment,
        ),
      })),
  });
}

// A commenter deletes their own comment; its replies go with it.
export function useDeleteCommentMutation(tribeSlug: string, threadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tribesApi.deleteComment(id),
    onSuccess: (result) =>
      patchThread(queryClient, tribeSlug, threadId, (thread) => ({
        ...thread,
        comments: Math.max((thread.comments ?? 1) - 1, 0),
        all_comments: (thread.all_comments ?? []).filter(
          (comment) => comment.id !== result.comment_id,
        ),
      })),
  });
}

// Free tribes go at once; paid ones become a request, so refetch the tribe and lists either way.
export function useDeleteTribeMutation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      tribesApi.deleteTribe(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tribeKeys.detail(slug) });
      queryClient.invalidateQueries({ queryKey: tribeKeys.lists() });
    },
  });
}

// Search-as-you-type — the caller reads `.data` directly rather than a
// separate searchResults cache entry, same reasoning as viewProfile above.
export function useSearchTribeMutation() {
  return useMutation({
    mutationFn: (search: string) => tribesApi.searchTribe({ search }),
  });
}

export function useAddTribeMemberMutation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddTribeMemberPayload) => tribesApi.addTribeMember(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tribeKeys.detail(slug) });
    },
  });
}

export function usePostCommentMutation(tribeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tribeId,
      threadId,
      data,
    }: {
      tribeId: string | number;
      threadId: string;
      data: PostCommentPayload;
    }) => tribesApi.postComment(tribeId, threadId, data),
    onSuccess: (result) => {
      queryClient.setQueryData<ThreadsResponse>(tribeKeys.threads(tribeSlug), (old) => {
        if (!old) return old;
        return {
          threads: old.threads.map((t) =>
            t.id === result.comment.thread_id
              ? { ...t, all_comments: [result.comment, ...(t.all_comments ?? [])] }
              : t,
          ),
        };
      });
    },
  });
}

export function useCreateTribeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateTribePayload) => tribesApi.createTribe(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tribeKeys.lists() });
    },
  });
}
