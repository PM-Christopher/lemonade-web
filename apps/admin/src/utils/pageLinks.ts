import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";

export interface PageLink {
  name: string;
  path: string;
  // Absent for sections that aren't one of the 8 permission-gated route
  // groups (Overview, Transactions, Announcements) — those stay visible to
  // every admin.
  permission?: string;
}

export const pageLinks: PageLink[] = [
  { name: "Overview", path: "/" },
  {
    name: "Wallet management",
    path: "/wallet-management",
    permission: ADMIN_SECTION_PERMISSIONS.wallet,
  },
  { name: "Transactions", path: "/transactions" },
  { name: "Users", path: "/users", permission: ADMIN_SECTION_PERMISSIONS.users },
  { name: "Businesses", path: "/businesses", permission: ADMIN_SECTION_PERMISSIONS.businesses },
  { name: "Tribes", path: "/tribes", permission: ADMIN_SECTION_PERMISSIONS.tribes },
  { name: "Events", path: "/events", permission: ADMIN_SECTION_PERMISSIONS.events },
  {
    name: "Subscriptions",
    path: "/subscriptions",
    permission: ADMIN_SECTION_PERMISSIONS.subscriptions,
  },
  { name: "Reporting", path: "/reporting", permission: ADMIN_SECTION_PERMISSIONS.moderation },
  { name: "Forum moderation", path: "/forum", permission: ADMIN_SECTION_PERMISSIONS.moderation },
  { name: "Announcements", path: "/announcements" },
  { name: "Team members", path: "/team", permission: ADMIN_SECTION_PERMISSIONS.teamMembers },
];
