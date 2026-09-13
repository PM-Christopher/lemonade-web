// Endpoint layer for the team domain — see
// apps/frontend/src/features/events/api.ts for the pattern this follows.
import { axiosInstance } from "@/lib/axiosInstane";
import { adminTeamRoutes } from "@lemonade/api-types";

export const teamApi = {
    getTeamData: () => axiosInstance.get(adminTeamRoutes.BASE),

    getTeamDetail: (id: number) =>
        axiosInstance.get(`${adminTeamRoutes.BASE}/${id}`),

    addTeamMember: (
        payload: { name: string; email: string; password: string; role: string },
    ) => axiosInstance.post(`${adminTeamRoutes.BASE}/`, payload),
};
