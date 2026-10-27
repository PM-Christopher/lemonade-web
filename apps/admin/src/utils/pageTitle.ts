import { pageLinks } from "@/utils/pageLinks";
import { routes } from "@/lib/routes";

export interface PageHeading {
  title: string;
  // Set on inner pages: where the back button goes when there is no history.
  parent?: string;
}

// Inner pages, most specific first. A trailing segment of ids is matched by [^/]+.
const innerPages: Array<[RegExp, string, string]> = [
  [/^\/users\/affiliate\/[^/]+$/, "Affiliate details", routes.USERS],
  [/^\/users\/[^/]+$/, "User details", routes.USERS],
  [/^\/tribes\/categories$/, "Tribe categories", routes.TRIBES],
  [/^\/businesses\/categories$/, "Business categories", routes.BUSINESSES],
  [/^\/reporting\/categories$/, "Reporting categories", routes.REPORTING],
  [/^\/tribes\/[^/]+$/, "Tribe details", routes.TRIBES],
  [/^\/events\/add-promotions$/, "Add promotion", routes.EVENTS],
  [/^\/events\/[^/]+\/promotions$/, "Event promotions", routes.EVENTS],
  [/^\/events\/[^/]+\/affiliates$/, "Event affiliates", routes.EVENTS],
  [/^\/events\/[^/]+$/, "Event details", routes.EVENTS],
  [/^\/businesses\/services\/[^/]+$/, "Service details", routes.BUSINESSES],
  [/^\/businesses\/[^/]+$/, "Business details", routes.BUSINESSES],
  [/^\/disputes\/[^/]+$/, "Dispute details", routes.DISPUTES],
  [/^\/wallet-management\/[^/]+$/, "Wallet details", routes.WALLET_MANAGEMENT],
  [/^\/transactions\/[^/]+\/wallet-details$/, "Wallet transaction", routes.TRANSACTIONS],
  [/^\/transactions\/[^/]+\/event-details$/, "Event transaction", routes.TRANSACTIONS],
  [
    /^\/transactions\/[^/]+\/subscription-details$/,
    "Subscription transaction",
    routes.TRANSACTIONS,
  ],
  [/^\/transactions\/[^/]+\/promotion-details$/, "Promotion transaction", routes.TRANSACTIONS],
  [/^\/transactions\/[^/]+\/boosting-details$/, "Boost transaction", routes.TRANSACTIONS],
  [/^\/transactions\/[^/]+\/service-details$/, "Service transaction", routes.TRANSACTIONS],
  [/^\/transactions\/[^/]+\/tribe-details$/, "Tribe transaction", routes.TRANSACTIONS],
  [/^\/team\/[^/]+$/, "Team member", routes.TEAM],
  [/^\/reporting\/[^/]+$/, "Report details", routes.REPORTING],
  [/^\/announcements\/[^/]+$/, "Announcement details", routes.ANNOUNCEMENTS],
];

/** The title for the top bar, plus a back target when the page is not a menu page. */
export function getPageHeading(pathname: string, labels: Record<string, string> = {}): PageHeading {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;

  for (const [pattern, title, parent] of innerPages) {
    if (pattern.test(path)) return { title, parent };
  }

  if (path === routes.PROFILE) return { title: "Profile" };
  if (path === routes.SETTINGS) return { title: "Settings" };
  if (path === routes.SUPPORT_INBOX) return { title: "Support inbox" };

  const link = pageLinks.find((item) => item.path === path);
  return { title: (link && labels[link.path]?.trim()) || link?.name || "Overview" };
}
