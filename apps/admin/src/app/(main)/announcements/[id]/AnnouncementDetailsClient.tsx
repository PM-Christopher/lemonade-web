"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { FormattedText } from "@lemonade/ui";
import { RootState } from "@/redux/store";
import { useAnnouncementDetailQuery } from "@/features/announcements/queries";
import { GetStatusClass } from "@/utils/helper";

const AnnouncementModal = dynamic(() => import("@/modals/announcements/AnnouncementModal"), {
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

function AnnouncementDetailsClient({ id }: { id: string }) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: detail } = useAnnouncementDetailQuery(id, { enabled: isLoggedIn });
  const announcement = detail?.announcement;
  const [editOpen, setEditOpen] = useState(false);

  const isDraft = announcement?.status === "draft";
  const canEdit = announcement !== undefined && announcement.status !== "sent";
  const status =
    announcement?.status === "pending"
      ? "Scheduled"
      : announcement
        ? announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)
        : "";

  return (
    <>
      <section className="flex justify-between gap-5 p-5">
        <div className="flex h-fit w-100 shrink-0 flex-col rounded-xl bg-white">
          <div className="flex flex-col gap-5 p-6">
            <Field label="Created By">
              <div className="flex items-center gap-2">
                {announcement?.created_by.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={announcement.created_by.image}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                  />
                )}
                <p className="text-body-s font-medium">{announcement?.created_by.name}</p>
              </div>
            </Field>
            <Field label="Announcement Id">
              <p className="text-body-s font-medium">{announcement?.unique_id}</p>
            </Field>
            <Field label="Date Created">
              <p className="text-body-s font-medium">
                {announcement
                  ? dayjs(announcement.created_at_iso).format("DD MMM, YYYY hh:mm A")
                  : ""}
              </p>
            </Field>
            {announcement?.status === "pending" && (
              <Field label="Goes out">
                <p className="text-body-s font-medium">
                  {dayjs(announcement.scheduled_at).format("DD MMM, YYYY hh:mm A")}
                </p>
              </Field>
            )}
            <Field label="Status">
              <p className={`text-body-s font-medium ${GetStatusClass(status)}`}>{status}</p>
            </Field>
          </div>
        </div>

        <div className="flex h-fit min-w-0 flex-1 flex-col gap-4 rounded-xl bg-white">
          <div className="flex items-center justify-between border-b p-6">
            <p className="font-semiBold text-body-l">Announcement</p>
            {canEdit && (
              <button
                type="button"
                className="border-light-grey-50 cursor-pointer rounded-xl border p-2.5 px-3.5"
                onClick={() => setEditOpen(true)}
              >
                <p className="text-body-s font-medium">{isDraft ? "Edit draft" : "Edit"}</p>
              </button>
            )}
          </div>
          <div className="flex flex-col gap-3 px-6 pb-8">
            <p className="text-text-grey text-meta">Title</p>
            <p className="text-body-l font-semibold">{announcement?.title}</p>
            <p className="text-text-grey text-meta">Body</p>
            <FormattedText text={announcement?.content ?? ""} className="text-body-s font-normal" />
          </div>
        </div>
      </section>
      {announcement && (
        <AnnouncementModal
          isOpen={editOpen}
          toggle={() => setEditOpen(false)}
          announcement={announcement}
        />
      )}
    </>
  );
}

export default AnnouncementDetailsClient;
