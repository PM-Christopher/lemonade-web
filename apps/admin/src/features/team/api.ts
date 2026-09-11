// Endpoint layer for the team domain — see
// apps/frontend/src/features/events/api.ts for the pattern this follows.
import { axiosInstance } from "@/lib/axiosInstane";
import { adminTeamRoutes } from "@lemonade/api-types";

const authHeaders = (token: string) => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
});

export const teamApi = {
    getTeamData: (token: string) => axiosInstance.get(adminTeamRoutes.BASE, { headers: authHeaders(token) }),

    getTeamDetail: (token: string, id: number) =>
        axiosInstance.get(`${adminTeamRoutes.BASE}/${id}`, { headers: authHeaders(token) }),

    addTeamMember: (
        token: string,
        payload: { name: string; email: string; password: string; role: string },
    ) => axiosInstance.post(`${adminTeamRoutes.BASE}/`, payload, { headers: authHeaders(token) }),
};
