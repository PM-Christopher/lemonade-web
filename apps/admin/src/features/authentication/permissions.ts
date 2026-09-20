// Permission names, one per admin route group — must match the backend's
// `can:<name>` middleware 1:1 (lemonade-backend routes/v1/admin/*.php). See
// docs/ARCHITECTURE.md §22 Conflict 2.
export const ADMIN_SECTION_PERMISSIONS = {
  wallet: "wallet.write",
  subscriptions: "subscriptions.write",
  moderation: "moderation.write",
  businesses: "businesses.write",
  tribes: "tribes.write",
  events: "events.write",
  users: "users.write",
  teamMembers: "team-members.write",
} as const;

export type AdminSection = keyof typeof ADMIN_SECTION_PERMISSIONS;
