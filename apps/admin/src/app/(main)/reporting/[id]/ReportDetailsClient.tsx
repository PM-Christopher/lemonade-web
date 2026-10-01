"use client";
import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useReportDetailQuery } from "@/features/reporting/queries";
import {
  useDeleteReportContentMutation,
  useResolveReportMutation,
} from "@/features/reporting/mutations";
import { capitalizeWords } from "@/utils/helper";
import { updateToastifyReducer } from "@/redux/toastifySlice";

// report.content isn't a JSON string despite old code here treating it like
// one (see api.ts's own comment on ReportDetail.content) — the backend
// returns the reported model already decoded, so JSON.parse(report.content)
// always threw and silently fell into the catch block below, never actually
// rendering a preview. Reading it directly instead.
interface ReportedEventPreview {
  event_image?: string;
  event_name?: string;
  category?: string;
  location?: string;
  event_date?: string;
  event_time?: string;
  created_at?: string;
  description?: string;
  owner?: { image?: string; fullname?: string };
}

function ReportDetailsClient({ id }: { id: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const { data: detail } = useReportDetailQuery(id, { enabled: isLoggedIn });
  const report = detail?.report;

  const resolveMutation = useResolveReportMutation(id);
  const deleteMutation = useDeleteReportContentMutation(id);

  const content = report?.content;
  const event: ReportedEventPreview | null =
    content && typeof content === "object" && "events" in content
      ? ((content as { events: ReportedEventPreview }).events ?? null)
      : null;

  const resolve = () => {
    resolveMutation.mutate(undefined, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Report marked as resolved",
            type: "success",
          }),
        );
      },
      onError: (error) => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error?.message || "error",
            type: "error",
          }),
        );
      },
    });
  };
  const handleDelete = () => {
    const data = {
      category: report?.category,
      category_id: (report?.content as { id?: string | number } | undefined)?.id,
    };
    deleteMutation.mutate(data, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Report deleted successfully",
            type: "success",
          }),
        );
      },
      onError: (error) => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error?.message || "error",
            type: "error",
          }),
        );
      },
    });
  };

  return (
    <MainLayout>
      <section className="flex w-full max-w-full flex-row gap-4 overflow-x-hidden p-4 md:gap-5 md:p-5 lg:flex-col">
        <div className={"flex h-fit w-[800px] flex-col rounded-xl bg-white"}>
          <div className={"border-b-grey-20 flex flex-col gap-5 border-b p-6"}>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Reported By:</p>
              </div>
              <div className={"flex gap-1"}>
                <p className={"text-[14px] font-medium"}>{report?.reported_by?.name}</p>
              </div>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Report ID:</p>
              </div>
              <p className={"text-[14px] font-medium"}>RE112332</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Category:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{capitalizeWords(report?.category)}</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Case:</p>
              </div>
              <div className={"flex gap-1"}>
                <p className={"text-[14px] font-medium"}>{report?.case}</p>
              </div>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Date Submitted:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{report?.date_submitted}</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Status:</p>
              </div>
              <p className={"text-warning-bold text-[14px] font-medium"}>
                {capitalizeWords(report?.status)}
              </p>
            </div>
          </div>
          <div className={"p-6"}>
            <button
              onClick={resolve}
              className={
                "border-step-color bg-gradient-green w-full rounded-xl border px-12 py-[11px] font-sans text-[16px] font-medium text-white"
              }
              type={"button"}
            >
              Mark as resolved
            </button>
          </div>
        </div>
        <div className={"flex h-[762px] w-full flex-col rounded-xl bg-white lg:w-2/3"}>
          <div className={"border-b-grey-20 flex items-center justify-between border-b p-[18px]"}>
            <p className={"font-semiBold text-[16px]"}>Content</p>
            <div className={"cursor-pointer rounded-xl border p-2.5 px-3.5"} onClick={handleDelete}>
              <p className={"text-[14px] font-medium"}>Delete</p>
            </div>
          </div>

          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
            {event ? (
              <div className="space-y-4">
                {/* Event Image */}
                <img
                  src={event.event_image}
                  alt={event.event_name}
                  className="h-64 w-full rounded-xl object-cover"
                />

                {/* Event Info */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{event.event_name}</h2>
                  <p className="text-sm text-gray-500">
                    {event.category} • {event.location}
                  </p>
                </div>

                {/* Organizer */}
                <div className="flex items-center gap-3">
                  <img
                    src={event.owner?.image}
                    alt={event.owner?.fullname}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <p className="font-medium text-gray-700">{event.owner?.fullname}</p>
                </div>

                {/* Date and Time */}
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>Date:</strong> {event.event_date}
                  </p>
                  <p>
                    <strong>Time:</strong> {event.event_time}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {event.created_at ? new Date(event.created_at).toLocaleString() : "—"}
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-800">{event.description}</p>
              </div>
            ) : (
              <p className="text-center text-gray-500">No content available</p>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default ReportDetailsClient;
