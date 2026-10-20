import type { BusinessStatus, ServiceJobRow } from "@/features/businesses/api";

const BUSINESS_STATUS_LABELS: Record<BusinessStatus, string> = {
  ACTIVE: "Approved",
  PENDING: "Pending",
  REJECTED: "Rejected",
  SUSPENDED: "Restricted",
  INACTIVE: "Inactive",
};

const GREEN = "text-light-green-70";
const ORANGE = "text-warning-bold";
const RED = "text-red-1";

export const businessStatusLabel = (status: BusinessStatus) => BUSINESS_STATUS_LABELS[status];

export const businessStatusClass = (status: BusinessStatus) =>
  status === "ACTIVE" ? GREEN : status === "PENDING" ? ORANGE : RED;

export const serviceStatusClass = (status: ServiceJobRow["status"]) =>
  status === "Completed" ? GREEN : status === "In-progress" ? ORANGE : RED;

// The first service plus a "+N" count for the rest.
export const firstWithCount = (items: ReadonlyArray<string> | null | undefined) => {
  const list = items ?? [];
  return { first: list[0] ?? "N/A", more: Math.max(list.length - 1, 0) };
};
