"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronDown, ChevronRight, RocketIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import MainLayout from "@/components/layouts/MainLayout";
import { AvatarName } from "@/components/global/AvatarName";
import { useBusinessDetailQuery } from "@/features/businesses/queries";
import type { ServiceJobRow } from "@/features/businesses/api";
import { useNavigation } from "@/hooks/useNavigation";
import { routes } from "@/lib/routes";
import { naira } from "@/views/transactions/transactionFormat";
import { businessStatusClass, businessStatusLabel } from "@/views/businesses/businessFormat";

// Off the initial bundle — each modal is only needed once its triggering action fires.
const ApproveModal = dynamic(() => import("@/modals/businesses/ApproveModal"), { ssr: false });
const RejectModal = dynamic(() => import("@/modals/businesses/RejectModal"), { ssr: false });
const SuspendModal = dynamic(() => import("@/modals/businesses/SuspendModal"), { ssr: false });
const ReactivateModal = dynamic(() => import("@/modals/businesses/ReactivateModal"), {
  ssr: false,
});
const DeleteModal = dynamic(() => import("@/modals/businesses/DeleteModal"), { ssr: false });

const ABOUT_PREVIEW = 220;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <p className="text-text-grey text-meta w-36 shrink-0 leading-normal font-medium">{label} :</p>
      <div className="text-body-s min-w-0 font-medium">{children}</div>
    </div>
  );
}

function JobItem({ job, onOpen }: { job: ServiceJobRow; onOpen: () => void }) {
  const place = [job.business?.city, job.business?.country].filter(Boolean).join(", ");
  return (
    <button
      type="button"
      className="border-grey-20 flex w-full cursor-pointer flex-col gap-2 border-b p-4 text-left"
      onClick={onOpen}
    >
      <div className="flex items-center justify-between">
        <AvatarName name={job.client?.name} image={job.business?.image} />
        <ChevronRight className="text-text-grey h-4 w-4" />
      </div>
      <p className="text-text-grey text-meta">{place || "N/A"}</p>
      <div className="flex items-center justify-between">
        <span className="bg-light-grey text-meta rounded-full px-2 py-0.5">
          {job.services[0] ?? "N/A"}
          {job.services.length > 1 ? ` +${job.services.length - 1}` : ""}
        </span>
        <span className="text-body-s font-semibold">{naira(job.amount)}</span>
      </div>
    </button>
  );
}

// One business: summary, bank details, its services and listing content.
function BusinessDetailsClient({ id }: { id: string }) {
  const { push } = useNavigation();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useBusinessDetailQuery(id, { enabled: isLoggedIn });
  const business = data?.business;
  const summary = data?.summary;

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [flagOpen, setFlagOpen] = useState(false);
  const [jobTab, setJobTab] = useState<"in-progress" | "completed">("in-progress");
  const [aboutOpen, setAboutOpen] = useState(false);
  const flagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (flagRef.current && !flagRef.current.contains(event.target as Node)) setFlagOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const status = business?.status;
  const jobs = (jobTab === "in-progress" ? data?.in_progress_jobs : data?.completed_jobs) ?? [];
  const description = business?.description ?? "";
  const isLongAbout = description.length > ABOUT_PREVIEW;
  const about =
    isLongAbout && !aboutOpen ? `${description.slice(0, ABOUT_PREVIEW).trimEnd()}...` : description;
  const gradient = "border-step-color bg-gradient-green h-11 rounded-xl border px-5 text-center";

  return (
    <MainLayout>
      <section className="flex w-full max-w-full flex-col gap-4 p-4 md:p-5 lg:flex-row lg:items-start">
        <div className="flex h-fit w-full shrink-0 flex-col rounded-xl bg-white lg:w-110">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
            <p className="font-semiBold text-body-l">Business summary</p>
            <div className="flex gap-2">
              {status === "PENDING" && (
                <>
                  <button className={gradient} onClick={() => setApproveModalOpen(true)}>
                    <p className="text-body-l font-medium text-white">Approve</p>
                  </button>
                  <button
                    className="border-red-2 bg-red-1 h-11 rounded-xl border px-5 text-center"
                    onClick={() => setRejectModalOpen(true)}
                  >
                    <p className="text-body-l font-medium text-white">Reject</p>
                  </button>
                </>
              )}
              {(status === "SUSPENDED" || status === "REJECTED" || status === "INACTIVE") && (
                <button className={gradient} onClick={() => setReactivateModalOpen(true)}>
                  <p className="text-body-l font-medium text-white">Reactivate business</p>
                </button>
              )}
              {status === "ACTIVE" && (
                <div className="relative" ref={flagRef}>
                  <button
                    type="button"
                    className="border-light-grey-50 flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2.5"
                    onClick={() => setFlagOpen((open) => !open)}
                  >
                    <span className="text-body-s font-medium">Flag business</span>
                    <ChevronDown />
                  </button>
                  {flagOpen && (
                    <ul className="absolute top-full right-0 z-40 mt-1 w-48 rounded-xl bg-white py-1 shadow-lg">
                      <li>
                        <button
                          type="button"
                          className="text-body-s w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
                          onClick={() => {
                            setFlagOpen(false);
                            setSuspendModalOpen(true);
                          }}
                        >
                          Restrict business
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="text-red-1 text-body-s w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
                          onClick={() => {
                            setFlagOpen(false);
                            setDeleteModalOpen(true);
                          }}
                        >
                          Delete business
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 p-5">
            <Row label="Business Owner">
              <span className="flex items-center gap-3">
                <AvatarName name={business?.owner?.name} image={business?.owner?.image} />
                {business?.owner && (
                  <Link
                    href={routes.USER_DETAIL(business.owner.id)}
                    className="text-light-green-70 whitespace-nowrap"
                  >
                    View profile
                  </Link>
                )}
              </span>
            </Row>
            <Row label="Business Id">{business?.unique_id}</Row>
            <Row label="Service Revenue">{naira(summary?.service_revenue)}</Row>
            <Row label="Service Completed">{summary?.services_completed ?? 0}</Row>
            <Row label="Service In Progress">{summary?.services_in_progress ?? 0}</Row>
            <Row label="Service Disputed">{summary?.services_disputed ?? 0}</Row>
            <Row label="Account Number">{summary?.bank?.account_number ?? "N/A"}</Row>
            <Row label="Account Holder">{summary?.bank?.account_name ?? "N/A"}</Row>
            <Row label="Bank Name">{summary?.bank?.bank_name ?? "N/A"}</Row>
          </div>
          <div className="border-t">
            <div className="grid grid-cols-2">
              {(["in-progress", "completed"] as const).map((key) => (
                <button
                  type="button"
                  key={key}
                  className={`text-body-s cursor-pointer py-3 text-center ${jobTab === key ? "border-light-green border-b-2 font-semibold" : "text-text-grey"}`}
                  onClick={() => setJobTab(key)}
                >
                  {key === "in-progress" ? "In-progress" : "Completed"}
                </button>
              ))}
            </div>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <JobItem
                  key={job.id}
                  job={job}
                  onOpen={() => push(routes.SERVICE_DETAIL(job.id))}
                />
              ))
            ) : (
              <p className="text-text-grey text-body-s p-5 text-center">No services yet.</p>
            )}
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
          <div className="relative flex flex-col items-center gap-1 rounded-xl bg-lime-100 p-6 text-center">
            {business?.boosted && (
              <span className="text-light-green-70 text-meta absolute top-3 right-4 flex items-center gap-1 font-medium">
                <RocketIcon className="h-3.5 w-3.5" /> Boosted
              </span>
            )}
            {business?.image && (
              <Image
                unoptimized
                src={business.image}
                alt={business.name}
                width={56}
                height={56}
                className="h-14 w-14 rounded-xl object-cover"
              />
            )}
            <p className="text-body-l font-semibold">{business?.name}</p>
            <p className="text-text-grey text-body-s">
              {[business?.city, business?.country].filter(Boolean).join(", ")}
            </p>
            {business?.service_rate_naira != null && (
              <p className="text-body-l font-semibold">{naira(business.service_rate_naira)}/hr</p>
            )}
            <p className="flex items-center gap-2">
              {business && (
                <span className={`text-body-s font-medium ${businessStatusClass(business.status)}`}>
                  {businessStatusLabel(business.status)}
                </span>
              )}
              {status === "SUSPENDED" && business?.rejection_reason && (
                <span className="text-meta rounded bg-white/70 px-2 py-0.5">
                  {business.rejection_reason}
                </span>
              )}
            </p>
            {typeof business?.rating === "number" && (
              <p className="text-body-s rounded-full bg-white px-3 py-1 font-medium">
                {business.rating.toFixed(1)}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-5 rounded-xl bg-white p-6">
            <div>
              <p className="text-body-l font-semibold">About business</p>
              <p className="text-light-black text-body-s mt-3 font-normal whitespace-pre-line">
                {about}
              </p>
              {isLongAbout && (
                <button
                  type="button"
                  className="text-light-green-70 text-body-s mt-1 cursor-pointer font-medium"
                  onClick={() => setAboutOpen((open) => !open)}
                >
                  {aboutOpen ? "Less" : "More"}
                </button>
              )}
            </div>
            <div className="border-t pt-5">
              <p className="text-body-l font-semibold">Business categories</p>
              <p className="text-body-s mt-3">{business?.categories?.join(", ")}</p>
            </div>
            <div className="border-t pt-5">
              <p className="text-body-l font-semibold">Services</p>
              <p className="text-body-s mt-3">{business?.services?.join(", ")}</p>
            </div>
            {business?.gallery && business.gallery.length > 0 && (
              <div className="border-t pt-5">
                <p className="text-body-l font-semibold">Portfolio Gallery</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {business.gallery.map((src) => (
                    <Image
                      key={src}
                      unoptimized
                      src={src}
                      alt={business.name}
                      width={160}
                      height={160}
                      className="h-40 w-40 rounded-lg object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
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
