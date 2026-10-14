"use client";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateEventDetailsSchema, type UpdateEventDetailsInput } from "@/features/events/schema";
import { applyServerErrors } from "@/lib/form-errors";

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
import type { EventInterface } from "@/interfaces/EventInterface";
import { errorMessage } from "@/lib/api-error";

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

const buildInitialValues = (event?: EventInterface): EventFormValues => {
  const start = parseDateTime(event?.start_date as string | undefined);
  const end = parseDateTime(event?.end_date as string | undefined);

  const socialsArray = Array.isArray(event?.socials) ? event.socials : [];
  const socialsObj = socialsArray.reduce(
    (acc: SocialMediaHandles, item: { name: string; value: string }) => {
      if (item?.name && item?.name in EMPTY_SOCIALS) {
        acc[item.name as keyof SocialMediaHandles] = item.value ?? "";
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
    event_type: (event?.event_type as "" | "physical" | "online" | undefined) ?? "",
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
    // The backend stores commission as a fraction of the sale (0.1 = 10%); this field displays
    // and collects a whole percent (e.g. "10"), so convert on the way in and back on submit.
    commission: event?.commission != null ? String(event.commission * 100) : "",
    socials: socialsObj,
  };
};

const EditEventClient = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch();
  const { push } = useNavigation();

  const eventId = Number(id);
  const { data: eventData, isLoading: loading, refetch } = useEventQuery(eventId);
  const event = eventData?.event;
  const updateEventMutation = useUpdateEventMutation(eventId);

  useEffect(() => {
    if (!Number.isFinite(eventId)) return;

    const onPageShow = () => refetch();
    window.addEventListener("pageshow", onPageShow);

    const onVisibility = () => {
      if (!document.hidden) refetch();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [eventId, refetch]);

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

  const {
    handleSubmit,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UpdateEventDetailsInput>({
    resolver: zodResolver(updateEventDetailsSchema),
    defaultValues: buildInitialValues() as UpdateEventDetailsInput,
    mode: "onTouched",
  });

  const values = watch();
  const fieldAdapter = {
    setFieldValue: (field: string, value: unknown) =>
      setValue(field as keyof UpdateEventDetailsInput, value as never, { shouldValidate: true }),
  };

  useEffect(() => {
    if (event) {
      reset(buildInitialValues(event) as UpdateEventDetailsInput);
    }
  }, [event, reset]);

  const onSubmit = async (formValues: UpdateEventDetailsInput) => {
    try {
      const filteredSocials = (Object.keys(formValues.socials) as Array<keyof SocialMediaHandles>)
        .filter((key) => Boolean(formValues.socials[key]))
        .map((key) => ({ name: key, value: formValues.socials[key] }));

      const payload = {
        event: {
          event_image: formValues.event_image,
          event_name: formValues.event_name,
          event_description: formValues.event_description,
          category: formValues.category,
          event_type: formValues.event_type,
          location: formValues.location,
          hosting_platform: formValues.hosting_platform,
          meeting_link: formValues.meeting_link,
          meeting_passcode: formValues.meeting_passcode,
          time_zone: formValues.time_zone,
          start_date: `${formValues.start_date}T${formValues.start_time}`,
          end_date: `${formValues.end_date}T${formValues.end_time}`,
          affiliate_program: formValues.affiliate_program,
          commission: formValues.affiliate_program ? Number(formValues.commission) / 100 : null,
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
      push(routes.EVENT);
    } catch (e) {
      if (
        applyServerErrors(e, setError, [
          "event_image",
          "event_name",
          "event_description",
          "category",
          "event_type",
          "location",
          "hosting_platform",
          "meeting_link",
          "meeting_passcode",
          "time_zone",
          "start_date",
          "end_date",
          "commission",
        ])
      ) {
        return;
      }
      dispatch(
        updateToastifyReducer({
          show: true,
          message: errorMessage(e, "Error updating event"),
          type: "error",
        }),
      );
    }
  };

  const isOnline = values.event_type === "online";
  const isPhysical = values.event_type === "physical";
  const affiliateEnabled = Boolean(values.affiliate_program);

  const isStartToday =
    values.start_date && new Date(values.start_date).toDateString() === now.toDateString();

  const startMinTime = isStartToday ? now : startOfDay;

  const endMinTime = (() => {
    if (!values.end_date) return startOfDay;

    const endIsToday = new Date(values.end_date).toDateString() === now.toDateString();
    const base = endIsToday ? now : startOfDay;

    if (values.start_date && values.end_date === values.start_date && values.start_time) {
      const st = timeStringToDate(values.start_time);
      return st > base ? st : base;
    }

    return base;
  })();

  const ready = !loading && event && Number(event?.id) === eventId;

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="border-b-grey-20 border-t-grey-20 flex items-center justify-between border-t border-b bg-white p-3 px-10">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => push(routes.EVENT)}
          >
            <ChevronLeft />
            <p className="tracking-custom text-body-l font-sans font-semibold">Edit event</p>
          </button>
        </div>

        <section className="mt-4 flex flex-col items-center">
          {!ready ? (
            <EventFormSkeleton />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-10 flex w-160 flex-col rounded-xl bg-white p-12">
                <p className="text-light-black text-meta font-sans font-bold">EVENT DETAILS</p>

                <SingleFileUploader
                  length="single"
                  type="event"
                  setField={fieldAdapter}
                  image={event?.event_image}
                  title="Upload event image"
                />

                {/* Event name */}
                <div className="mt-6 grid gap-2">
                  <Label
                    htmlFor="event-name"
                    className="text-text-grey text-label font-sans font-normal"
                  >
                    Event name
                  </Label>
                  <Input
                    id="event-name"
                    type="text"
                    className="form-font bg-light_grey h-12 rounded-xl border-0"
                    value={values.event_name}
                    onChange={(e) =>
                      setValue("event_name", e.target.value, { shouldValidate: true })
                    }
                  />
                </div>

                {/* Description */}
                <div className="mt-6 grid gap-2">
                  <Label
                    htmlFor="event-description"
                    className="text-text-grey text-label font-sans font-normal"
                  >
                    Event description
                  </Label>
                  <textarea
                    id="event-description"
                    className="form-font bg-light_grey h-32.75 resize-none rounded-xl border-0 p-4"
                    value={values.event_description}
                    onChange={(e) =>
                      setValue("event_description", e.target.value, { shouldValidate: true })
                    }
                  />
                </div>

                {/* Category */}
                <div className="mt-6 grid gap-2">
                  <Label
                    htmlFor="event-category"
                    className="text-text-grey text-label font-sans font-normal"
                  >
                    Event category
                  </Label>
                  <select
                    id="event-category"
                    name="category"
                    className="form-font bg-light_grey h-12 rounded-xl border-0 px-2"
                    value={values.category}
                    onChange={(e) => setValue("category", e.target.value, { shouldValidate: true })}
                  >
                    <option value="">Select category</option>
                    <option value="spirituality">Spirituality</option>
                    <option value="summer">Summer</option>
                  </select>
                </div>

                {/* Event type */}
                <p className="text-light-black text-meta mt-12 font-sans font-bold">EVENT TYPE</p>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className={`flex items-center gap-2 rounded-xl p-3 px-4 ${
                      isPhysical
                        ? "bg-gradient-green-2 shadow-event-custom"
                        : "bg-light_grey text-text-grey"
                    }`}
                    onClick={() => setValue("event_type", "physical", { shouldValidate: true })}
                  >
                    <LocationIcon />
                    <p className="tracking-custom text-body-s font-sans font-normal">Physical</p>
                  </button>

                  <button
                    type="button"
                    className={`flex items-center gap-2 rounded-xl p-3 px-4 ${
                      isOnline
                        ? "bg-gradient-green-2 shadow-event-custom"
                        : "bg-light_grey text-text-grey"
                    }`}
                    onClick={() => setValue("event_type", "online", { shouldValidate: true })}
                  >
                    <WebIcon />
                    <p className="tracking-custom text-body-s font-sans font-normal">Online</p>
                  </button>
                </div>

                {/* Physical */}
                {isPhysical && (
                  <div className="mt-6 grid gap-2">
                    <Label
                      htmlFor="event-location"
                      className="text-text-grey text-label font-sans font-normal"
                    >
                      Event location
                    </Label>
                    <div className="bg-light_grey flex items-center gap-3 rounded-xl p-2 px-3">
                      <LocationIcon />
                      <input
                        id="event-location"
                        type="text"
                        className="bg-light_grey text-body-s w-full rounded-xl border-0 focus:border-transparent focus:ring-0 focus:outline-none"
                        placeholder="Enter location..."
                        value={values.location}
                        onChange={(e) =>
                          setValue("location", e.target.value, { shouldValidate: true })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Online */}
                {isOnline && (
                  <>
                    <div className="mt-6 grid gap-2">
                      <Label
                        htmlFor="hosting_platform"
                        className="text-text-grey text-label font-sans font-normal"
                      >
                        Meeting Platform
                      </Label>
                      <select
                        id="hosting_platform"
                        name="hosting_platform"
                        className="form-font bg-light_grey h-12 rounded-xl border-0 px-2"
                        value={values.hosting_platform}
                        onChange={(e) =>
                          setValue("hosting_platform", e.target.value, { shouldValidate: true })
                        }
                      >
                        <option value="">Select platform</option>
                        <option value="google-meet">Google Meet</option>
                      </select>
                    </div>

                    <div className="mt-6 grid gap-2">
                      <Label
                        htmlFor="meeting_link"
                        className="text-text-grey text-label font-sans font-normal"
                      >
                        Meeting link
                      </Label>
                      <Input
                        id="meeting_link"
                        type="text"
                        className="form-font bg-light_grey h-12 rounded-xl border-0"
                        value={values.meeting_link}
                        onChange={(e) =>
                          setValue("meeting_link", e.target.value, { shouldValidate: true })
                        }
                      />
                    </div>

                    <div className="mt-6 grid gap-2">
                      <Label
                        htmlFor="meeting_passcode"
                        className="text-text-grey text-label font-sans font-normal"
                      >
                        Meeting passcode
                      </Label>
                      <Input
                        id="meeting_passcode"
                        type="text"
                        className="form-font bg-light_grey h-12 rounded-xl border-0"
                        value={values.meeting_passcode}
                        onChange={(e) =>
                          setValue("meeting_passcode", e.target.value, { shouldValidate: true })
                        }
                      />
                    </div>
                  </>
                )}

                {/* Time zone */}
                <div className="mt-6 grid gap-2">
                  <Label
                    htmlFor="time_zone"
                    className="text-text-grey text-label font-sans font-normal"
                  >
                    Event time zone
                  </Label>
                  <select
                    id="time_zone"
                    name="time_zone"
                    className="form-font bg-light_grey h-12 rounded-xl border-0 px-2"
                    value={values.time_zone}
                    onChange={(e) =>
                      setValue("time_zone", e.target.value, { shouldValidate: true })
                    }
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
                <div className="mt-6 grid gap-2">
                  <Label className="text-text-grey text-label font-sans font-normal">
                    Start date
                  </Label>

                  <div className="flex justify-between gap-3">
                    <div className="flex w-full flex-col gap-1">
                      <div className="bg-light_grey flex h-10 w-full items-center gap-3 rounded-xl px-4">
                        <CalendarIcon />
                        <DatePicker
                          selected={values.start_date ? new Date(values.start_date) : null}
                          onChange={(date: Date | null) => {
                            setValue("start_date", date ? toISODate(date) : "", {
                              shouldValidate: true,
                            });
                          }}
                          minDate={now}
                          dateFormat="yyyy-MM-dd"
                          className="bg-light_grey font-semi-normal text-meta w-full cursor-pointer border-none px-2.5 font-sans leading-normal shadow-none focus:ring-0 focus:outline-none"
                          placeholderText="From"
                        />
                      </div>
                      {errors.start_date?.message && (
                        <p className="text-meta text-left leading-normal text-[#FF8D8D]">
                          {errors.start_date?.message}
                        </p>
                      )}
                    </div>

                    <div className="flex w-full flex-col gap-1">
                      <div className="bg-light_grey flex h-10 w-full items-center gap-3 rounded-xl px-4">
                        <ClockIcon />
                        <DatePicker
                          selected={values.start_time ? timeStringToDate(values.start_time) : null}
                          onChange={(date: Date | null) => {
                            if (!date) return;
                            const t = date.toTimeString().slice(0, 5);
                            setValue("start_time", t, { shouldValidate: true });
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          timeCaption="Start Time"
                          timeIntervals={15}
                          dateFormat="h:mm aa"
                          className="bg-light_grey font-semi-normal text-meta w-full cursor-pointer border-none px-2.5 font-sans leading-normal shadow-none focus:ring-0 focus:outline-none"
                          placeholderText="Start Time"
                          minTime={startMinTime}
                          maxTime={endOfDay}
                        />
                      </div>
                      {errors.start_time?.message && (
                        <p className="text-meta text-left leading-normal text-[#FF8D8D]">
                          {errors.start_time?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* End */}
                <div className="mt-6 grid gap-2">
                  <Label className="text-text-grey text-label font-sans font-normal">
                    End date
                  </Label>

                  <div className="flex justify-between gap-3">
                    <div className="flex w-full flex-col gap-1">
                      <div className="bg-light_grey flex h-10 w-full items-center gap-3 rounded-xl px-4">
                        <CalendarIcon />
                        <DatePicker
                          selected={values.end_date ? new Date(values.end_date) : null}
                          onChange={(date: Date | null) => {
                            setValue("end_date", date ? toISODate(date) : "", {
                              shouldValidate: true,
                            });
                          }}
                          minDate={values.start_date ? new Date(values.start_date) : now}
                          dateFormat="yyyy-MM-dd"
                          placeholderText="End Date"
                          className="bg-light_grey font-semi-normal text-meta w-full cursor-pointer border-none px-2.5 font-sans leading-normal shadow-none focus:ring-0 focus:outline-none"
                        />
                      </div>
                      {errors.end_date?.message && (
                        <p className="text-meta text-left leading-normal text-[#FF8D8D]">
                          {errors.end_date?.message}
                        </p>
                      )}
                    </div>

                    <div className="flex w-full flex-col gap-1">
                      <div className="bg-light_grey flex h-10 w-full items-center gap-3 rounded-xl px-4">
                        <ClockIcon />
                        <DatePicker
                          selected={values.end_time ? timeStringToDate(values.end_time) : null}
                          onChange={(date: Date | null) => {
                            if (!date) return;
                            const t = date.toTimeString().slice(0, 5);
                            setValue("end_time", t, { shouldValidate: true });
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="End Time"
                          dateFormat="h:mm aa"
                          placeholderText="End Time"
                          minTime={endMinTime}
                          maxTime={endOfDay}
                          className="bg-light_grey font-semi-normal text-meta w-full cursor-pointer border-none px-2.5 font-sans leading-normal shadow-none focus:ring-0 focus:outline-none"
                        />
                      </div>
                      {errors.end_time?.message && (
                        <p className="text-meta text-left leading-normal text-[#FF8D8D]">
                          {errors.end_time?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Affiliate */}
                <p className="text-light-black text-meta mt-12 font-sans font-bold">
                  AFFILIATE PROGRAM
                </p>

                <div className="mt-7 flex justify-between">
                  <div className="flex gap-2">
                    <div className="mt-1">
                      <AffiliateUsersIcon />
                    </div>
                    <div className="flex flex-col">
                      <p className="tracking-custom text-body-l font-sans font-normal">
                        Enable Affiliate program
                      </p>
                      <p className="text-text-grey text-meta font-sans font-normal">
                        Affiliates will earn {values.commission || 0}% per ticket sale
                      </p>
                    </div>
                  </div>

                  <Switch
                    onChange={(v) => setValue("affiliate_program", v, { shouldValidate: true })}
                    checked={affiliateEnabled}
                    checkedIcon={false}
                    uncheckedIcon={false}
                    onColor="#9BE303"
                  />
                </div>

                {affiliateEnabled && (
                  <div className="mt-6 grid gap-2">
                    <Label
                      htmlFor="commission"
                      className="text-text-grey text-label font-sans font-normal"
                    >
                      Set commission (%)
                    </Label>
                    <Input
                      id="commission"
                      type="text"
                      inputMode="decimal" // mobile shows numeric keypad
                      autoComplete="off"
                      className="form-font bg-light_grey h-12 rounded-xl border-0"
                      value={values.commission}
                      onChange={(e) => {
                        // allow only digits and at most one dot
                        let v = e.target.value;

                        // remove anything that's not digit or dot
                        v = v.replace(/[^\d.]/g, "");

                        // keep only first dot
                        const firstDot = v.indexOf(".");
                        if (firstDot !== -1) {
                          v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
                        }

                        setValue("commission", v, { shouldValidate: true });
                      }}
                      onKeyDown={(e) => {
                        // hard-block scientific notation keys
                        if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                      }}
                      placeholder="e.g. 2.5"
                    />

                    <span className="text-grey-40 text-meta font-sans font-normal">
                      Commission will be based on the per ticket sold
                    </span>
                    {errors.commission?.message ? (
                      <p className="text-meta text-left leading-normal text-[#FF8D8D]">
                        {errors.commission?.message}
                      </p>
                    ) : null}
                  </div>
                )}

                {/* Socials */}
                <p className="text-light-black text-meta mt-12 font-sans font-bold">
                  SOCIAL DETAILS <span className="font-semi-normal text-text-grey">(Optional)</span>
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
                    className="bg-light_grey mt-4 flex items-center gap-3 rounded-xl p-2 px-3"
                  >
                    <div>{icon}</div>
                    <div className="w-full">
                      <input
                        type={type}
                        name={`socials.${key}`}
                        className="bg-light_grey text-body-s w-full rounded-xl border-0 px-1 focus:border-transparent focus:ring-0 focus:outline-none"
                        value={values.socials[key as keyof SocialMediaHandles] ?? ""}
                        onChange={(e) =>
                          setValue(
                            `socials.${key as keyof SocialMediaHandles}` as const,
                            e.target.value,
                            { shouldValidate: true },
                          )
                        }
                        placeholder=""
                      />
                    </div>
                  </div>
                ))}

                <FlatButton
                  loading={isSubmitting}
                  error={isValid}
                  onClick={() => handleSubmit(onSubmit)()}
                  title="Save changes"
                  classes="mt-6 h-12 rounded-xl border border-step-color shadow-green-inset hover:shadow-green-inset-strong"
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
