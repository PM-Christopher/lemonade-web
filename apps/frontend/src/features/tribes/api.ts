// Endpoint layer for the tribes domain — see features/events/api.ts for the
// pattern this follows. Still on the pre-BFF axiosInstance transport
// deliberately (Phase 5 concern, not this refactor).
//
// NOT covered here: tribe.slice.ts's verifyTribePayment thunk, which calls
// `/tribes/payment/verify` — no matching route exists in the current
// 290-route backend contract (closest are POST /v1/shared/payment/verify
// and POST /v1/user/transaction/verify-transaction, neither confirmed as
// the real replacement). Left as a raw axiosInstance call rather than
// guessed into a constant that might be wrong — already flagged earlier
// this session, unresolved.
import { axiosInstance } from "@/lib/axiosInstane";
import { userTribeRoutes } from "@lemonade/api-types";
import { sharedApi } from "@/features/shared/api";

// The per-call `{ cache: { ttl } }` option these used to pass only did
// anything while axiosInstance was wrapped in axios-cache-interceptor —
// removed along with that wrapper (see lib/axiosInstane.ts).
export const tribesApi = {
    getTribes: (tribeType: string) => axiosInstance.get(`${userTribeRoutes.BASE}?type=${tribeType}`),

    getTribe: (id: string) => axiosInstance.get(`${userTribeRoutes.BASE}/${id}`),

    joinTribe: (id: unknown, data: unknown) => axiosInstance.post(`${userTribeRoutes.BASE}/join-tribe/${id}`, data),

    createThread: (id: number, data: unknown) => axiosInstance.post(`${userTribeRoutes.BASE}/${id}/threads/create-thread`, data),

    likeThread: (tribeId: number, id: number) => axiosInstance.post(`${userTribeRoutes.THREADS_PINNED}/${tribeId}/${id}/post-like`, {}),

    submitVote: (tribeId: number, threadId: number, pollId: number, data: unknown) =>
        axiosInstance.post(`${userTribeRoutes.THREADS_PINNED}/${tribeId}/${threadId}/${pollId}/poll-action`, data),

    getThreads: (id: string) => axiosInstance.get(`${userTribeRoutes.BASE}/${id}/threads/all`),

    filterThreads: (id: number, data: unknown) => axiosInstance.post(`${userTribeRoutes.BASE}/${id}/threads/sort-thread`, data),

    viewProfile: (id: number) => axiosInstance.get(`${userTribeRoutes.THREADS_VIEW_PROFILE}/${id}`),

    pinThread: (id: number) => axiosInstance.post(`${userTribeRoutes.THREADS_PINNED}/${id}/pin-thread`, {}),

    getPinThreads: (id: string) => axiosInstance.get(`${userTribeRoutes.THREADS_PINNED}/${id}/pinned`),

    reportThread: (id: number | null, data: unknown) => axiosInstance.post(`${userTribeRoutes.THREADS_PINNED}/${id}/report-thread`, data),

    deleteThread: (id: number | null) => axiosInstance.delete(`${userTribeRoutes.THREADS_PINNED}/${id}/delete-thread`),

    searchTribe: (data: unknown) => axiosInstance.post(userTribeRoutes.SEARCH, data),

    addTribeMember: (id: unknown, data: unknown) => axiosInstance.post(`${userTribeRoutes.BASE}/add-member/${id}`, data),

    postComment: (tribeId: number, threadId: number, data: unknown) =>
        axiosInstance.post(`${userTribeRoutes.THREADS_PINNED}/${tribeId}/${threadId}/post-comment`, data),

    getComments: (tribeId: number, threadId: number) =>
        axiosInstance.get(`${userTribeRoutes.THREADS_PINNED}/${tribeId}/${threadId}/comments`),

    createTribe: (values: unknown) => axiosInstance.post(userTribeRoutes.CREATE, values),

    // Delegates to the one real implementation in features/shared/api.ts —
    // this domain doesn't own the upload endpoint, it just needs it too.
    upload: (formData: FormData) => sharedApi.uploadFile(formData),

    uploadMultiple: (formData: FormData) => sharedApi.uploadMultipleFiles(formData),
};
