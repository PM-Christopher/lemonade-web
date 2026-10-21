import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import { routes } from "@/lib/routes";

export interface PageLink {
  name: string;
  path: string;
  // Absent for sections that aren't one of the 8 permission-gated route
  // groups (Overview, Transactions, Announcements) — those stay visible to
  // every admin.
  permission?: string;
}

export const pageLinks: PageLink[] = [
  { name: "Overview", path: routes.HOME },
  {
    name: "Wallet management",
    path: routes.WALLET_MANAGEMENT,
    permission: ADMIN_SECTION_PERMISSIONS.wallet,
  },
  { name: "Transactions", path: routes.TRANSACTIONS },
  { name: "Users", path: routes.USERS, permission: ADMIN_SECTION_PERMISSIONS.users },
  { name: "Businesses", path: routes.BUSINESSES, permission: ADMIN_SECTION_PERMISSIONS.businesses },
  { name: "Disputes", path: routes.DISPUTES, permission: ADMIN_SECTION_PERMISSIONS.businesses },
  { name: "Tribes", path: routes.TRIBES, permission: ADMIN_SECTION_PERMISSIONS.tribes },
  { name: "Events", path: routes.EVENTS, permission: ADMIN_SECTION_PERMISSIONS.events },
  {
    name: "Subscriptions",
    path: routes.SUBSCRIPTIONS,
    permission: ADMIN_SECTION_PERMISSIONS.subscriptions,
  },
  { name: "Reporting", path: routes.REPORTING, permission: ADMIN_SECTION_PERMISSIONS.moderation },
  {
    name: "Forum moderation",
    path: routes.FORUM,
    permission: ADMIN_SECTION_PERMISSIONS.moderation,
  },
  {
    name: "Payments review",
    path: routes.PAYMENTS_REVIEW,
    permission: ADMIN_SECTION_PERMISSIONS.wallet,
  },
  {
    name: "Support inbox",
    path: routes.SUPPORT_INBOX,
    permission: ADMIN_SECTION_PERMISSIONS.users,
  },
  { name: "Announcements", path: routes.ANNOUNCEMENTS },
  { name: "Team members", path: routes.TEAM, permission: ADMIN_SECTION_PERMISSIONS.teamMembers },
  { name: "Audit log", path: routes.AUDIT_LOG, permission: ADMIN_SECTION_PERMISSIONS.teamMembers },
];
