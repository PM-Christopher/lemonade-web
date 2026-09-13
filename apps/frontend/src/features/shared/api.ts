// Endpoint layer for cross-cutting /shared/utilities/* routes — these
// don't belong to any one feature domain, so they get their own small
// service file rather than being duplicated inline at each component that
// needs an upload. See features/events/api.ts for the pattern this follows.
import { axiosInstance } from "@/lib/axiosInstane";
import { sharedUtilityRoutes } from "@lemonade/api-types";

export const sharedApi = {
    uploadFile: (formData: FormData) =>
        axiosInstance.post(sharedUtilityRoutes.UPLOAD, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    uploadMultipleFiles: (formData: FormData) =>
        axiosInstance.post(sharedUtilityRoutes.UPLOAD_MULTIPLE, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
};
