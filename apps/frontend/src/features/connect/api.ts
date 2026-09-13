// Endpoint layer for the connect domain — see features/events/api.ts for
// the pattern this follows. Still on the pre-BFF axiosInstance transport
// deliberately (Phase 5 concern, not this refactor).
import { axiosInstance } from "@/lib/axiosInstane";
import { userConnectRoutes } from "@lemonade/api-types";
import { sharedApi } from "@/features/shared/api";

export const connectApi = {
    getChat: (receiverId: number) => axiosInstance.get(`${userConnectRoutes.MESSAGES}/chat?receiver_id=${receiverId}`),

    sendChat: (receiverId: number | null, message: string | null, media: string[]) =>
        axiosInstance.post(`${userConnectRoutes.MESSAGES}?receiver_id=${receiverId}`, { message, media }),

    inviteResponse: (id: number, data: { option: string }) =>
        axiosInstance.post(`${userConnectRoutes.BASE}/invite-response/${id}`, data),

    findUser: (search: string) => axiosInstance.get(`${userConnectRoutes.FIND_USER}?search=${search}`),

    sendInvite: (data: unknown) => axiosInstance.post(userConnectRoutes.SEND_INVITE, data),

    getInvites: () => axiosInstance.get(userConnectRoutes.GET_INVITES),

    getConnection: () => axiosInstance.get(userConnectRoutes.BASE),

    getMessages: () => axiosInstance.get(userConnectRoutes.MESSAGES),

    updateVisibility: (visible: boolean) => axiosInstance.patch(userConnectRoutes.UPDATE_VISIBILITY, { visibility: visible }),

    // Delegates to the one real implementation in features/shared/api.ts —
    // this domain doesn't own the upload endpoint, it just needs it too.
    uploadMultiple: (formData: FormData) => sharedApi.uploadMultipleFiles(formData),
};
