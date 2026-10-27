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

export const walletHeaders = ["TXN ID", "FULL NAME", "AMOUNT", "DATE PAID", "STATUS"];

export const walletManagementHeaders = [
  "WALLET ID",
  "FULL NAME",
  "AMOUNT",
  "BALANCE",
  "REQUEST DATE",
  "RISK",
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

export const tribePaymentHeaders = [
  "TXN ID",
  "FULL NAME",
  "TRIBE NAME",
  "AMOUNT",
  "DATE PAID",
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
  "CONTENT",
  "POSTED IN",
  "AUTHOR",
  "DATE CREATED",
  "STATUS",
  "",
];
