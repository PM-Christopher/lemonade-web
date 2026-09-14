// Public surface of the shared/utilities feature. Cross-cutting endpoints
// (bank lookup, account verification, file upload) that don't belong to any
// one domain feature but ARE consumed by several (tribes, connect) — those
// consumers must come through here, not features/shared/api.ts directly,
// per docs/ARCHITECTURE.md's import rules (enforced by
// boundaries/entry-point in eslint.config.mjs).
export { sharedApi } from "./api";
export type { Bank, GetAllBanksResponse, VerifyAccountResponse, UploadFileResponse } from "./api";
export { sharedKeys, useBanksQuery } from "./queries";
export { useVerifyAccountMutation } from "./mutations";
