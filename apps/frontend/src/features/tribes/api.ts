// Endpoint layer for the tribes (community/threads) domain — see
// features/business/api.ts for the pattern this follows: the BFF proxy
// transport (browserApi), not the pre-BFF axiosInstance.
//
// NOT covered here: tribe.slice.ts's old verifyTribePayment thunk, which
// called `/tribes/payment/verify` via a raw axiosInstance.get — no matching
// route exists in the current backend contract (confirmed again via
// `route:list`). The two call sites that imported it (app/(main)/event/page.tsx
// and app/(main)/event/[id]/page.tsx) never actually invoked it — dead
// imports, removed as part of this migration. Left undocumented-but-broken
// here, matching the pre-existing, already-flagged decision not to guess a
// route. getComments is also dropped: zero real consumers (thread comments
// arrive embedded in ThreadResource.all_comments, confirmed via grep) —
// same "dead code, dropped rather than migrated" rule as business's
// getListing.
import { browserApi } from "@/lib/browser-api";
import {
  userTribesRoutes,
  userThreadsRoutes,
  sharedUtilitiesRoutes,
  buildPath,
} from "@lemonade/api-types/generated";
import { sharedApi } from "@/features/shared";
import type { TribeInterface, Thread, ThreadComment } from "@/interfaces/TribeInterface";

export interface TribesListResponse {
  tribes: TribeInterface[];
}

export interface TribeDetailResponse {
  tribe: TribeInterface;
  threads: Thread[];
}

// Monetized tribes route through Paystack (authorization_url/reference);
// free tribes join immediately (message/tribe) — one endpoint, two response
// shapes, mirroring ProcessTribeJoin's actual branch.
export interface JoinTribeResponse {
  message?: string;
  tribe?: TribeInterface;
  authorization_url?: string;
  reference?: string;
}

export interface CreateThreadPayload {
  topic: string;
  thoughts: string;
  media?: string[];
  videos?: string[];
  tags?: string[];
  polls?: boolean;
  thread_polls?: {
    title: string;
    options: string[];
    start_at: string;
    end_at: string;
  } | null;
}

export interface CreateThreadResponse {
  thread: Thread;
}

export interface LikeThreadResponse {
  thread: Thread;
}

export interface SubmitVotePayload {
  option_id: number;
}

export interface SubmitVoteResponse {
  message: string;
  thread: Thread;
}

export interface ThreadsResponse {
  threads: Thread[];
}

export interface ViewProfileResponse {
  user: unknown;
}

// ThreadController::pinThread puts the *thread object* under the data key
// 'message' (`data: ['message' => $response['thread']]`) and uses the
// pinned/unpinned wording as the envelope's top-level `message` instead —
// which browserApi's unwrap() discards, keeping only `data`. So the
// response the frontend actually sees carries the thread but no signal of
// which way the toggle went; mutations.ts's usePinThreadMutation works
// around this by having the caller pass in the thread's pinned state from
// before the call and flipping it, rather than trying to read it back here.
// Confirmed live via a real pin/unpin round-trip against the dev backend.
export interface PinThreadResponse {
  message: Thread;
}

export interface ReportThreadPayload {
  report: string;
}

export interface DeleteThreadResponse {
  thread_id: number;
}

export interface SearchTribeResponse {
  tribes: TribeInterface[];
}

export interface AddTribeMemberPayload {
  usernames: string[];
}

export interface AddTribeMemberResponse {
  members: unknown[];
  tribe: TribeInterface;
}

export interface PostCommentPayload {
  body: string;
}

export interface PostCommentResponse {
  comment: ThreadComment;
}

export interface CreateTribePayload {
  tribe_name: string;
  category: string;
  description: string;
  image: string;
  private: boolean;
  monetized: boolean;
  membership_fee?: number;
  members?: string[];
}

export interface CreateTribeResponse {
  tribe: TribeInterface;
}

export interface TribeCategoriesResponse {
  categories: { name: string }[];
}

export const tribesApi = {
  getTribes: (tribeType: string) =>
    browserApi.get<TribesListResponse>(`${userTribesRoutes.LIST}?type=${tribeType}`),

  getTribe: (id: string) =>
    browserApi.get<TribeDetailResponse>(buildPath(userTribesRoutes.SHOW, { id })),

  joinTribe: (id: string, data: { redirect_url?: string | null }) =>
    browserApi.post<JoinTribeResponse>(buildPath(userTribesRoutes.JOIN, { id }), data),

  createThread: (id: number | string, data: CreateThreadPayload) =>
    browserApi.post<CreateThreadResponse>(
      buildPath(userTribesRoutes.THREADS_CREATE, { forum: id }),
      data,
    ),

  likeThread: (tribeId: number | string, id: number | string) =>
    browserApi.post<LikeThreadResponse>(
      buildPath(userThreadsRoutes.POST_LIKE, { tribe_id: tribeId, id }),
      {},
    ),

  submitVote: (
    tribeId: number | string,
    threadId: number | string,
    pollId: number | string,
    data: SubmitVotePayload,
  ) =>
    browserApi.post<SubmitVoteResponse>(
      buildPath(userThreadsRoutes.POLL_ACTION, {
        tribe_id: tribeId,
        thread_id: threadId,
        poll_id: pollId,
      }),
      data,
    ),

  getThreads: (id: string) =>
    browserApi.get<ThreadsResponse>(buildPath(userTribesRoutes.THREADS_LIST, { forum: id })),

  filterThreads: (id: number | string, data: { filter: string }) =>
    browserApi.post<ThreadsResponse>(
      buildPath(userTribesRoutes.THREADS_SORT, { forum: id }),
      data,
    ),

  viewProfile: (id: number | string) =>
    browserApi.get<ViewProfileResponse>(buildPath(userThreadsRoutes.VIEW_PROFILE, { id })),

  pinThread: (id: number | string) =>
    browserApi.post<PinThreadResponse>(buildPath(userThreadsRoutes.PIN, { id }), {}),

  getPinThreads: (id: string) =>
    browserApi.get<ThreadsResponse>(buildPath(userThreadsRoutes.PINNED, { id })),

  reportThread: (id: number | string, data: ReportThreadPayload) =>
    browserApi.post<{ report: unknown }>(
      buildPath(userThreadsRoutes.REPORT, { id }),
      data,
    ),

  deleteThread: (id: number | string) =>
    browserApi.delete<DeleteThreadResponse>(
      buildPath(userThreadsRoutes.DELETE, { id }),
    ),

  searchTribe: (data: { search: string }) =>
    browserApi.post<SearchTribeResponse>(userTribesRoutes.SEARCH, data),

  addTribeMember: (id: string, data: AddTribeMemberPayload) =>
    browserApi.post<AddTribeMemberResponse>(buildPath(userTribesRoutes.ADD_MEMBER, { id }), data),

  postComment: (tribeId: number | string, threadId: number | string, data: PostCommentPayload) =>
    browserApi.post<PostCommentResponse>(
      buildPath(userThreadsRoutes.POST_COMMENT, { tribe_id: tribeId, id: threadId }),
      data,
    ),

  createTribe: (values: CreateTribePayload) =>
    browserApi.post<CreateTribeResponse>(userTribesRoutes.CREATE, values),

  getTribeCategories: () =>
    browserApi.get<TribeCategoriesResponse>(sharedUtilitiesRoutes.TRIBES_CATEGORIES),

  upload: (formData: FormData) => sharedApi.uploadFile(formData),
  uploadMultiple: (formData: FormData) => sharedApi.uploadMultipleFiles(formData),
};
