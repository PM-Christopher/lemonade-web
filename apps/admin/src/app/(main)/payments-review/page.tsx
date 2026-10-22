import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_PERMISSIONS } from "@/features/authentication/permissions";
import PaymentsReviewClient from "./PaymentsReviewClient";

export default async function PaymentsReviewPage() {
  await requireAdminPermission(ADMIN_PERMISSIONS.paymentsView);

  return <PaymentsReviewClient />;
}
