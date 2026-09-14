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
import { userTribeRoutes, sharedUtilityRoutes } from "@lemonade/api-types";
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
    getTribes: (tribeType: string) => browserApi.get<TribesListResponse>(`${userTribeRoutes.BASE}?type=${tribeType}`),

    getTribe: (id: string) => browserApi.get<TribeDetailResponse>(`${userTribeRoutes.BASE}/${id}`),

    joinTribe: (id: string, data: { redirect_url?: string | null }) =>
        browserApi.post<JoinTribeResponse>(`${userTribeRoutes.BASE}/join-tribe/${id}`, data),

    createThread: (id: number | string, data: CreateThreadPayload) =>
        browserApi.post<CreateThreadResponse>(`${userTribeRoutes.BASE}/${id}/threads/create-thread`, data),

    likeThread: (tribeId: number | string, id: number | string) =>
        browserApi.post<LikeThreadResponse>(`${userTribeRoutes.THREADS_PINNED}/${tribeId}/${id}/post-like`, {}),

    submitVote: (tribeId: number | string, threadId: number | string, pollId: number | string, data: SubmitVotePayload) =>
        browserApi.post<SubmitVoteResponse>(`${userTribeRoutes.THREADS_PINNED}/${tribeId}/${threadId}/${pollId}/poll-action`, data),

    getThreads: (id: string) => browserApi.get<ThreadsResponse>(`${userTribeRoutes.BASE}/${id}/threads/all`),

    filterThreads: (id: number | string, data: { filter: string }) =>
        browserApi.post<ThreadsResponse>(`${userTribeRoutes.BASE}/${id}/threads/sort-thread`, data),

    viewProfile: (id: number | string) => browserApi.get<ViewProfileResponse>(`${userTribeRoutes.THREADS_VIEW_PROFILE}/${id}`),

    pinThread: (id: number | string) => browserApi.post<PinThreadResponse>(`${userTribeRoutes.THREADS_PINNED}/${id}/pin-thread`, {}),

    getPinThreads: (id: string) => browserApi.get<ThreadsResponse>(`${userTribeRoutes.THREADS_PINNED}/${id}/pinned`),

    reportThread: (id: number | string, data: ReportThreadPayload) =>
        browserApi.post<{ report: unknown }>(`${userTribeRoutes.THREADS_PINNED}/${id}/report-thread`, data),

    deleteThread: (id: number | string) =>
        browserApi.delete<DeleteThreadResponse>(`${userTribeRoutes.THREADS_PINNED}/${id}/delete-thread`),

    searchTribe: (data: { search: string }) => browserApi.post<SearchTribeResponse>(userTribeRoutes.SEARCH, data),

    addTribeMember: (id: string, data: AddTribeMemberPayload) =>
        browserApi.post<AddTribeMemberResponse>(`${userTribeRoutes.BASE}/add-member/${id}`, data),

    postComment: (tribeId: number | string, threadId: number | string, data: PostCommentPayload) =>
        browserApi.post<PostCommentResponse>(`${userTribeRoutes.THREADS_PINNED}/${tribeId}/${threadId}/post-comment`, data),

    createTribe: (values: CreateTribePayload) => browserApi.post<CreateTribeResponse>(userTribeRoutes.CREATE, values),

    getTribeCategories: () => browserApi.get<TribeCategoriesResponse>(sharedUtilityRoutes.TRIBES_CATEGORIES),

    upload: (formData: FormData) => sharedApi.uploadFile(formData),
    uploadMultiple: (formData: FormData) => sharedApi.uploadMultipleFiles(formData),
};
