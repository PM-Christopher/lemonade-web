import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import { routes } from "@/lib/routes";
import {
  BadgeDollarSign,
  BarChart3,
  Briefcase,
  Calendar,
  CircleAlert,
  CreditCard,
  Gavel,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  ScrollText,
  ShieldCheck,
  User,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface PageLink {
  name: string;
  path: string;
  icon: LucideIcon;
  // Absent for sections that aren't one of the 8 permission-gated route
  // groups (Overview, Transactions, Announcements) — those stay visible to
  // every admin.
  permission?: string;
}

export const pageLinks: PageLink[] = [
  { name: "Overview", icon: LayoutDashboard, path: routes.HOME },
  {
    name: "Wallet management",
    icon: Wallet,
    path: routes.WALLET_MANAGEMENT,
    permission: ADMIN_SECTION_PERMISSIONS.wallet,
  },
  { name: "Transactions", icon: BarChart3, path: routes.TRANSACTIONS },
  { name: "Users", icon: User, path: routes.USERS, permission: ADMIN_SECTION_PERMISSIONS.users },
  {
    name: "Businesses",
    icon: Briefcase,
    path: routes.BUSINESSES,
    permission: ADMIN_SECTION_PERMISSIONS.businesses,
  },
  {
    name: "Disputes",
    icon: Gavel,
    path: routes.DISPUTES,
    permission: ADMIN_SECTION_PERMISSIONS.businesses,
  },
  {
    name: "Tribes",
    icon: MessageSquare,
    path: routes.TRIBES,
    permission: ADMIN_SECTION_PERMISSIONS.tribes,
  },
  {
    name: "Events",
    icon: Calendar,
    path: routes.EVENTS,
    permission: ADMIN_SECTION_PERMISSIONS.events,
  },
  {
    name: "Subscriptions",
    icon: CreditCard,
    path: routes.SUBSCRIPTIONS,
    permission: ADMIN_SECTION_PERMISSIONS.subscriptions,
  },
  {
    name: "Reporting",
    icon: CircleAlert,
    path: routes.REPORTING,
    permission: ADMIN_SECTION_PERMISSIONS.moderation,
  },
  {
    name: "Forum moderation",
    icon: ShieldCheck,
    path: routes.FORUM,
    permission: ADMIN_SECTION_PERMISSIONS.moderation,
  },
  {
    name: "Payments review",
    icon: BadgeDollarSign,
    path: routes.PAYMENTS_REVIEW,
    permission: ADMIN_SECTION_PERMISSIONS.wallet,
  },
  { name: "Announcements", icon: Megaphone, path: routes.ANNOUNCEMENTS },
  {
    name: "Team members",
    icon: Users,
    path: routes.TEAM,
    permission: ADMIN_SECTION_PERMISSIONS.teamMembers,
  },
  {
    name: "Audit log",
    icon: ScrollText,
    path: routes.AUDIT_LOG,
    permission: ADMIN_SECTION_PERMISSIONS.teamMembers,
  },
];
