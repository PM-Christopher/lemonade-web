"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";

import MainLayout from "@/components/layouts/MainLayout";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import LocationIcon from "@/images/icons/location-large.svg";
import WebIcon from "@/images/icons/world.svg";
import CalendarIcon from "@/images/icons/calendar.svg";
import ClockIcon from "@/images/icons/clock.svg";
import AffiliateUsersIcon from "@/images/icons/affiliate_users.svg";
import AttachmentIcon from "@/images/icons/attachments.svg";
import FacebookIcon from "@/images/icons/facebook-color.svg";
import LinkedInIcon from "@/images/icons/linkedin-color.svg";
import TwitterIcon from "@/images/icons/twitter-color.svg";
import InstagramIcon from "@/images/icons/instagram-color.svg";

import Switch from "react-switch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { SingleFileUploader } from "@/components/global/FileUploader";
import { Label, Input } from "@lemonade/ui";
import { FlatButton } from "@/components/global/FlatButton";

import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useAppDispatch } from "@/redux/hook";
import { useEventQuery } from "@/features/events/queries";
import { useUpdateEventMutation } from "@/features/events/mutations";
import { getTimeZones } from "@/lib/helper";
import { EventFormSkeleton } from "@/components/Skeletons";

type SocialMediaHandles = {
  instagram: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  website: string;
};

type EventFormValues = {
  event_image: string;
  event_name: string;
  event_description: string;
  category: string;
  event_type: "" | "physical" | "online";
  location: string;
  hosting_platform: string;
  meeting_link: string;
  meeting_passcode: string;
  time_zone: string;
  start_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_date: string; // YYYY-MM-DD
  end_time: string; // HH:mm
  affiliate_program: boolean;
  commission: string; // keep string for inputs, cast on submit
  socials: SocialMediaHandles;
};

const EMPTY_SOCIALS: SocialMediaHandles = {
  instagram: "",
  linkedin: "",
  facebook: "",
  twitter: "",
  website: "",
};

const parseDateTime = (value?: string | null) => {
  if (!value) return { date: "", time: "" };

  // supports "YYYY-MM-DD HH:mm:ss" or "YYYY-MM-DDTHH:mm:ss" or "YYYY-MM-DD HH:mm"
  const normalized = value.replace("T", " ");
  const [date = "", timeRaw = ""] = normalized.split(" ");
  const time = timeRaw ? timeRaw.slice(0, 5) : "";
  return { date, time };
};

const toISODate = (date: Date) => {
  // Convert to local YYYY-MM-DD
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().split("T")[0];
};

const timeStringToDate = (timeStr: string, base = new Date()) => {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date(base);
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
};

const schema = yup.object({
  event_image: yup.string().required("Image is required"),
  event_name: yup.string().required("Event name is required"),
  event_description: yup.string().required("Description is required"),
  category: yup.string().required("Category is required"),
  event_type: yup
    .string()
    .oneOf(["physical", "online"])
    .required("Event type is required"),

  location: yup.string().when("event_type", {
    is: "physical",
    then: (s) => s.required("Location is required"),
    otherwise: (s) => s.optional(),
  }),

  hosting_platform: yup.string().when("event_type", {
    is: "online",
    then: (s) => s.required("Hosting platform is required"),
    otherwise: (s) => s.optional(),
  }),

  meeting_link: yup.string().when("event_type", {
    is: "online",
    then: (s) =>
      s
        .required("Meeting link is required")
        .url("Meeting link must be a valid url"),
    otherwise: (s) => s.optional(),
  }),

  meeting_passcode: yup.string().when("event_type", {
    is: "online",
    then: (s) => s.required("Meeting passcode is required"),
    otherwise: (s) => s.optional(),
  }),

  time_zone: yup.string().required("Time zone is required"),
  start_date: yup.string().required("Start date is required"),
  start_time: yup.string().required("Start time is required"),
  end_date: yup.string().required("End date is required"),
  end_time: yup.string().required("End time is required"),

  affiliate_program: yup.boolean().required(),
  commission: yup
    .number()
    .transform((val, raw) => (raw === "" ? undefined : val))
    .when("affiliate_program", {
      is: true,
      then: (s) =>
        s
          .typeError("Commission must be a number")
          .required("Commission rate is required")
          .min(0),
      otherwise: (s) => s.optional(),
    }),
});

const buildInitialValues = (event?: any): EventFormValues => {
  const start = parseDateTime(event?.start_date);
  const end = parseDateTime(event?.end_date);

  const socialsArray = Array.isArray(event?.socials) ? event.socials : [];
  const socialsObj = socialsArray.reduce(
    (acc: SocialMediaHandles, item: any) => {
      if (item?.name && item?.name in EMPTY_SOCIALS) {
        (acc as any)[item.name] = item.value ?? "";
      }
      return acc;
    },
    { ...EMPTY_SOCIALS },
  );

  return {
    event_image: event?.event_image ?? "",
    event_name: event?.event_name ?? "",
    event_description: event?.event_description ?? "",
    category: event?.category ?? "",
    event_type: event?.event_type ?? "",
    location: event?.location ?? "",
    hosting_platform: event?.hosting_platform ?? "",
    meeting_link: event?.meeting_link ?? "",
    meeting_passcode: event?.meeting_passcode ?? "",
    time_zone: event?.time_zone ?? "",
    start_date: start.date,
    start_time: start.time,
    end_date: end.date,
    end_time: end.time,
    affiliate_program: Boolean(event?.affiliate_program),
    commission: event?.commission != null ? String(event.commission) : "",
    socials: socialsObj,
  };
};

const EditEventClient = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const eventId = Number(id);
  const {
    data: eventData,
    isLoading: loading,
    refetch,
  } = useEventQuery(eventId);
  const event = eventData?.event;
  const updateEventMutation = useUpdateEventMutation(eventId);

  useEffect(() => {
    if (!Number.isFinite(eventId)) return;

    // ✅ when returning via browser back/forward cache
    const onPageShow = () => refetch();
    window.addEventListener("pageshow", onPageShow);

    // ✅ when tab becomes visible again
    const onVisibility = () => {
      if (!document.hidden) refetch();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [eventId, refetch]);

  useEffect(() => {
    if (!event) return;
    if (Number(event?.id) !== eventId) return;

    formik.resetForm({ values: buildInitialValues(event) });
    // formik's returned object is recreated on every keystroke (it embeds
    // current values/errors), so adding it here would re-reset the form
    // on every render, discarding the user's own edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, event]);

  const timeZones = useMemo(() => getTimeZones(), []);
  const now = useMemo(() => new Date(), []);
  const startOfDay = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const endOfDay = useMemo(() => {
    const d = new Date();
    d.setHours(23, 45, 0, 0);
    return d;
  }, []);

  const formik = useFormik<EventFormValues>({
    enableReinitialize: true,
    initialValues: buildInitialValues(event),
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        const filteredSocials = (
          Object.keys(values.socials) as Array<keyof SocialMediaHandles>
        )
          .filter((key) => Boolean(values.socials[key]))
          .map((key) => ({ name: key, value: values.socials[key] }));

        const payload = {
          event: {
            event_image: values.event_image,
            event_name: values.event_name,
            event_description: values.event_description,
            category: values.category,
            event_type: values.event_type,
            location: values.location,
            hosting_platform: values.hosting_platform,
            meeting_link: values.meeting_link,
            meeting_passcode: values.meeting_passcode,
            time_zone: values.time_zone,
            start_date: `${values.start_date}T${values.start_time}`,
            end_date: `${values.end_date}T${values.end_time}`,
            affiliate_program: values.affiliate_program,
            commission: values.affiliate_program
              ? Number(values.commission)
              : null,
            socials: filteredSocials,
          },
        };

        await updateEventMutation.mutateAsync(payload);

        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Event updated successfully",
            type: "success",
          }),
        );
        router.push("/event");
      } catch (e: any) {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: e?.message ?? "Error updating event",
            type: "error",
          }),
        );
      }
    },
  });

  const isOnline = formik.values.event_type === "online";
  const isPhysical = formik.values.event_type === "physical";
  const affiliateEnabled = Boolean(formik.values.affiliate_program);

  const isStartToday =
    formik.values.start_date &&
    new Date(formik.values.start_date).toDateString() === now.toDateString();

  const startMinTime = isStartToday ? now : startOfDay;

  const endMinTime = (() => {
    if (!formik.values.end_date) return startOfDay;

    const endIsToday =
      new Date(formik.values.end_date).toDateString() === now.toDateString();
    const base = endIsToday ? now : startOfDay;

    if (
      formik.values.start_date &&
      formik.values.end_date === formik.values.start_date &&
      formik.values.start_time
    ) {
      const st = timeStringToDate(formik.values.start_time);
      return st > base ? st : base;
    }

    return base;
  })();

  const ready = !loading && event && Number(event?.id) === eventId;

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between border-b-[1px] border-t-[1px] border-b-grey-20 border-t-grey-20 bg-white p-[12px] px-10">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-[12px] p-[4px] pl-[4px] pr-[16px]"
            onClick={() => router.push("/event")}
          >
            <ChevronLeft />
            <p className="font-sans text-[16px] font-semibold tracking-custom">
              Edit event
            </p>
          </button>
        </div>

        <section className="mt-4 flex flex-col items-center">
          {!ready ? (
            <EventFormSkeleton />
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <div className="mt-10 flex w-[640px] flex-col rounded-[12px] bg-white p-[48px]">
                <p className="font-sans text-[12px] font-bold leading-[14.4px] text-light-black">
                  EVENT DETAILS
                </p>

                <SingleFileUploader
                  length="single"
                  type="event"
                  setField={formik}
                  image={event?.event_image}
                  title="Upload event image"
                />

                {/* Event name */}
                <div className="mt-[24px] grid gap-2">
                  <Label
                    htmlFor="event-name"
                    className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                  >
                    Event name
                  </Label>
                  <Input
                    id="event-name"
                    name="event_name"
                    type="text"
                    className="form-font h-12 rounded-xl border-0 bg-light_grey"
                    value={formik.values.event_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                {/* Description */}
                <div className="mt-[24px] grid gap-2">
                  <Label
                    htmlFor="event-description"
                    className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                  >
                    Event description
                  </Label>
                  <textarea
                    id="event-description"
                    className="form-font h-[131px] resize-none rounded-xl border-0 bg-light_grey p-4"
                    value={formik.values.event_description}
                    onChange={(e) =>
                      formik.setFieldValue("event_description", e.target.value)
                    }
                    onBlur={formik.handleBlur}
                  />
                </div>

                {/* Category */}
                <div className="mt-[24px] grid gap-2">
                  <Label
                    htmlFor="event-category"
                    className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                  >
                    Event category
                  </Label>
                  <select
                    id="event-category"
                    name="category"
                    className="form-font h-12 rounded-xl border-0 bg-light_grey px-2"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select category</option>
                    <option value="spirituality">Spirituality</option>
                    <option value="summer">Summer</option>
                  </select>
                </div>

                {/* Event type */}
                <p className="mt-[48px] font-sans text-[12px] font-bold leading-[14.4px] text-light-black">
                  EVENT TYPE
                </p>

                <div className="mt-[16px] flex gap-2">
                  <button
                    type="button"
                    className={`flex items-center gap-2 rounded-[12px] p-[12px] px-[16px] ${
                      isPhysical
                        ? "bg-gradient-green-2 shadow-event-custom"
                        : "bg-light_grey text-text-grey"
                    }`}
                    onClick={() =>
                      formik.setFieldValue("event_type", "physical")
                    }
                  >
                    <LocationIcon />
                    <p className="font-sans text-[14px] font-normal leading-[21px] tracking-custom">
                      Physical
                    </p>
                  </button>

                  <button
                    type="button"
                    className={`flex items-center gap-2 rounded-[12px] p-[12px] px-[16px] ${
                      isOnline
                        ? "bg-gradient-green-2 shadow-event-custom"
                        : "bg-light_grey text-text-grey"
                    }`}
                    onClick={() => formik.setFieldValue("event_type", "online")}
                  >
                    <WebIcon />
                    <p className="font-sans text-[14px] font-normal leading-[21px] tracking-custom">
                      Online
                    </p>
                  </button>
                </div>

                {/* Physical */}
                {isPhysical && (
                  <div className="mt-[24px] grid gap-2">
                    <Label
                      htmlFor="event-location"
                      className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                    >
                      Event location
                    </Label>
                    <div className="flex items-center gap-3 rounded-[12px] bg-light_grey p-2 px-[12px]">
                      <LocationIcon />
                      <input
                        id="event-location"
                        name="location"
                        type="text"
                        className="w-full rounded-xl border-0 bg-light_grey text-[14px] focus:border-transparent focus:outline-none focus:ring-0"
                        placeholder="Enter location..."
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                  </div>
                )}

                {/* Online */}
                {isOnline && (
                  <>
                    <div className="mt-[24px] grid gap-2">
                      <Label
                        htmlFor="hosting_platform"
                        className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                      >
                        Meeting Platform
                      </Label>
                      <select
                        id="hosting_platform"
                        name="hosting_platform"
                        className="form-font h-12 rounded-xl border-0 bg-light_grey px-2"
                        value={formik.values.hosting_platform}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="">Select platform</option>
                        <option value="google-meet">Google Meet</option>
                      </select>
                    </div>

                    <div className="mt-[24px] grid gap-2">
                      <Label
                        htmlFor="meeting_link"
                        className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                      >
                        Meeting link
                      </Label>
                      <Input
                        id="meeting_link"
                        name="meeting_link"
                        type="text"
                        className="form-font h-12 rounded-xl border-0 bg-light_grey"
                        value={formik.values.meeting_link}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                    <div className="mt-[24px] grid gap-2">
                      <Label
                        htmlFor="meeting_passcode"
                        className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                      >
                        Meeting passcode
                      </Label>
                      <Input
                        id="meeting_passcode"
                        name="meeting_passcode"
                        type="text"
                        className="form-font h-12 rounded-xl border-0 bg-light_grey"
                        value={formik.values.meeting_passcode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                  </>
                )}

                {/* Time zone */}
                <div className="mt-[24px] grid gap-2">
                  <Label
                    htmlFor="time_zone"
                    className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                  >
                    Event time zone
                  </Label>
                  <select
                    id="time_zone"
                    name="time_zone"
                    className="form-font h-12 rounded-xl border-0 bg-light_grey px-2"
                    value={formik.values.time_zone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select time zone</option>
                    {timeZones.map((tz, idx) => (
                      <option value={tz.timeZone} key={idx}>
                        {tz.timeZone} - {tz.gmt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start */}
                <div className="mt-[24px] grid gap-2">
                  <Label className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey">
                    Start date
                  </Label>

                  <div className="flex justify-between gap-3">
                    <div className="flex w-full flex-col gap-[4px]">
                      <div className="flex h-[40px] w-full items-center gap-3 rounded-[12px] bg-light_grey px-[16px]">
                        <CalendarIcon />
                        <DatePicker
                          selected={
                            formik.values.start_date
                              ? new Date(formik.values.start_date)
                              : null
                          }
                          onChange={(date: Date | null) => {
                            formik.setFieldValue(
                              "start_date",
                              date ? toISODate(date) : "",
                            );
                          }}
                          minDate={now}
                          dateFormat="yyyy-MM-dd"
                          className="w-full cursor-pointer border-none bg-light_grey px-[10px] font-sans text-[12px] font-semi-normal shadow-none focus:outline-none focus:ring-0"
                          placeholderText="From"
                        />
                      </div>
                      {formik.touched.start_date &&
                        formik.errors.start_date && (
                          <p className="text-left text-[12px] text-[#FF8D8D]">
                            {formik.errors.start_date}
                          </p>
                        )}
                    </div>

                    <div className="flex w-full flex-col gap-[4px]">
                      <div className="flex h-[40px] w-full items-center gap-3 rounded-[12px] bg-light_grey px-[16px]">
                        <ClockIcon />
                        <DatePicker
                          selected={
                            formik.values.start_time
                              ? timeStringToDate(formik.values.start_time)
                              : null
                          }
                          onChange={(date: Date | null) => {
                            if (!date) return;
                            const t = date.toTimeString().slice(0, 5);
                            formik.setFieldValue("start_time", t);
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          timeCaption="Start Time"
                          timeIntervals={15}
                          dateFormat="h:mm aa"
                          className="w-full cursor-pointer border-none bg-light_grey px-[10px] font-sans text-[12px] font-semi-normal shadow-none focus:outline-none focus:ring-0"
                          placeholderText="Start Time"
                          minTime={startMinTime}
                          maxTime={endOfDay}
                        />
                      </div>
                      {formik.touched.start_time &&
                        formik.errors.start_time && (
                          <p className="text-left text-[12px] text-[#FF8D8D]">
                            {formik.errors.start_time}
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* End */}
                <div className="mt-[24px] grid gap-2">
                  <Label className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey">
                    End date
                  </Label>

                  <div className="flex justify-between gap-3">
                    <div className="flex w-full flex-col gap-[4px]">
                      <div className="flex h-[40px] w-full items-center gap-3 rounded-[12px] bg-light_grey px-[16px]">
                        <CalendarIcon />
                        <DatePicker
                          selected={
                            formik.values.end_date
                              ? new Date(formik.values.end_date)
                              : null
                          }
                          onChange={(date: Date | null) => {
                            formik.setFieldValue(
                              "end_date",
                              date ? toISODate(date) : "",
                            );
                          }}
                          minDate={
                            formik.values.start_date
                              ? new Date(formik.values.start_date)
                              : now
                          }
                          dateFormat="yyyy-MM-dd"
                          placeholderText="End Date"
                          className="w-full cursor-pointer border-none bg-light_grey px-[10px] font-sans text-[12px] font-semi-normal shadow-none focus:outline-none focus:ring-0"
                        />
                      </div>
                      {formik.touched.end_date && formik.errors.end_date && (
                        <p className="text-left text-[12px] text-[#FF8D8D]">
                          {formik.errors.end_date}
                        </p>
                      )}
                    </div>

                    <div className="flex w-full flex-col gap-[4px]">
                      <div className="flex h-[40px] w-full items-center gap-3 rounded-[12px] bg-light_grey px-[16px]">
                        <ClockIcon />
                        <DatePicker
                          selected={
                            formik.values.end_time
                              ? timeStringToDate(formik.values.end_time)
                              : null
                          }
                          onChange={(date: Date | null) => {
                            if (!date) return;
                            const t = date.toTimeString().slice(0, 5);
                            formik.setFieldValue("end_time", t);
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="End Time"
                          dateFormat="h:mm aa"
                          placeholderText="End Time"
                          minTime={endMinTime}
                          maxTime={endOfDay}
                          className="w-full cursor-pointer border-none bg-light_grey px-[10px] font-sans text-[12px] font-semi-normal shadow-none focus:outline-none focus:ring-0"
                        />
                      </div>
                      {formik.touched.end_time && formik.errors.end_time && (
                        <p className="text-left text-[12px] text-[#FF8D8D]">
                          {formik.errors.end_time}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Affiliate */}
                <p className="mt-[48px] font-sans text-[12px] font-bold leading-[14.4px] text-light-black">
                  AFFILIATE PROGRAM
                </p>

                <div className="mt-[28px] flex justify-between">
                  <div className="flex gap-2">
                    <div className="mt-1">
                      <AffiliateUsersIcon />
                    </div>
                    <div className="flex flex-col">
                      <p className="font-sans text-[16px] font-normal leading-[24px] tracking-custom">
                        Enable Affiliate program
                      </p>
                      <p className="font-sans text-[12px] font-normal leading-[14.4px] text-text-grey">
                        Affiliates will earn 0.01% per ticket sales
                      </p>
                    </div>
                  </div>

                  <Switch
                    onChange={(v) =>
                      formik.setFieldValue("affiliate_program", v)
                    }
                    checked={affiliateEnabled}
                    checkedIcon={false}
                    uncheckedIcon={false}
                    onColor="#9BE303"
                  />
                </div>

                {affiliateEnabled && (
                  <div className="mt-[24px] grid gap-2">
                    <Label
                      htmlFor="commission"
                      className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                    >
                      Set commission (%)
                    </Label>
                    <Input
                      id="commission"
                      name="commission"
                      type="text"
                      inputMode="decimal" // mobile shows numeric keypad
                      autoComplete="off"
                      className="form-font h-12 rounded-xl border-0 bg-light_grey"
                      value={formik.values.commission}
                      onChange={(e) => {
                        // allow only digits and at most one dot
                        let v = e.target.value;

                        // remove anything that's not digit or dot
                        v = v.replace(/[^\d.]/g, "");

                        // keep only first dot
                        const firstDot = v.indexOf(".");
                        if (firstDot !== -1) {
                          v =
                            v.slice(0, firstDot + 1) +
                            v.slice(firstDot + 1).replace(/\./g, "");
                        }

                        formik.setFieldValue("commission", v);
                      }}
                      onBlur={formik.handleBlur}
                      onKeyDown={(e) => {
                        // hard-block scientific notation keys
                        if (["e", "E", "+", "-"].includes(e.key))
                          e.preventDefault();
                      }}
                      placeholder="e.g. 2.5"
                    />

                    <span className="font-sans text-[12px] font-normal leading-[14.4px] text-grey-40">
                      Commission will be based on the per ticket sold
                    </span>
                  </div>
                )}

                {/* Socials */}
                <p className="mt-[48px] font-sans text-[12px] font-bold leading-[14.4px] text-light-black">
                  SOCIAL DETAILS{" "}
                  <span className="font-semi-normal text-text-grey">
                    (Optional)
                  </span>
                </p>

                {[
                  {
                    key: "website",
                    icon: <AttachmentIcon />,
                    type: "url" as const,
                  },
                  {
                    key: "facebook",
                    icon: <FacebookIcon />,
                    type: "text" as const,
                  },
                  {
                    key: "linkedin",
                    icon: <LinkedInIcon />,
                    type: "text" as const,
                  },
                  {
                    key: "twitter",
                    icon: <TwitterIcon />,
                    type: "text" as const,
                  },
                  {
                    key: "instagram",
                    icon: <InstagramIcon />,
                    type: "text" as const,
                  },
                ].map(({ key, icon, type }) => (
                  <div
                    key={key}
                    className="mt-[16px] flex items-center gap-3 rounded-[12px] bg-light_grey p-2 px-[12px]"
                  >
                    <div>{icon}</div>
                    <div className="w-full">
                      <input
                        type={type}
                        name={`socials.${key}`}
                        className="w-full rounded-xl border-0 bg-light_grey px-1 text-[14px] focus:border-transparent focus:outline-none focus:ring-0"
                        value={(formik.values.socials as any)[key] ?? ""}
                        onChange={formik.handleChange}
                        placeholder=""
                      />
                    </div>
                  </div>
                ))}

                <FlatButton
                  loading={formik.isSubmitting}
                  error={formik.isValid}
                  onClick={formik.handleSubmit}
                  title="Save changes"
                  classes="mt-[24px] h-[48px] rounded-[12px] border-[1px] border-step-color shadow-green-inset hover:shadow-green-inset-strong"
                />
              </div>
            </form>
          )}
        </section>
      </section>
    </MainLayout>
  );
};

export default EditEventClient;
