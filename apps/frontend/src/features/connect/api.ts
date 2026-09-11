// Endpoint layer for the connect domain — see features/events/api.ts for
// the pattern this follows. Still on the pre-BFF axiosInstance transport
// deliberately (Phase 5 concern, not this refactor).
import { axiosInstance } from "@/lib/axiosInstane";
import { userConnectRoutes, sharedUtilityRoutes } from "@lemonade/api-types";

const authHeaders = (token: string) => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
});

export const connectApi = {
    getChat: (receiverId: number, token: string) =>
        axiosInstance.get(`${userConnectRoutes.MESSAGES}/chat?receiver_id=${receiverId}`, { headers: authHeaders(token) }),

    sendChat: (receiverId: number | null, message: string | null, media: string[], token: string) =>
        axiosInstance.post(`${userConnectRoutes.MESSAGES}?receiver_id=${receiverId}`, { message, media }, { headers: authHeaders(token) }),

    inviteResponse: (id: number, data: { option: string }, token: string) =>
        axiosInstance.post(`${userConnectRoutes.BASE}/invite-response/${id}`, data, { headers: authHeaders(token) }),

    findUser: (search: string, token: string) =>
        axiosInstance.get(`${userConnectRoutes.FIND_USER}?search=${search}`, { headers: authHeaders(token) }),

    sendInvite: (data: unknown, token: string) =>
        axiosInstance.post(userConnectRoutes.SEND_INVITE, data, { headers: authHeaders(token) }),

    getInvites: () => axiosInstance.get(userConnectRoutes.GET_INVITES),

    getConnection: () => axiosInstance.get(userConnectRoutes.BASE),

    getMessages: () => axiosInstance.get(userConnectRoutes.MESSAGES),

    updateVisibility: (visible: boolean, config: { headers: Record<string, string> }) =>
        axiosInstance.patch(userConnectRoutes.UPDATE_VISIBILITY, { visibility: visible }, config),

    uploadMultiple: (formData: unknown, config: Record<string, unknown>) =>
        axiosInstance.post(sharedUtilityRoutes.UPLOAD_MULTIPLE, formData, config),
};
