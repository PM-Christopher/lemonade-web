// Endpoint layer for the tribes domain — see features/team/api.ts for the
// pattern this follows: the BFF proxy transport (browserApi), not the
// pre-BFF axiosInstance.
//
// NOTE: ADD_THREAD, DELETE_THREAD and REMOVE_MEMBER exist on
// adminTribesRoutes but have no wired frontend consumer here — out of scope
// for this pass (see the tribes admin migration task). CREATE is already
// implemented via modals/tribes/CreateTribeModal.tsx and intentionally not
// touched.
import { browserApi } from "@/lib/browser-api";
import { adminTribesRoutes, buildPath } from "@lemonade/api-types/generated";

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

export const tribesApi = {
  getTribeList: () => browserApi.get<TribeListResponse>(adminTribesRoutes.LIST),

  getTribeDetail: (id: string) =>
    browserApi.get<TribeDetailResponse>(buildPath(adminTribesRoutes.SHOW, { id })),

  restrictTribe: (id: string) =>
    browserApi.patch<{ restricted: boolean }>(buildPath(adminTribesRoutes.RESTRICT, { id }), {}),

  reactivateTribe: (id: string) =>
    browserApi.patch<{ reactivated: boolean }>(
      buildPath(adminTribesRoutes.REACTIVATE, { id }),
      {},
    ),

  deleteTribe: (id: string) =>
    browserApi.delete<{ deleted: boolean }>(buildPath(adminTribesRoutes.DELETE, { id })),
};
