"use client";
import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import MainLayout from "@/components/layouts/MainLayout";
import { useBusinessDetailQuery } from "@/features/businesses/queries";
import { capitalizeWords } from "@/utils/helper";

// Off the initial bundle — each modal is only needed once its triggering
// action fires (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const ApproveModal = dynamic(() => import("@/modals/businesses/ApproveModal"), { ssr: false });
const RejectModal = dynamic(() => import("@/modals/businesses/RejectModal"), { ssr: false });
const SuspendModal = dynamic(() => import("@/modals/businesses/SuspendModal"), { ssr: false });
const ReactivateModal = dynamic(() => import("@/modals/businesses/ReactivateModal"), {
  ssr: false,
});
const DeleteModal = dynamic(() => import("@/modals/businesses/DeleteModal"), { ssr: false });

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className={"items-center-center flex gap-6"}>
      <div className={"w-[140px]"}>
        <p className={"text-text-grey text-[12px] font-medium"}>{label}:</p>
      </div>
      <p className={"text-[14px] font-medium"}>{value}</p>
    </div>
  );
}

function BusinessDetailsClient({ id }: { id: string }) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useBusinessDetailQuery(id, { enabled: isLoggedIn });
  const business = data?.business;

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const status = business?.status;

  return (
    <MainLayout>
      <section className="flex w-full max-w-full flex-col gap-4 overflow-x-hidden p-4 md:p-5">
        <div className={"flex h-fit w-full max-w-[720px] flex-col rounded-xl bg-white"}>
          <div className={"flex flex-wrap items-center justify-between gap-3 border-b p-6"}>
            <p className={"font-semiBold text-[16px]"}>Business summary</p>
            <div className={"flex gap-2"}>
              {status === "PENDING" && (
                <>
                  <button
                    className={
                      "border-step-color bg-gradient-green h-11 rounded-xl border px-5 text-center"
                    }
                    onClick={() => setApproveModalOpen(true)}
                  >
                    <p className={"text-[16px] font-medium text-white"}>Approve</p>
                  </button>
                  <button
                    className={"border-red-2 bg-red-1 h-11 rounded-xl border px-5 text-center"}
                    onClick={() => setRejectModalOpen(true)}
                  >
                    <p className={"text-[16px] font-medium text-white"}>Reject</p>
                  </button>
                </>
              )}
              {status === "ACTIVE" && (
                <button
                  className={"border-red-2 bg-red-1 h-11 rounded-xl border px-5 text-center"}
                  onClick={() => setSuspendModalOpen(true)}
                >
                  <p className={"text-[16px] font-medium text-white"}>Suspend</p>
                </button>
              )}
              {(status === "SUSPENDED" || status === "REJECTED" || status === "INACTIVE") && (
                <button
                  className={
                    "border-step-color bg-gradient-green h-11 rounded-xl border px-5 text-center"
                  }
                  onClick={() => setReactivateModalOpen(true)}
                >
                  <p className={"text-[16px] font-medium text-white"}>Reactivate</p>
                </button>
              )}
            </div>
          </div>
          <div className={"flex flex-col gap-5 p-6"}>
            {business?.image && (
              <Image
                src={business.image}
                alt={business.name}
                width={96}
                height={96}
                className={"h-24 w-24 rounded-2xl object-cover"}
              />
            )}
            <Field label="Business name" value={business?.name} />
            <Field label="Owner" value={business?.owner?.name} />
            <Field label="Owner email" value={business?.owner?.email} />
            <Field label="Status" value={business ? capitalizeWords(business.status) : undefined} />
            <Field label="City" value={business?.city} />
            <Field label="Country" value={business?.country} />
            <Field label="Contact email" value={business?.email} />
            <Field label="Phone number" value={business?.phone_number} />
            <Field label="Website" value={business?.website_url} />
            <Field
              label="Service rate"
              // Server-computed figure, rendered as-is — no client-side
              // arithmetic performed on it.
              value={business?.service_rate != null ? String(business.service_rate) : undefined}
            />
            <Field label="Categories" value={business?.categories?.join(", ")} />
            <Field label="Services" value={business?.services?.join(", ")} />
            <Field label="Date submitted" value={business?.date_submitted} />
            <Field label="Reviewed at" value={business?.reviewed_at} />
            <Field label="Rejection reason" value={business?.rejection_reason} />
            {business?.description && (
              <div className={"flex flex-col gap-2"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Description</p>
                <p className={"text-light-black text-[14px] font-normal"}>{business.description}</p>
              </div>
            )}
            {business?.gallery && business.gallery.length > 0 && (
              <div className={"flex flex-col gap-2"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Gallery</p>
                <div className={"flex flex-wrap gap-3"}>
                  {business.gallery.map((src) => (
                    <Image
                      key={src}
                      src={src}
                      alt={business.name}
                      width={120}
                      height={120}
                      className={"h-[120px] w-[120px] rounded-xl object-cover"}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div
            className={"border-t-grey-20 mt-5 flex items-center justify-between gap-6 border-t p-6"}
          >
            <button
              className={
                "border-light-grey-50 text-red-1 w-full rounded-xl border px-12 py-[11px] font-sans text-[14px] font-medium"
              }
              type={"button"}
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete listing
            </button>
          </div>
        </div>
      </section>
      <ApproveModal isOpen={approveModalOpen} toggle={() => setApproveModalOpen(false)} id={id} />
      <RejectModal isOpen={rejectModalOpen} toggle={() => setRejectModalOpen(false)} id={id} />
      <SuspendModal isOpen={suspendModalOpen} toggle={() => setSuspendModalOpen(false)} id={id} />
      <ReactivateModal
        isOpen={reactivateModalOpen}
        toggle={() => setReactivateModalOpen(false)}
        id={id}
      />
      <DeleteModal isOpen={deleteModalOpen} toggle={() => setDeleteModalOpen(false)} id={id} />
    </MainLayout>
  );
}

export default BusinessDetailsClient;
