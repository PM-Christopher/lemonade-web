import { ADMIN_PERMISSIONS } from "@/features/authentication/permissions";
import { routes } from "@/lib/routes";
import {
  BadgeDollarSign,
  BarChart3,
  Briefcase,
  Calendar,
  CircleAlert,
  CreditCard,
  Gavel,
  LifeBuoy,
  KeyRound,
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
  // Absent only for Overview, which every admin sees.
  permission?: string;
}

const links: PageLink[] = [
  { name: "Overview", icon: LayoutDashboard, path: routes.HOME },
  {
    name: "Wallet management",
    icon: Wallet,
    path: routes.WALLET_MANAGEMENT,
    permission: ADMIN_PERMISSIONS.walletView,
  },
  {
    name: "Transactions",
    icon: BarChart3,
    path: routes.TRANSACTIONS,
    permission: ADMIN_PERMISSIONS.transactionsView,
  },
  { name: "Users", icon: User, path: routes.USERS, permission: ADMIN_PERMISSIONS.usersView },
  {
    name: "Businesses",
    icon: Briefcase,
    path: routes.BUSINESSES,
    permission: ADMIN_PERMISSIONS.businessesView,
  },
  {
    name: "Disputes",
    icon: Gavel,
    path: routes.DISPUTES,
    permission: ADMIN_PERMISSIONS.disputesView,
  },
  {
    name: "Tribes",
    icon: MessageSquare,
    path: routes.TRIBES,
    permission: ADMIN_PERMISSIONS.tribesView,
  },
  {
    name: "Events",
    icon: Calendar,
    path: routes.EVENTS,
    permission: ADMIN_PERMISSIONS.eventsView,
  },
  {
    name: "Subscriptions",
    icon: CreditCard,
    path: routes.SUBSCRIPTIONS,
    permission: ADMIN_PERMISSIONS.subscriptionsView,
  },
  {
    name: "Reporting",
    icon: CircleAlert,
    path: routes.REPORTING,
    permission: ADMIN_PERMISSIONS.reportsView,
  },
  {
    name: "Forum moderation",
    icon: ShieldCheck,
    path: routes.FORUM,
    permission: ADMIN_PERMISSIONS.forumView,
  },
  {
    name: "Payments review",
    icon: BadgeDollarSign,
    path: routes.PAYMENTS_REVIEW,
    permission: ADMIN_PERMISSIONS.paymentsView,
  },
  {
    name: "Announcements",
    icon: Megaphone,
    path: routes.ANNOUNCEMENTS,
    permission: ADMIN_PERMISSIONS.announcementsView,
  },
  {
    name: "Team members",
    icon: Users,
    path: routes.TEAM,
    permission: ADMIN_PERMISSIONS.teamView,
  },
  {
    name: "Help center",
    icon: LifeBuoy,
    path: routes.HELP_CENTER,
    permission: ADMIN_PERMISSIONS.faqsManage,
  },
  {
    name: "Roles & permissions",
    icon: KeyRound,
    path: routes.ROLES,
    permission: ADMIN_PERMISSIONS.rolesView,
  },
  {
    name: "Audit log",
    icon: ScrollText,
    path: routes.AUDIT_LOG,
    permission: ADMIN_PERMISSIONS.auditView,
  },
];

// Overview first, then the rest A to Z.
export const pageLinks: PageLink[] = [
  ...links.filter((link) => link.path === routes.HOME),
  ...links.filter((link) => link.path !== routes.HOME).sort((a, b) => a.name.localeCompare(b.name)),
];
