// Endpoint layer for the tribes domain — see features/team/api.ts for the
// pattern this follows: the BFF proxy transport (browserApi), not the
// pre-BFF axiosInstance.
import { browserApi } from "@/lib/browser-api";
import {
  adminTribesRoutes,
  adminUtilitiesRoutes,
  buildPath,
  sharedUtilitiesRoutes,
} from "@lemonade/api-types/generated";
import type { AddTribeThreadInput, CreateTribeInput } from "./schema";

export interface AdminTribeListItem {
  id: string;
  uuid: string;
  name: string;
  image: string | null;
  category: string;
  created_by: string;
  members: number;
  date_created: string;
  slug: string;
}

export interface TribeListResponse {
  tribes: AdminTribeListItem[];
}

// Raw Eloquent models — the backend returns these unwrapped by a resource
// (see App\Actions\Tribe\GetAdminTribe::execute in lemonade-backend). Typed
// against app/Models/Thread.php and app/Models/TribeMember.php, both loaded
// with their `user` relation (App\Models\User, which uses HasUuids — string
// ids, not numeric).
export interface TribeThreadAuthor {
  id: string;
  fullname: string;
  username: string;
  profile_image: string | null;
}

export interface TribeThread {
  id: string;
  topic: string;
  thoughts: string;
  pinned: boolean;
  created_at: string;
  user: TribeThreadAuthor | null;
}

export interface TribeMemberItem {
  id: string;
  user_id: string;
  created_at: string;
  user: TribeThreadAuthor | null;
}

// TribeStatus (app/Enums/Shared/TribeStatus.php) serialized via ->name.
export type TribeStatus = "PENDING" | "ACTIVE" | "INACTIVE" | "CLOSED" | "RESTRICTED";

export interface TribeDetail {
  id: string;
  image: string | null;
  name: string;
  category: string;
  members_count: number;
  threads_count: number;
  description: string;
  created_at: string;
  status: TribeStatus;
}

export interface TribeDetailResponse {
  tribe: TribeDetail;
  threads: TribeThread[];
  members: TribeMemberItem[];
}

export interface TribeCategory {
  name: string;
}

export interface TribeCategoriesResponse {
  categories: TribeCategory[];
}

export interface UploadImageResponse {
  image: string;
}

export const tribesApi = {
  getTribeList: () => browserApi.get<TribeListResponse>(adminTribesRoutes.LIST),

  getTribeDetail: (id: string) =>
    browserApi.get<TribeDetailResponse>(buildPath(adminTribesRoutes.SHOW, { id })),

  getTribeCategories: () =>
    browserApi.get<TribeCategoriesResponse>(sharedUtilitiesRoutes.TRIBES_CATEGORIES),

  createTribe: (data: CreateTribeInput) =>
    browserApi.post<{ tribe: { id: string } }>(adminTribesRoutes.CREATE, data),

  restrictTribe: (id: string) =>
    browserApi.patch<{ restricted: boolean }>(buildPath(adminTribesRoutes.RESTRICT, { id }), {}),

  reactivateTribe: (id: string) =>
    browserApi.patch<{ reactivated: boolean }>(buildPath(adminTribesRoutes.REACTIVATE, { id }), {}),

  deleteTribe: (id: string) =>
    browserApi.delete<{ deleted: boolean }>(buildPath(adminTribesRoutes.DELETE, { id })),

  addThread: (tribeId: string, data: AddTribeThreadInput) =>
    browserApi.post<{ posted: boolean }>(
      buildPath(adminTribesRoutes.ADD_THREAD, { id: tribeId }),
      data,
    ),

  // The backend's route nests this under /admin/tribes/ for organization
  // only — DeleteAdminTribeThread looks the thread up by this id directly,
  // not scoped to a tribe, so `id` here is the THREAD's id, not the tribe's.
  deleteThread: (threadId: string) =>
    browserApi.delete<{ deleted: boolean }>(
      buildPath(adminTribesRoutes.DELETE_THREAD, { id: threadId }),
    ),

  removeMember: (tribeId: string, userId: string) =>
    browserApi.delete<{ deleted: boolean }>(
      buildPath(adminTribesRoutes.REMOVE_MEMBER, { id: tribeId, user_id: userId }),
    ),

  // Admin's own guard — sharedUtilitiesRoutes.UPLOAD is auth:user only and
  // 401s an admin token. See lemonade-backend's routes/v1/admin/utilities.php.
  uploadImage: (formData: FormData) =>
    browserApi.post<UploadImageResponse>(adminUtilitiesRoutes.UPLOAD, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
