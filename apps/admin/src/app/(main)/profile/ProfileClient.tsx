"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import MainLayout from "@/components/layouts/MainLayout";
import { RootState } from "@/redux/store";
import { useAdminProfileQuery } from "@/features/profile/queries";
import { useChangeOwnPasswordMutation } from "@/features/profile/mutations";
import { capitalizeSpecial, GetStatusClass } from "@/utils/helper";

const UpdatePasswordModal = dynamic(() => import("@/modals/team/UpdatePasswordModal"), {
  ssr: false,
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-6">
      <div className="w-28.75 shrink-0">
        <p className="text-text-grey text-meta leading-normal font-medium">{label}:</p>
      </div>
      {children}
    </div>
  );
}

function ProfileClient() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useAdminProfileQuery({ enabled: isLoggedIn });
  const profile = data?.admin;
  const [passwordOpen, setPasswordOpen] = useState(false);
  const changePassword = useChangeOwnPasswordMutation();
  const status = profile?.status === 1 ? "Active" : "Suspended";

  return (
    <MainLayout>
      <section className="flex justify-between p-5">
        <div className="flex h-fit w-147 flex-col gap-3 rounded-xl bg-white">
          <div className="flex flex-col gap-5 p-6">
            {profile?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.image}
                alt={profile.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="bg-mid-grey h-16 w-16 rounded-full" />
            )}
            <Field label="Full Name">
              <p className="text-body-s font-medium">{profile?.name}</p>
            </Field>
            <Field label="User ID">
              <p className="text-body-s font-medium">{profile?.unique_id}</p>
            </Field>
            <Field label="Status">
              <p className={`text-body-s font-medium ${GetStatusClass(status)}`}>{status}</p>
            </Field>
            <Field label="Role">
              <p className="text-body-s font-medium">
                {profile?.role ? capitalizeSpecial(profile.role) : ""}
              </p>
            </Field>
            <Field label="Email Address">
              <p className="text-body-s font-medium">{profile?.email}</p>
            </Field>
            <Field label="Date Added">
              <p className="text-body-s font-medium">
                {profile?.created_at
                  ? dayjs(profile.created_at).format("DD MMM, YYYY hh:mm A")
                  : ""}
              </p>
            </Field>
            <button
              className="border-light-grey-50 text-body-s w-fit rounded-xl border px-12 py-2.75 font-sans font-medium"
              type="button"
              onClick={() => setPasswordOpen(true)}
            >
              Update password
            </button>
          </div>
        </div>
      </section>
      <UpdatePasswordModal
        isOpen={passwordOpen}
        toggle={() => setPasswordOpen(false)}
        submit={(values) => changePassword.mutateAsync(values)}
      />
    </MainLayout>
  );
}

export default ProfileClient;
