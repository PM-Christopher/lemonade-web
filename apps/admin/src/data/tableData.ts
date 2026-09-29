// Column headers only — every fixture *Data row array this file used to
// export (walletMgtData, planData, walletData, eventsData, usersData,
// affiliateData, tribeData, tribeHeaders' own duplicate, eventMainData,
// affiliateMainData, promotionMainData, listPromotions, reportData,
// announcementData, teamData) has been retired: each of the ~13 admin
// domains that once rendered it is now wired to real backend data via
// TanStack Query (see docs/ARCHITECTURE.md's Phase 5 write-up), and none of
// them still imported the fixture rows — confirmed via a real usage check
// per consumer, not just a grep for the export name, since several files
// still imported a header AND a dead data array side by side. Headers stay
// here because they're real column labels, still rendered by every list
// below; not fixture data.
export const planHeaders = ["TXN ID", "FULL NAME", "ACCOUNT PLAN", "AMOUNT", "DATE PAID", "STATUS"];

export const walletHeaders = [
  "TXN ID",
  "FULL NAME",
  "AMOUNT",
  "DATE REQUESTED",
  "DATE PAID",
  "STATUS",
];

// Shared by BoostingViews/ServiceViews/PromotionViews — all three list the
// same PaymentTransactionResource shape from the backend (boost/service_request/
// promotion `type` on the same `payments` table), so one header set covers all.
export const paymentTransactionHeaders = [
  "REFERENCE",
  "USER",
  "AMOUNT",
  "PROVIDER",
  "PAID AT",
  "STATUS",
];

export const eventsHeaders = [
  "ID",
  "EVENT NAME",
  "ORGANIZER NAME",
  "AMOUNT",
  "TICKETS SOLD",
  "DATE PAID",
  "STATUS",
];

export const usersHeaders = [
  "USER ID",
  "FULL NAME",
  "EMAIL ADDRESS",
  "ACCOUNT PLAN",
  "LOCATION",
  "DATE JOINED",
  "STATUS",
];

export const affiliateHeaders = [
  "USER ID",
  "FULL NAME",
  "TOTAL REFERRALS",
  "SUBSCRIBED REFERRALS",
  "REFERRAL EARNINGS",
];

// "TLN Tribes" has no backend equivalent (confirmed while wiring the
// "Created Tribes" tab to real data — see docs/ARCHITECTURE.md §22 Conflict
// 2) — this stays as real fixture UI, not dead code, until there's an
// actual TLN concept on the backend to wire it to.
export const tribeTlnHeaders = [
  "TRIBE ID",
  "TRIBE NAME",
  "CREATED BY",
  "CATEGORY",
  "MEMBERS",
  "CREATED AT",
];
export const tribeTlnData = [
  {
    "TRIBE ID": "TB12343",
    "TRIBE NAME": "Structural Tech Enthusiasts",
    "CREATED BY": "John Smith",
    CATEGORY: "Technology",
    MEMBERS: 156,
    "CREATED AT": "23 Apr, 2024 09:45 PM",
  },
  {
    "TRIBE ID": "TB12344",
    "TRIBE NAME": "Fitness Warriors",
    "CREATED BY": "Sarah Johnson",
    CATEGORY: "Health & Fitness",
    MEMBERS: 243,
    "CREATED AT": "22 Apr, 2024 03:20 PM",
  },
  {
    "TRIBE ID": "TB12345",
    "TRIBE NAME": "Book Lovers Club",
    "CREATED BY": "Michael Brown",
    CATEGORY: "Literature",
    MEMBERS: 89,
    "CREATED AT": "21 Apr, 2024 11:15 AM",
  },
  {
    "TRIBE ID": "TB12346",
    "TRIBE NAME": "Digital Artists",
    "CREATED BY": "Emma Wilson",
    CATEGORY: "Art",
    MEMBERS: 178,
    "CREATED AT": "20 Apr, 2024 05:30 PM",
  },
  {
    "TRIBE ID": "TB12347",
    "TRIBE NAME": "Crypto Traders",
    "CREATED BY": "David Chen",
    CATEGORY: "Finance",
    MEMBERS: 312,
    "CREATED AT": "19 Apr, 2024 02:45 PM",
  },
];

export const eventMainHeaders = [
  "EVENT ID",
  "EVENT NAME",
  "EVENT TYPE",
  "CATEGORY",
  "DATE CREATED",
  "STATUS",
];

export const affiliateMainHeaders = [
  "AFFILIATE ID",
  "AFFILIATE NAME",
  "NO. OF PROGRAMS",
  "DATE JOINED",
];

export const promotionMainHeaders = [
  "PROMOTION ID",
  "EVENT NAME",
  "PROMOTION NAME",
  "AMOUNT",
  "DATE PAID",
  "STATUS",
];

export const reportHeaders = [
  "REPORT ID",
  "REPORTED BY",
  "CATEGORY",
  "CASE",
  "DATE SUBMITTED",
  "STATUS",
];

export const announcementHeaders = [
  "ANNOUNCEMENT ID",
  "TITLE",
  "CREATED BY",
  "DATE CREATED",
  "SCHEDULE DATE",
  "STATUS",
];

export const teamHeaders = [
  "USER ID",
  "FULL NAME",
  "EMAIL ADDRESS",
  "ROLE",
  "DATE ADDED",
  "STATUS",
];

export const moderationContentHeaders = [
  "ID",
  "CONTENT",
  "AUTHOR",
  "DATE CREATED",
  "STATUS",
  "",
];
