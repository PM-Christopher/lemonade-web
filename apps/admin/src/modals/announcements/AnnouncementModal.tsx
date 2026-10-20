"use client";
import React, { useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContentBare,
  DialogTitle,
  FieldError,
  Input,
  Label,
  RichTextField,
} from "@lemonade/ui";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { applyServerErrors } from "@/lib/form-errors";
import { announcementsApi, type AnnouncementRow } from "@/features/announcements/api";
import { useSaveAnnouncementMutation } from "@/features/announcements/mutations";
import { announcementSchema, type AnnouncementInput } from "@/features/announcements/schema";

const ScheduleModal = dynamic(() => import("@/modals/announcements/ScheduleModal"), {
  ssr: false,
});

interface AnnouncementModalProps {
  isOpen: boolean;
  toggle: () => void;
  // Set to edit a draft or scheduled announcement.
  announcement?: AnnouncementRow;
}

const utc = (when: Date) => when.toISOString().slice(0, 19).replace("T", " ");

function AnnouncementModal({ isOpen, toggle, announcement }: AnnouncementModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isEditing = announcement !== undefined;
  const wasDraft = announcement?.status === "draft";
  const saveMutation = useSaveAnnouncementMutation(announcement?.id);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<AnnouncementInput>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: "", content: "" },
    mode: "onTouched",
  });

  // Start from the announcement being edited each time the dialog opens.
  useEffect(() => {
    if (isOpen) {
      reset({ title: announcement?.title ?? "", content: announcement?.content ?? "" });
    }
  }, [isOpen, announcement, reset]);

  const send = (values: AnnouncementInput, draft: boolean, when?: Date) => {
    saveMutation.mutate(
      { ...values, draft, ...(when ? { date_scheduled: utc(when) } : {}) },
      {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: apiMessage(draft ? "Draft saved" : "Announcement scheduled"),
              type: "success",
            }),
          );
          setScheduleOpen(false);
          toggle();
        },
        onError: (error) => {
          setScheduleOpen(false);
          if (applyServerErrors(error, setError, ["title", "content"])) return;
          dispatch(
            updateToastifyReducer({
              show: true,
              message: error?.message || "Something went wrong",
              type: "error",
            }),
          );
        },
      },
    );
  };

  // A scheduled announcement keeps its place in the queue when only the text changes.
  const saveChanges = handleSubmit((values) => send(values, isEditing ? wasDraft : true));
  const openSchedule = handleSubmit(() => setScheduleOpen(true));

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) toggle();
        }}
      >
        <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">
            {isEditing ? "Edit announcement" : "Create announcement"}
          </DialogTitle>
          <div className="flex max-h-[92vh] w-200 max-w-[94vw] flex-col rounded-xl bg-white">
            <div className="border-b-grey-20 flex items-center justify-between border-b p-5">
              <p className="text-body-l font-sans font-semibold">
                {isEditing ? "Edit announcement" : "Create announcement"}
              </p>
              <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </button>
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto p-5">
              <div className="grid gap-1.5">
                <Label
                  htmlFor="announcement-title"
                  className="text-text-grey text-meta font-normal"
                >
                  Title
                </Label>
                <Input
                  id="announcement-title"
                  className="form-font bg-light_grey h-12 rounded-xl border-0"
                  {...register("title")}
                />
                <FieldError message={errors.title?.message} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="announcement-body" className="text-text-grey text-meta font-normal">
                  Body
                </Label>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <RichTextField
                      id="announcement-body"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      onUploadImage={announcementsApi.uploadMedia}
                      onUploadVideo={announcementsApi.uploadMedia}
                      heightClass="h-72"
                    />
                  )}
                />
                <FieldError message={errors.content?.message} />
              </div>
            </div>
            <div className="border-t-grey-20 flex gap-3 border-t p-5">
              <button
                type="button"
                className="border-light-grey-50 h-10 rounded-xl border bg-white px-4 disabled:opacity-60"
                onClick={saveChanges}
                disabled={saveMutation.isPending}
              >
                <p className="text-body-s font-medium text-black">
                  {isEditing ? "Save changes" : "Save as draft"}
                </p>
              </button>
              <button
                type="button"
                className="border-step-color bg-gradient-green h-10 rounded-xl border px-6 disabled:opacity-60"
                onClick={openSchedule}
                disabled={saveMutation.isPending}
              >
                <p className="text-body-s font-medium text-white">Schedule</p>
              </button>
            </div>
          </div>
        </DialogContentBare>
      </Dialog>
      {scheduleOpen && (
        <ScheduleModal
          isOpen={scheduleOpen}
          toggle={() => setScheduleOpen(false)}
          initial={
            announcement?.status === "pending" ? new Date(announcement.scheduled_at) : undefined
          }
          onSave={(when) => void handleSubmit((values) => send(values, false, when))()}
        />
      )}
    </>
  );
}

export default AnnouncementModal;
