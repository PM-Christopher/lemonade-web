"use client";
import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useReportDetailQuery } from "@/features/reporting/queries";
import {
  useDeleteReportContentMutation,
  useResolveReportMutation,
} from "@/features/reporting/mutations";
import { capitalizeWords } from "@/utils/helper";
import { updateToastifyReducer } from "@/redux/toastifySlice";

function ReportDetailsPage() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const id = params.id
    ? Array.isArray(params.id)
      ? parseInt(params.id[0])
      : parseInt(params.id)
    : undefined;

  const { data: detail } = useReportDetailQuery(id, { enabled: isLoggedIn });
  const report = detail?.report;

  const resolveMutation = useResolveReportMutation(id);
  const deleteMutation = useDeleteReportContentMutation(id);

  let event = null;

  try {
    const parsedContent = JSON.parse(report?.content || "{}");
    event = parsedContent.events;
  } catch (error) {
    console.error("Failed to parse report content", error);
  }

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
      category_id: (report?.content as any)?.id,
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
      <section className="md:p-5 lg:flex-col md:gap-5 flex w-full max-w-full flex-row gap-4 overflow-x-hidden p-4">
        <div className={"flex h-fit w-[800px] flex-col rounded-[12px] bg-white"}>
          <div className={"flex flex-col gap-[20px] border-b-[1px] border-b-grey-20 p-[24px]"}>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Reported By:</p>
              </div>
              <div className={"flex gap-[4px]"}>
                <p className={"text-[14px] font-medium"}>{report?.reported_by?.name}</p>
              </div>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Report ID:</p>
              </div>
              <p className={"text-[14px] font-medium"}>RE112332</p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Category:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{capitalizeWords(report?.category)}</p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Case:</p>
              </div>
              <div className={"flex gap-[4px]"}>
                <p className={"text-[14px] font-medium"}>{report?.case}</p>
              </div>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Date Submitted:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{report?.date_submitted}</p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Status:</p>
              </div>
              <p className={"text-[14px] font-medium text-warning-bold"}>
                {capitalizeWords(report?.status)}
              </p>
            </div>
          </div>
          <div className={"p-[24px]"}>
            <button
              onClick={resolve}
              className={
                "w-full rounded-[12px] border-[1px] border-step-color bg-gradient-green px-[48px] py-[11px] font-sans text-[16px] font-medium text-white"
              }
              type={"button"}
            >
              Mark as resolved
            </button>
          </div>
        </div>
        <div className={"lg:w-2/3 flex h-[762px] w-full flex-col rounded-[12px] bg-white"}>
          <div
            className={"flex items-center justify-between border-b-[1px] border-b-grey-20 p-[18px]"}
          >
            <p className={"text-[16px] font-semiBold"}>Content</p>
            <div
              className={"cursor-pointer rounded-[12px] border-[1px] p-[10px] px-[14px]"}
              onClick={handleDelete}
            >
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
                    src={event.owner.image}
                    alt={event.owner.fullname}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <p className="font-medium text-gray-700">{event.owner.fullname}</p>
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
                    <strong>Created At:</strong> {new Date(event.created_at).toLocaleString()}
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

export default ReportDetailsPage;
