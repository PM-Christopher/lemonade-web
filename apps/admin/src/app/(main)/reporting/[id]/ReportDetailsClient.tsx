"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { FormattedText } from "@lemonade/ui";
import MainLayout from "@/components/layouts/MainLayout";
import { AppDispatch, RootState } from "@/redux/store";
import { images } from "@/lib/images";
import { routes } from "@/lib/routes";
import { useReportDetailQuery } from "@/features/reporting/queries";
import {
  useDeleteReportContentMutation,
  useResolveReportMutation,
} from "@/features/reporting/mutations";
import type { ReportPreview } from "@/features/reporting/api";
import { GetStatusClass } from "@/utils/helper";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { reportStatusLabel } from "../ReportingClient";

const ConfirmReportActionModal = dynamic(
  () => import("@/modals/reporting/ConfirmReportActionModal"),
  { ssr: false },
);

// Moderation deletes threads (and the like); events and businesses are only shown.
const DELETABLE = ["thread", "threads", "forum", "forums", "tribe", "tribes"];

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

function Person({ person }: { person: { name: string; image: string | null } | null | undefined }) {
  if (!person) return <p className="text-body-s font-medium">Unknown</p>;
  return (
    <div className="flex items-center gap-2">
      <Image
        unoptimized
        src={person.image || images.AVATAR_1}
        alt=""
        width={20}
        height={20}
        className="h-5 w-5 rounded-full object-cover"
      />
      <p className="text-body-s font-medium">{person.name}</p>
    </div>
  );
}

function Content({ preview }: { preview: ReportPreview | null }) {
  if (!preview) {
    return <p className="text-text-grey text-body-s p-6 text-center">No content available</p>;
  }

  if (preview.type === "thread") {
    return (
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center gap-2">
          <Image
            unoptimized
            src={preview.author?.image || images.AVATAR_1}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
          <p className="text-body-s font-semibold">{preview.author?.name ?? "Unknown"}</p>
        </div>
        <p className="text-body-s font-semibold">{preview.topic}</p>
        <FormattedText text={preview.thoughts ?? ""} className="text-body-s font-normal" />
        <div className="flex flex-col gap-3">
          {preview.media.map((src) => (
            <Image
              unoptimized
              key={src}
              src={src}
              alt="Thread media"
              width={640}
              height={480}
              className="max-h-96 w-full rounded-xl object-cover"
            />
          ))}
          {preview.videos.map((src) => (
            <video key={src} src={src} controls className="max-h-96 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (preview.type === "event") {
    return (
      <div className="flex flex-col gap-3 p-6">
        {preview.image && (
          <Image
            unoptimized
            src={preview.image}
            alt={preview.name ?? "Event"}
            width={640}
            height={256}
            className="h-64 w-full rounded-xl object-cover"
          />
        )}
        <p className="text-title-l font-semibold">{preview.name}</p>
        {preview.starts_at && (
          <p className="text-body-s flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {dayjs(preview.starts_at).format("ddd, D MMM")}
          </p>
        )}
        {preview.starts_at && (
          <p className="text-body-s flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            {dayjs(preview.starts_at).format("hh:mmA")}
            {preview.ends_at ? ` - ${dayjs(preview.ends_at).format("hh:mmA")}` : ""}
          </p>
        )}
        {preview.location && (
          <p className="text-body-s flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            {preview.location}
          </p>
        )}
        <p className="text-body-s font-semibold">About Event</p>
        <FormattedText text={preview.description ?? ""} className="text-body-s font-normal" />
        <Person person={preview.owner} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-col items-center rounded-xl bg-[#f3f9d8] p-4">
        <Image
          unoptimized
          src={preview.image || images.BUSINESS_JOB_LOGO}
          alt={preview.name ?? "Business"}
          width={64}
          height={64}
          className="h-16 w-16 rounded-2xl object-cover"
        />
        <p className="text-body-l mt-2 font-semibold">{preview.name}</p>
        <p className="text-text-grey text-body-s">
          {[preview.city, preview.country].filter(Boolean).join(", ")}
        </p>
        {preview.service_rate_naira && (
          <p className="text-body-s font-semibold">
            ₦{Number(preview.service_rate_naira).toLocaleString()}/hr
          </p>
        )}
      </div>
      <div>
        <p className="text-body-l font-bold">About business</p>
        <FormattedText text={preview.description ?? ""} className="text-body-s mt-2" />
      </div>
      <div>
        <p className="text-body-l font-bold">Business categories</p>
        <p className="text-body-s mt-2">{preview.categories.join(", ")}</p>
      </div>
      <div>
        <p className="text-body-l font-bold">Services</p>
        <p className="text-body-s mt-2">{preview.services.join(", ")}</p>
      </div>
      {preview.gallery.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {preview.gallery.map((src) => (
            <Image
              unoptimized
              key={src}
              src={src}
              alt="Portfolio"
              width={150}
              height={150}
              className="h-36 w-36 rounded-sm object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReportDetailsClient({ id }: { id: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: detail } = useReportDetailQuery(id, { enabled: isLoggedIn });
  const report = detail?.report;
  const resolveMutation = useResolveReportMutation(id);
  const deleteMutation = useDeleteReportContentMutation(id);
  const [confirm, setConfirm] = useState<"resolve" | "delete" | null>(null);

  const isPending = report?.status === "pending";
  const isDeleted = report?.status === "deleted";
  const canDelete = isPending && DELETABLE.includes((report?.category ?? "").toLowerCase());
  const status = report ? reportStatusLabel(report.status) : "";
  // Events and businesses are actioned from their own admin pages.
  const category = (report?.category ?? "").toLowerCase();
  const reportedId = report?.content?.id;
  const openPath =
    isPending && reportedId
      ? category.startsWith("event")
        ? routes.EVENT_DETAIL(reportedId)
        : category.startsWith("business")
          ? routes.BUSINESS_DETAIL(reportedId)
          : null
      : null;
  const openLabel = category.startsWith("event") ? "Open event" : "Open business";
  const contentLabel = report?.preview?.type ?? "content";

  const notify = (message: string, type: "success" | "error") =>
    dispatch(
      updateToastifyReducer({
        show: true,
        message: type === "success" ? apiMessage(message) : message,
        type,
      }),
    );

  const resolve = () =>
    resolveMutation.mutate(undefined, {
      onSuccess: () => {
        notify("Report marked as resolved", "success");
        setConfirm(null);
      },
      onError: (error) => notify(error?.message || "Something went wrong", "error"),
    });

  const remove = () =>
    deleteMutation.mutate(
      { category: report?.category, category_id: report?.content?.id },
      {
        onSuccess: () => {
          notify("Content deleted", "success");
          setConfirm(null);
        },
        onError: (error) => notify(error?.message || "Something went wrong", "error"),
      },
    );

  return (
    <MainLayout>
      <section className="flex w-full max-w-full flex-col gap-4 overflow-x-hidden p-4 md:gap-5 md:p-5 lg:flex-row lg:items-start">
        <div className="flex h-fit w-full shrink-0 flex-col rounded-xl bg-white lg:w-150">
          <div className="border-b-grey-20 flex flex-col gap-5 border-b p-6">
            <Field label="Reported By">
              <Person person={report?.reported_by} />
            </Field>
            <Field label="Report ID">
              <p className="text-body-s font-medium">{report?.unique_id}</p>
            </Field>
            <Field label="Category">
              <p className="text-body-s font-medium capitalize">{report?.category}</p>
            </Field>
            <Field label="Case">
              <p className="text-body-s font-medium">{report?.case}</p>
            </Field>
            <Field label="Date Submitted">
              <p className="text-body-s font-medium">
                {report ? dayjs(report.date_submitted_iso).format("DD MMM, YYYY hh:mm A") : ""}
              </p>
            </Field>
            <Field label="Status">
              <p className={`text-body-s font-medium ${GetStatusClass(status)}`}>{status}</p>
            </Field>
            {report && !isPending && report.resolved_by && (
              <>
                <Field label="Resolved By">
                  <Person person={report.resolved_by} />
                </Field>
                {report.resolved_at_iso && (
                  <Field label="Resolved Date">
                    <p className="text-body-s font-medium">
                      {dayjs(report.resolved_at_iso).format("DD MMM, YYYY hh:mm A")}
                    </p>
                  </Field>
                )}
              </>
            )}
          </div>
          {isPending && (
            <div className="p-6">
              <button
                onClick={() => setConfirm("resolve")}
                className="border-step-color bg-gradient-green text-body-l w-full cursor-pointer rounded-xl border px-12 py-2.75 font-sans font-medium text-white"
                type="button"
              >
                Make as resolved
              </button>
            </div>
          )}
        </div>

        <div className="flex min-h-190 w-full min-w-0 flex-1 flex-col rounded-xl bg-white">
          <div className="border-b-grey-20 flex items-center justify-between border-b p-4.5">
            <p className="font-semiBold text-body-l">Content</p>
            {isDeleted ? (
              <span className="bg-red-1 rounded-lg px-3 py-1.5 text-sm font-medium text-white">
                Deleted
              </span>
            ) : openPath ? (
              <Link href={openPath} className="rounded-xl border p-2.5 px-3.5">
                <p className="text-body-s font-medium">{openLabel}</p>
              </Link>
            ) : canDelete ? (
              <button
                type="button"
                className="cursor-pointer rounded-xl border p-2.5 px-3.5"
                onClick={() => setConfirm("delete")}
              >
                <p className="text-body-s font-medium">Delete</p>
              </button>
            ) : null}
          </div>
          <Content preview={report?.preview ?? null} />
        </div>
      </section>
      <ConfirmReportActionModal
        isOpen={confirm === "resolve"}
        toggle={() => setConfirm(null)}
        title="Mark as resolved"
        body="Make sure you resolve the issue before marking it as resolved."
        confirmLabel="Resolve"
        tone="green"
        pending={resolveMutation.isPending}
        onConfirm={resolve}
      />
      <ConfirmReportActionModal
        isOpen={confirm === "delete"}
        toggle={() => setConfirm(null)}
        title={`Delete ${contentLabel}`}
        body={`Are you sure you want to delete this ${contentLabel}?`}
        confirmLabel="Delete"
        tone="red"
        pending={deleteMutation.isPending}
        onConfirm={remove}
      />
    </MainLayout>
  );
}

export default ReportDetailsClient;
