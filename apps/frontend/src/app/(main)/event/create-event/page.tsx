"use client";
import React, { useState } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { SingleFileUploader } from "@/components/global/FileUploader";
import { Label, Input } from "@lemonade/ui";
import LocationIcon from "@/images/icons/location-large.svg";
import WebIcon from "@/images/icons/world.svg";
import CalendarIcon from "@/images/icons/calendarIcon.svg";
import ClockIcon from "@/images/icons/clock.svg";
import AffiliateUsersIcon from "@/images/icons/affiliate_users.svg";
import AttachmentIcon from "@/images/icons/attachments.svg";
import InstagramIcon from "@/images/icons/instagram-color.svg";
import FacebookIcon from "@/images/icons/facebook-color.svg";
import LinkedInIcon from "@/images/icons/linkedin-color.svg";
import TwitterIcon from "@/images/icons/twitter-color.svg";
import * as yup from "yup";
import { useFormik } from "formik";
import Switch from "react-switch";
import { useAppDispatch } from "@/redux/hook";
import { addEvent } from "@/features/events/event.slice";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { FlatButton } from "@/components/global/FlatButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getTimeZones } from "@/lib/helper";

interface SocialMediaHandles {
  instagram: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  website: string;
}

const CreateEventPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [eventType, setEventType] = useState("");
  const [checked, setChecked] = useState(false);
  const handleChange = () => {
    setChecked(!checked);
  };

  const switchEvent = (type: string) => {
    setEventType(type);
  };

  const [socials, setSocials] = useState<SocialMediaHandles>({
    instagram: "",
    linkedin: "",
    facebook: "",
    twitter: "",
    website: "",
  });

  const handleSocialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocials((prev) => ({ ...prev, [name]: value }));
  };

  const createEventSchema = yup.object({
    event_image: yup.string().required("Event image is required"),
    event_name: yup.string().required("Event name is required"),
    event_description: yup.string().required("Description is required"),
    category: yup.string().required("Category is required"),
    event_type: yup.string().required("Event type is required"),
    location: yup.string().when("event_type", {
      is: "physical",
      then: (schema) => schema.required("Location is required"),
    }),
    hosting_platform: yup.string().when("event_type", {
      is: "online",
      then: (schema) => schema.required("Hosting platform is required"),
    }),
    meeting_link: yup.string().when("event_type", {
      is: "online",
      then: (schema) =>
        schema.required("Meeting link is required").url("Meeting link must be a valid url"),
    }),
    meeting_passcode: yup.string().when("event_type", {
      is: "online",
      then: (schema) => schema.required("Hosting platform is required"),
    }),
    time_zone: yup.string().required("Time zone is required"),
    start_date: yup.string().required("Start date is required"),
    start_time: yup.string().required("Start time is required"),
    end_date: yup
      .string()
      .required("End date is required")
      .test(
        "end-date-validation",
        "End date and time cannot be before start date and time",
        function (value) {
          const { start_date, start_time, end_time } = this.parent;

          if (!value || !start_date || !start_time || !end_time) {
            return true; // Let required validation handle missing values
          }

          // Create complete datetime strings
          const startDateTime = new Date(`${start_date}T${start_time}`);
          const endDateTime = new Date(`${value}T${end_time}`);

          // Check if end datetime is after start datetime
          return endDateTime > startDateTime;
        },
      ),
    end_time: yup
      .string()
      .required("End time is required")
      .test(
        "end-time-validation",
        "End date and time cannot be before start date and time",
        function (value) {
          const { start_date, start_time, end_date } = this.parent;

          if (!value || !start_date || !start_time || !end_date) {
            return true; // Let required validation handle missing values
          }

          // Create complete datetime strings
          const startDateTime = new Date(`${start_date}T${start_time}`);
          const endDateTime = new Date(`${end_date}T${value}`);

          // Check if end datetime is after start datetime
          return endDateTime > startDateTime;
        },
      ),
    affiliate_program: yup.boolean().required("Affiliate program is required"),

    commission: yup.number().when("affiliate_program", {
      is: true,
      then: (schema) => schema.required("Commission rate is required"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
    socials: yup.array(),
  });

  const formik = useFormik({
    initialValues: {
      event_image: "",
      event_name: "",
      event_description: "",
      category: "",
      event_type: "",
      location: "",
      hosting_platform: "",
      meeting_link: "",
      meeting_passcode: "",
      time_zone: "",
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: "",
      affiliate_program: false,
      commission: null,
    },
    validationSchema: createEventSchema,
    validateOnMount: true,
    onSubmit: async () => {
      try {
        await createEventSchema.validate(formik.values);
        const filteredSocials = (Object.keys(socials) as Array<keyof SocialMediaHandles>)
          .filter((key) => socials[key]) // Only keep keys with non-empty values
          .map((key) => ({
            name: key,
            value: socials[key],
          }));
        const data = {
          event_image: formik.values.event_image,
          event_name: formik.values.event_name,
          event_description: formik.values.event_description,
          category: formik.values.category,
          event_type: formik.values.event_type,
          location: formik.values.location,
          hosting_platform: formik.values.hosting_platform,
          meeting_link: formik.values.meeting_link,
          meeting_passcode: formik.values.meeting_passcode,
          time_zone: formik.values.time_zone,
          start_date: `${formik.values.start_date}T${formik.values.start_time}`,
          end_date: `${formik.values.end_date}T${formik.values.end_time}`,
          affiliate_program: formik.values.affiliate_program,
          commission: formik.values.commission,
          socials: filteredSocials,
        };
        dispatch(addEvent(data));
        router.push("/event/add-ticket");
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          const firstError = error.errors[0];

          dispatch(
            updateToastifyReducer({
              show: true,
              message: firstError,
              type: "error",
            }),
          );
        } else {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "An error occurred while creating the event",
              type: "error",
            }),
          );
        }
      }
    },
  });

  const now = new Date();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 45, 0, 0);

  const timeStringToDate = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  };

  const timeZones = getTimeZones();

  return (
    <MainLayout>
      <section className="laptop:bg-light_grey bg-white pb-10">
        <div className="border-b-grey-20 border-t-grey-20 flex items-center justify-between border-t border-b bg-white p-3 px-10">
          <div
            className="flex items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => router.push("/event")}
          >
            <ChevronLeft className="cursor-pointer" />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Add event</p>
          </div>
        </div>
        <section className="laptop:mt-4 laptop:items-center mt-0 flex flex-col">
          <div>
            <div className="laptop:w-[640px] mt-10 flex w-full flex-col rounded-xl bg-white p-12">
              <p className="text-light-black font-sans text-[12px] leading-[14.4px] font-bold">
                EVENT DETAILS
              </p>
              <SingleFileUploader
                length="single"
                type="event"
                title="Upload event image"
                setField={formik}
                image=""
              />
              {formik.touched.event_image && formik.errors.event_image ? (
                <p className="text-left text-[12px] text-[#FF8D8D]">{formik.errors.event_image}</p>
              ) : null}
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="event-name"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Event name
                </Label>
                <Input
                  id="event-name"
                  type="text"
                  placeholder=""
                  className="form-font bg-light_grey h-12 rounded-xl border-0"
                  value={formik.values.event_name}
                  onChange={(e) => {
                    formik.setFieldValue("event_name", e.target.value);
                  }}
                />
                {formik.touched.event_name && formik.errors.event_name ? (
                  <p className="text-left text-[12px] text-[#FF8D8D]">{formik.errors.event_name}</p>
                ) : null}
              </div>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="fullname"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Event description
                </Label>
                <textarea
                  className="form-font bg-light_grey h-[131px] resize-none rounded-xl border-0 p-4"
                  value={formik.values.event_description}
                  onChange={(e) => {
                    formik.setFieldValue("event_description", e.target.value);
                  }}
                ></textarea>
                {formik.touched.event_description && formik.errors.event_description ? (
                  <p className="text-left text-[12px] text-[#FF8D8D]">
                    {formik.errors.event_description}
                  </p>
                ) : null}
              </div>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="fullname"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Event category
                </Label>
                <select
                  id="fullname"
                  className="form-font bg-light_grey h-12 rounded-xl border-0 px-2"
                  value={formik.values.category}
                  onChange={(e) => {
                    formik.setFieldValue("category", e.target.value);
                  }}
                >
                  <option value="">Select category</option>
                  <option value="spirituality">Spirituality</option>
                  <option value="summer">Summer</option>
                </select>
                {formik.touched.category && formik.errors.category ? (
                  <p className="text-left text-[12px] text-[#FF8D8D]">{formik.errors.category}</p>
                ) : null}
              </div>
              <p className="text-light-black mt-12 font-sans text-[12px] leading-[14.4px] font-bold">
                EVENT TYPE
              </p>
              <div className="mt-4 flex gap-2">
                <div
                  className={`flex cursor-pointer items-center gap-2 rounded-xl p-3 px-4 ${
                    eventType === "physical"
                      ? "bg-gradient-green-2 shadow-event-custom"
                      : "bg-light_grey text-text-grey"
                  }`}
                  onClick={() => {
                    switchEvent("physical");
                    formik.setFieldValue("event_type", "physical");
                  }}
                >
                  <LocationIcon />
                  <p className="tracking-custom font-sans text-[14px] leading-[21px] font-normal">
                    Physical
                  </p>
                </div>
                <div
                  className={`flex cursor-pointer items-center gap-2 rounded-xl p-3 px-4 ${
                    eventType === "online"
                      ? "bg-gradient-green-2 shadow-event-custom"
                      : "bg-light_grey text-text-grey"
                  }`}
                  onClick={() => {
                    switchEvent("online");
                    formik.setFieldValue("event_type", "online");
                  }}
                >
                  <WebIcon />
                  <p className="tracking-custom font-sans text-[14px] leading-[21px] font-normal">
                    Online
                  </p>
                </div>
              </div>
              {eventType === "physical" && (
                <div className="mt-6 grid gap-2">
                  <Label
                    htmlFor="fullname"
                    className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                  >
                    Event location
                  </Label>
                  <div className="bg-light_grey flex items-center gap-3 rounded-xl p-2 px-3">
                    <div>
                      <LocationIcon />
                    </div>
                    <div className="w-full">
                      <input
                        id="search"
                        type="text"
                        className="bg-light_grey w-full border-0 px-1 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                        placeholder="Enter location..."
                        value={formik.values.location}
                        onChange={(e) => {
                          formik.setFieldValue("location", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  {formik.touched.location && formik.errors.location ? (
                    <p className="text-left text-[12px] text-[#FF8D8D]">{formik.errors.location}</p>
                  ) : null}
                </div>
              )}
              {eventType === "online" && (
                <>
                  <div className="mt-6 grid gap-2">
                    <Label
                      htmlFor="meeting-platform"
                      className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                    >
                      Meeting Platform
                    </Label>
                    <select
                      id="meeting-platform"
                      className="form-font bg-light_grey h-12 rounded-xl border-0 px-2"
                      value={formik.values.hosting_platform}
                      onChange={formik.handleChange("hosting_platform")}
                    >
                      <option value="">Select category</option>
                      <option value="google-meet">Google meet</option>
                    </select>
                    {formik.touched.hosting_platform && formik.errors.hosting_platform ? (
                      <p className="text-left text-[12px] text-[#FF8D8D]">
                        {formik.errors.hosting_platform}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-6 grid gap-2">
                    <Label
                      htmlFor="meeting-link"
                      className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                    >
                      Meeting link
                    </Label>
                    <Input
                      id="meeting-link"
                      type="text"
                      placeholder=""
                      className="form-font bg-light_grey h-12 rounded-xl border-0"
                      value={formik.values.meeting_link}
                      onChange={formik.handleChange("meeting_link")}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.meeting_link && formik.errors.meeting_link ? (
                      <p className="text-left text-[12px] text-[#FF8D8D]">
                        {formik.errors.meeting_link}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-6 grid gap-2">
                    <Label
                      htmlFor="meeting-passcode"
                      className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                    >
                      Meeting passcode
                    </Label>
                    <Input
                      id="meeting-passcode"
                      type="text"
                      placeholder=""
                      className="form-font bg-light_grey h-12 rounded-xl border-0"
                      value={formik.values.meeting_passcode}
                      onChange={formik.handleChange("meeting_passcode")}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.meeting_passcode && formik.errors.meeting_passcode ? (
                      <p className="text-left text-[12px] text-[#FF8D8D]">
                        {formik.errors.meeting_passcode}
                      </p>
                    ) : null}
                  </div>
                </>
              )}
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="event-time-zone"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Event time zone
                </Label>
                <select
                  id="event-time-zone"
                  className="form-font bg-light_grey h-12 w-full rounded-xl border-0 px-2"
                  value={formik.values.time_zone}
                  onChange={(e) => {
                    formik.setFieldValue("time_zone", e.target.value);
                  }}
                >
                  <option value="">Select time zone</option>
                  {timeZones.map((timezone, index) => (
                    <option value={timezone.timeZone} key={index}>
                      {timezone.timeZone} - {timezone.gmt}
                    </option>
                  ))}
                </select>
                {formik.touched.time_zone && formik.errors.time_zone ? (
                  <p className="text-left text-[12px] text-[#FF8D8D]">{formik.errors.time_zone}</p>
                ) : null}
              </div>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="fullname"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Start date
                </Label>
                <div className="flex justify-between gap-3">
                  <div className={"flex w-full flex-col gap-1"}>
                    <div className="bg-light_grey flex h-10 w-full items-center gap-3 rounded-xl px-4">
                      <div>
                        <CalendarIcon />
                      </div>
                      <div className="w-full">
                        <DatePicker
                          selected={
                            formik.values.start_date ? new Date(formik.values.start_date) : null
                          }
                          onChange={(date: Date | null) => {
                            if (date) {
                              // Update start date
                              const localDate = new Date(
                                date.getTime() - date.getTimezoneOffset() * 60000,
                              )
                                .toISOString()
                                .split("T")[0];
                              formik.setFieldValue("start_date", localDate);
                            } else {
                              formik.setFieldValue("start_date", null);
                            }
                          }}
                          minDate={now}
                          showTimeSelect={false}
                          dateFormat="yyyy-MM-dd"
                          className="bg-light_grey font-semi-normal w-full cursor-pointer border-none px-2.5 font-sans text-[12px] shadow-none focus:border-none focus:ring-0 focus:outline-none"
                          placeholderText="From"
                        />
                      </div>
                    </div>
                    {formik.touched.start_date && formik.errors.start_date ? (
                      <p className="text-left text-[12px] text-[#FF8D8D]">
                        {formik.errors.start_date}
                      </p>
                    ) : null}
                  </div>

                  <div className={"flex w-full flex-col gap-1"}>
                    <div className="bg-light_grey flex h-10 w-full items-center gap-3 rounded-xl px-4">
                      <div>
                        <ClockIcon />
                      </div>
                      <div className="w-full">
                        <DatePicker
                          selected={
                            formik.values.start_time
                              ? timeStringToDate(formik.values.start_time)
                              : null
                          }
                          onChange={(date: Date | null) => {
                            if (date) {
                              // Update start date
                              const formated_time = date.toTimeString().split(" ")[0].slice(0, 5);
                              formik.setFieldValue("start_time", formated_time);
                            }
                          }}
                          showTimeSelect={true}
                          showTimeSelectOnly={true}
                          timeCaption={"Start Time"}
                          timeIntervals={15}
                          dateFormat="h:mm aa"
                          className="bg-light_grey font-semi-normal w-full cursor-pointer border-none px-2.5 font-sans text-[12px] shadow-none focus:border-none focus:ring-0 focus:outline-none"
                          placeholderText="Start Time"
                          minTime={
                            formik.values.start_date &&
                            new Date(formik.values.start_date).toDateString() === now.toDateString()
                              ? now
                              : startOfDay
                          }
                          maxTime={endOfDay}
                        />
                      </div>
                    </div>
                    {formik.touched.start_time && formik.errors.start_time ? (
                      <p className="text-left text-[12px] text-[#FF8D8D]">
                        {formik.errors.start_time}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="fullname"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  End date
                </Label>
                <div className="flex justify-between gap-3">
                  <div className={"flex w-full flex-col gap-1"}>
                    <div className="bg-light_grey flex h-10 w-full items-center gap-3 rounded-xl px-4">
                      <CalendarIcon />
                      <DatePicker
                        selected={formik.values.end_date ? new Date(formik.values.end_date) : null}
                        onChange={(date: Date | null) => {
                          if (date) {
                            const localDate = new Date(
                              date.getTime() - date.getTimezoneOffset() * 60000,
                            )
                              .toISOString()
                              .split("T")[0];
                            formik.setFieldValue("end_date", localDate);
                          } else {
                            formik.setFieldValue("end_date", null);
                          }
                        }}
                        minDate={
                          formik.values.start_date ? new Date(formik.values.start_date) : now
                        }
                        dateFormat="yyyy-MM-dd"
                        placeholderText="End Date"
                        className="bg-light_grey font-semi-normal w-full cursor-pointer border-none px-2.5 font-sans text-[12px] shadow-none focus:border-none focus:ring-0 focus:outline-none"
                      />
                    </div>
                    {formik.touched.end_date && formik.errors.end_date ? (
                      <p className="text-left text-[12px] text-[#FF8D8D]">
                        {formik.errors.end_date}
                      </p>
                    ) : null}
                  </div>

                  <div className={"flex w-full flex-col gap-1"}>
                    <div className="bg-light_grey flex h-10 w-full items-center gap-3 rounded-xl px-4">
                      <ClockIcon />
                      <DatePicker
                        selected={
                          formik.values.end_time ? timeStringToDate(formik.values.end_time) : null
                        }
                        onChange={(date: Date | null) => {
                          if (date) {
                            formik.setFieldValue(
                              "end_time",
                              date.toTimeString().split(" ")[0].slice(0, 5),
                            );
                          }
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="End Time"
                        dateFormat="h:mm aa"
                        placeholderText="End Time"
                        minTime={(() => {
                          if (formik.values.start_time) {
                            const [hours, minutes] = formik.values.start_time
                              .split(":")
                              .map(Number);
                            const selectedDate = new Date();
                            selectedDate.setHours(hours, minutes, 0, 0);
                            return selectedDate;
                          }
                          return new Date(new Date().setHours(0, 0, 0, 0)); // <-- wrap in Date
                        })()}
                        maxTime={(() => {
                          const max = new Date();
                          max.setHours(23, 45, 0, 0);
                          return max;
                        })()}
                        className="bg-light_grey font-semi-normal w-full cursor-pointer border-none px-2.5 font-sans text-[12px] shadow-none focus:border-none focus:ring-0 focus:outline-none"
                      />
                    </div>
                    {formik.touched.end_time && formik.errors.end_time ? (
                      <p className="text-left text-[12px] text-[#FF8D8D]">
                        {formik.errors.end_time}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
              <p className="text-light-black mt-12 font-sans text-[12px] leading-[14.4px] font-bold">
                AFFILIATE PROGRAM
              </p>
              <div className="mt-7 flex justify-between">
                <div className="flex gap-2">
                  <div className="mt-1">
                    <AffiliateUsersIcon />
                  </div>
                  <div className="flex flex-col">
                    <p className="tracking-custom font-sans text-[16px] leading-[24px] font-normal">
                      Enable Affiliate program
                    </p>
                    <p className="text-text-grey font-sans text-[12px] leading-[14.4px] font-normal">
                      Affiliates will earn 0.01% per ticket sales
                    </p>
                  </div>
                </div>
                <div>
                  <Switch
                    onChange={(change) => {
                      handleChange();
                      formik.setFieldValue("affiliate_program", change);
                    }}
                    checked={checked}
                    checkedIcon={false}
                    uncheckedIcon={false}
                    onColor="#9BE303"
                  />
                </div>
              </div>
              {checked && (
                <div className="mt-6 grid gap-2">
                  <Label
                    htmlFor="fullname"
                    className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                  >
                    Set commission (%)
                  </Label>
                  <Input
                    id="fullname"
                    type="number"
                    placeholder=""
                    className="form-font bg-light_grey h-12 rounded-xl border-0"
                    value={formik.values.commission ?? ""}
                    onChange={(e) => {
                      formik.setFieldValue("commission", e.target.value);
                    }}
                  />
                  <span className="text-grey-40 font-sans text-[12px] leading-[14.4px] font-normal">
                    Commission will be based on the per ticket sold
                  </span>
                  {formik.touched.commission && formik.errors.commission ? (
                    <p className="text-left text-[12px] text-[#FF8D8D]">
                      {formik.errors.commission}
                    </p>
                  ) : null}
                </div>
              )}
              <p className="text-light-black mt-12 font-sans text-[12px] leading-[14.4px] font-bold">
                SOCIAL DETAILS <span className="font-semi-normal text-text-grey">(Optional)</span>
              </p>
              <div className="bg-light_grey mt-4 flex items-center gap-3 rounded-xl p-2 px-3">
                <div>
                  <AttachmentIcon />
                </div>
                <div className="w-full">
                  <input
                    id="search"
                    type="url"
                    className="bg-light_grey w-full rounded-xl border-0 px-1 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                    placeholder="https://example.com"
                    value={socials.website}
                    onChange={handleSocialsChange}
                    name="website"
                  />
                </div>
              </div>
              <div className="bg-light_grey mt-4 flex items-center gap-3 rounded-xl p-2 px-3">
                <div>
                  <FacebookIcon />
                </div>
                <div className="w-full">
                  <input
                    id="search"
                    type="text"
                    className="bg-light_grey w-full rounded-xl border-0 px-1 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                    placeholder="Facebook username"
                    value={socials.facebook}
                    onChange={handleSocialsChange}
                    name="facebook"
                  />
                </div>
              </div>
              <div className="bg-light_grey mt-4 flex items-center gap-3 rounded-xl p-2 px-3">
                <div>
                  <LinkedInIcon />
                </div>
                <div className="w-full">
                  <input
                    id="search"
                    type="text"
                    className="bg-light_grey w-full rounded-xl border-0 px-1 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                    placeholder="LinkedIn username"
                    value={socials.linkedin}
                    onChange={handleSocialsChange}
                    name="linkedin"
                  />
                </div>
              </div>
              <div className="bg-light_grey mt-4 flex items-center gap-3 rounded-xl p-2 px-3">
                <div>
                  <TwitterIcon />
                </div>
                <div className="w-full">
                  <input
                    id="search"
                    type="text"
                    className="bg-light_grey w-full rounded-xl border-0 px-1 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                    placeholder="Twitter username"
                    value={socials.twitter}
                    onChange={handleSocialsChange}
                    name="twitter"
                  />
                </div>
              </div>
              <div className="bg-light_grey mt-4 flex items-center gap-3 rounded-xl p-2 px-3">
                <div>
                  <InstagramIcon />
                </div>
                <div className="w-full">
                  <input
                    id="search"
                    type="text"
                    className="bg-light_grey w-full rounded-xl border-0 px-1 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                    placeholder="Instagram username"
                    value={socials.instagram}
                    onChange={handleSocialsChange}
                    name="instagram"
                  />
                </div>
              </div>
              <FlatButton
                loading={formik.isSubmitting}
                error={formik.isValid}
                onClick={() => formik.handleSubmit()}
                title="Continue"
                classes="mt-6 h-12 rounded-xl border border-step-color shadow-custom-bottom"
              />
            </div>
          </div>
        </section>
      </section>
    </MainLayout>
  );
};

export default CreateEventPage;
