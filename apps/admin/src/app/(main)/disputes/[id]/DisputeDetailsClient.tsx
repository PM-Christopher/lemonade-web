"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDisputeDetailQuery } from "@/features/disputes/queries";
import { useAssignDisputeMutation } from "@/features/disputes/mutations";
import { useCurrentAdminQuery } from "@/features/authentication/queries";
import { waitingLabel } from "../DisputesClient";
import type { DisputeParty, DisputeResolution } from "@/features/disputes/api";
import { capitalizeWords } from "@/utils/helper";

const ResolveDisputeModal = dynamic(() => import("@/modals/disputes/ResolveDisputeModal"), {
  ssr: false,
});

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className={"flex gap-6"}>
      <div className={"w-35 shrink-0"}>
        <p className={"text-text-grey text-meta leading-normal font-medium"}>{label}:</p>
      </div>
      <p className={"text-body-s font-medium"}>{value}</p>
    </div>
  );
}

const person = (party?: DisputeParty | null) =>
  party ? `${party.name} (${party.email})` : undefined;

function DisputeDetailsClient({ id }: { id: string }) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useDisputeDetailQuery(id, { enabled: isLoggedIn });
  const dispute = data?.dispute;
  const job = dispute?.job;
  const [resolution, setResolution] = useState<DisputeResolution | null>(null);

  const isOpen = dispute?.status === "pending";
  const assignMutation = useAssignDisputeMutation();
  const { data: me } = useCurrentAdminQuery();
  const assignedToMe = Boolean(me && dispute?.assignee?.id === String(me.id));

  return (
    <>
      <section className="flex w-full max-w-full flex-col gap-4 overflow-x-hidden p-4 md:p-5">
        <div className={"flex h-fit w-full max-w-180 flex-col rounded-xl bg-white"}>
          <div className={"flex flex-wrap items-center justify-between gap-3 border-b p-6"}>
            <p className={"font-semiBold text-body-l"}>Dispute summary</p>
            {isOpen && (
              <div className={"flex gap-2"}>
                <button
                  className={"border-red-2 bg-red-1 h-11 rounded-xl border px-5 text-center"}
                  onClick={() => setResolution("refund")}
                >
                  <p className={"text-body-l font-medium text-white"}>Refund client</p>
                </button>
                <button
                  className={
                    "border-step-color bg-gradient-green h-11 rounded-xl border px-5 text-center"
                  }
                  onClick={() => setResolution("release")}
                >
                  <p className={"text-body-l font-medium text-white"}>Pay business owner</p>
                </button>
              </div>
            )}
          </div>
          <div className={"flex flex-col gap-5 p-6"}>
            <Field
              label="Status"
              value={dispute ? (isOpen ? "Open" : capitalizeWords(dispute.status)) : undefined}
            />
            {isOpen && dispute && (
              <div className={"flex items-center gap-6"}>
                <div className={"w-35 shrink-0"}>
                  <p className={"text-text-grey text-meta leading-normal font-medium"}>
                    Assigned to:
                  </p>
                </div>
                <div className={"flex items-center gap-3"}>
                  <p className={"text-body-s font-medium"}>
                    {dispute.assignee ? dispute.assignee.name : "Nobody yet"}
                  </p>
                  {!assignedToMe && (
                    <button
                      type="button"
                      disabled={assignMutation.isPending}
                      className={
                        "border-light-grey-50 cursor-pointer rounded-lg border px-3 py-1 text-xs"
                      }
                      onClick={() => assignMutation.mutate({ id })}
                    >
                      {dispute.assignee ? "Take over" : "Take it"}
                    </button>
                  )}
                  {assignedToMe && (
                    <button
                      type="button"
                      disabled={assignMutation.isPending}
                      className={"text-text-grey cursor-pointer text-xs underline"}
                      onClick={() => assignMutation.mutate({ id, adminId: null })}
                    >
                      Release
                    </button>
                  )}
                </div>
              </div>
            )}
            {isOpen && dispute && (
              <div className={"flex items-center gap-6"}>
                <div className={"w-35 shrink-0"}>
                  <p className={"text-text-grey text-meta leading-normal font-medium"}>Waiting:</p>
                </div>
                <p className={`text-body-s font-medium ${dispute.overdue ? "text-red-1" : ""}`}>
                  {waitingLabel(dispute.age_hours)}
                  {dispute.overdue ? " (overdue)" : ""}
                </p>
              </div>
            )}
            <Field label="Business" value={job?.business?.name} />
            <Field label="Client" value={person(job?.client)} />
            <Field label="Business owner" value={person(job?.owner)} />
            <Field
              label="Raised by"
              value={
                dispute
                  ? `${dispute.raised_by?.name ?? "Unknown"} (${capitalizeWords(dispute.raised_by_role)})`
                  : undefined
              }
            />
            <Field label="Amount in escrow" value={job ? `₦${job.amount}` : undefined} />
            <Field
              label="Escrow status"
              value={
                job?.escrow_status
                  ? capitalizeWords(job.escrow_status.replace("_", " "))
                  : undefined
              }
            />
            <Field
              label="Job status"
              value={job ? capitalizeWords(job.status.replace("_", " ")) : undefined}
            />
            <Field label="Services" value={job?.services?.join(", ")} />
            <Field label="Additional info" value={job?.additional_info} />
            <Field label="Business remark" value={job?.remark} />
            <Field
              label="Date raised"
              value={
                dispute ? dayjs(dispute.date_raised).format("DD MMM, YYYY hh:mm A") : undefined
              }
            />
            {dispute?.dispute && (
              <div className={"flex flex-col gap-2"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>Dispute</p>
                <p className={"text-light-black text-body-s font-normal break-words"}>
                  {dispute.dispute}
                </p>
              </div>
            )}
            {dispute && dispute.attachments.length > 0 && (
              <div className={"flex flex-col gap-2"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>Attachments</p>
                <div className={"flex flex-wrap gap-3"}>
                  {dispute.attachments.map((src) => (
                    <a key={src} href={src} target="_blank" rel="noopener noreferrer">
                      <Image
                        src={src}
                        alt="Dispute attachment"
                        width={120}
                        height={120}
                        className={"h-30 w-30 rounded-xl object-cover"}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <ResolveDisputeModal
        isOpen={resolution !== null}
        toggle={() => setResolution(null)}
        id={id}
        resolution={resolution ?? "refund"}
      />
    </>
  );
}

export default DisputeDetailsClient;
