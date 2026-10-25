"use client";
import { useBrandingQuery } from "@/features/branding/queries";

// Used until the real value loads.
const DEFAULT_GRACE_DAYS = 30;

// The grace period set by admins, as running text.
export function DeletionGracePeriod() {
  const { data } = useBrandingQuery();
  const days = data?.account_deletion_grace_days ?? DEFAULT_GRACE_DAYS;

  return (
    <p className="text-light-black text-body-s max-w-148 font-normal">
      Deleting your account permanently removes your data from our system. You will have a{" "}
      <span className="font-semibold">{days}-day</span> grace period to change your mind. If you log
      in to your account within {days} days of deletion, your account will be reactivated.
    </p>
  );
}
