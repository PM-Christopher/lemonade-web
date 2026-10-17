"use client";
import { useNavigation } from "@/hooks/useNavigation";
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
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventDetailsSchema, type CreateEventDetailsInput } from "@/features/events/schema";
import Switch from "react-switch";
import { useAppDispatch } from "@/redux/hook";
import { addEvent } from "@/features/events/event.slice";

import MainLayout from "@/components/layouts/MainLayout";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { FlatButton } from "@/components/global/FlatButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getTimeZones } from "@/lib/helper";
import { routes } from "@/lib/routes";
import { errorMessage } from "@/lib/api-error";

interface SocialMediaHandles {
  instagram: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  website: string;
}

// Event details form; the first step of creating an event.
const CreateEventClient = () => {
  const dispatch = useAppDispatch();
  const { push } = useNavigation();
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

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateEventDetailsInput>({
    resolver: zodResolver(createEventDetailsSchema),
    defaultValues: {
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
      commission: "",
    },
    mode: "onTouched",
  });

  const values = useWatch({ control });
  const fieldAdapter = {
    setFieldValue: (field: string, value: unknown) =>
      setValue(field as keyof CreateEventDetailsInput, value as never, { shouldValidate: true }),
  };

  const onSubmit = (formValues: CreateEventDetailsInput) => {
    try {
      const filteredSocials = (Object.keys(socials) as Array<keyof SocialMediaHandles>)
        .filter((key) => socials[key])
        .map((key) => ({
          name: key,
          value: socials[key],
        }));
      const data = {
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
        // The form takes a whole percent; the backend expects a fraction (2.5% -> 0.025).
        commission: formValues.affiliate_program ? Number(formValues.commission) / 100 : null,
        socials: filteredSocials,
      };
      dispatch(addEvent(data));
      push(routes.EVENT_ADD_TICKET);
    } catch (error) {
      dispatch(
        updateToastifyReducer({
          show: true,
          message: errorMessage(error, "An error occurred while creating the event"),
          type: "error",
        }),
      );
    }
  };

  const now = new Date();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 45, 0, 0);

  const timeStringToDate = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const d = new Date();
    d.setHours(hours);
    d.setMinutes(minutes);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
  };

  const timeZones = getTimeZones();

  return (
    <MainLayout>
      <section className="laptop:bg-light_grey bg-white pb-10">
        <div className="border-b-grey-20 border-t-grey-20 flex items-center justify-between border-t border-b bg-white p-3 px-10">
          <div
            className="flex items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => push(routes.EVENT)}
          >
            <ChevronLeft className="cursor-pointer" />
            <p className="tracking-custom text-body-l font-sans font-semibold">Add event</p>
          </div>
        </div>
        <section className="laptop:mt-4 laptop:items-center mt-0 flex flex-col">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="laptop:w-160 mt-10 flex w-full flex-col rounded-xl bg-white p-12">
                <p className="text-light-black text-meta font-sans font-bold">EVENT DETAILS</p>
                <SingleFileUploader
                  length="single"
                  type="event"
                  title="Upload event image"
                  setField={fieldAdapter}
                  image=""
                />
                {errors.event_image?.message ? (
                  <p className="text-meta text-left leading-normal text-[#FF8D8D]">
                    {errors.event_image?.message}
                  </p>
                ) : null}
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
                    placeholder=""
                    className="form-font bg-light_grey h-12 rounded-xl border-0"
                    value={values.event_name}
                    onChange={(e) => {
                      setValue("event_name", e.target.value, { shouldValidate: true });
                    }}
                  />
                  {errors.event_name?.message ? (
                    <p className="text-meta text-left leading-normal text-[#FF8D8D]">
                      {errors.event_name?.message}
                    </p>
                  ) : null}
                </div>
                <div className="mt-6 grid gap-2">
                  <Label
                    htmlFor="fullname"
                    className="text-text-grey text-label font-sans font-normal"
                  >
                    Event description
                  </Label>
                  <textarea
                    className="form-font bg-light_grey h-32.75 resize-none rounded-xl border-0 p-4"
                    value={values.event_description}
                    onChange={(e) => {
                      setValue("event_description", e.target.value, { shouldValidate: true });
                    }}
                  ></textarea>
                  {errors.event_description?.message ? (
                    <p className="text-meta text-left leading-normal text-[#FF8D8D]">
                      {errors.event_description?.message}
                    </p>
                  ) : null}
                </div>
                <div className="mt-6 grid gap-2">
                  <Label
                    htmlFor="fullname"
                    className="text-text-grey text-label font-sans font-normal"
                  >
                    Event category
                  </Label>
                  <select
                    id="fullname"
                    className="form-font bg-light_grey h-12 rounded-xl border-0 px-2"
                    value={values.category}
                    onChange={(e) => {
                      setValue("category", e.target.value, { shouldValidate: true });
                    }}
                  >
                    <option value="">Select category</option>
                    <option value="spirituality">Spirituality</option>
                    <option value="summer">Summer</option>
                  </select>
                  {errors.category?.message ? (
                    <p className="text-meta text-left leading-normal text-[#FF8D8D]">
                      {errors.category?.message}
                    </p>
                  ) : null}
                </div>
                <p className="text-light-black text-meta mt-12 font-sans font-bold">EVENT TYPE</p>
                <div className="mt-4 flex gap-2">
                  <div
                    className={`flex cursor-pointer items-center gap-2 rounded-xl p-3 px-4 ${
                      eventType === "physical"
                        ? "bg-gradient-green-2 shadow-event-custom"
                        : "bg-light_grey text-text-grey"
                    }`}
                    onClick={() => {
                      switchEvent("physical");
                      setValue("event_type", "physical", { shouldValidate: true });
                    }}
                  >
                    <LocationIcon />
                    <p className="tracking-custom text-body-s font-sans font-normal">Physical</p>
                  </div>
                  <div
                    className={`flex cursor-pointer items-center gap-2 rounded-xl p-3 px-4 ${
                      eventType === "online"
                        ? "bg-gradient-green-2 shadow-event-custom"
                        : "bg-light_grey text-text-grey"
                    }`}
                    onClick={() => {
                      switchEvent("online");
                      setValue("event_type", "online", { shouldValidate: true });
                    }}
                  >
                    <WebIcon />
                    <p className="tracking-custom text-body-s font-sans font-normal">Online</p>
                  </div>
                </div>
                {eventType === "physical" && (
                  <div className="mt-6 grid gap-2">
                    <Label
                      htmlFor="fullname"
                      className="text-text-grey text-label font-sans font-normal"
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
                          className="bg-light_grey text-body-s w-full border-0 px-1 focus:border-transparent focus:ring-0 focus:outline-none"
                          placeholder="Enter location..."
                          value={values.location}
                          onChange={(e) => {
                            setValue("location", e.target.value, { shouldValidate: true });
                          }}
                        />
                      </div>
                    </div>
                    {errors.location?.message ? (
                      <p className="text-meta text-left leading-normal text-[#FF8D8D]">
                        {errors.location?.message}
                      </p>
                    ) : null}
                  </div>
                )}
                {eventType === "online" && (
                  <>
                    <div className="mt-6 grid gap-2">
                      <Label
                        htmlFor="meeting-platform"
                        className="text-text-grey text-label font-sans font-normal"
                      >
                        Meeting Platform
                      </Label>
                      <select
                        id="meeting-platform"
                        className="form-font bg-light_grey h-12 rounded-xl border-0 px-2"
                        value={values.hosting_platform}
                        onChange={(e) =>
                          setValue("hosting_platform", e.target.value, { shouldValidate: true })
                        }
                      >
                        <option value="">Select category</option>
                        <option value="google-meet">Google meet</option>
                      </select>
                      {errors.hosting_platform?.message ? (
                        <p className="text-meta text-left leading-normal text-[#FF8D8D]">
                          {errors.hosting_platform?.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-6 grid gap-2">
                      <Label
                        htmlFor="meeting-link"
                        className="text-text-grey text-label font-sans font-normal"
                      >
                        Meeting link
                      </Label>
                      <Input
                        id="meeting-link"
                        type="text"
                        placeholder=""
                        className="form-font bg-light_grey h-12 rounded-xl border-0"
                        value={values.meeting_link}
                        onChange={(e) =>
                          setValue("meeting_link", e.target.value, { shouldValidate: true })
                        }
                      />
                      {errors.meeting_link?.message ? (
                        <p className="text-meta text-left leading-normal text-[#FF8D8D]">
                          {errors.meeting_link?.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-6 grid gap-2">
                      <Label
                        htmlFor="meeting-passcode"
                        className="text-text-grey text-label font-sans font-normal"
                      >
                        Meeting passcode
                      </Label>
                      <Input
                        id="meeting-passcode"
                        type="text"
                        placeholder=""
                        className="form-font bg-light_grey h-12 rounded-xl border-0"
                        value={values.meeting_passcode}
                        onChange={(e) =>
                          setValue("meeting_passcode", e.target.value, { shouldValidate: true })
                        }
                      />
                      {errors.meeting_passcode?.message ? (
                        <p className="text-meta text-left leading-normal text-[#FF8D8D]">
                          {errors.meeting_passcode?.message}
                        </p>
                      ) : null}
                    </div>
                  </>
                )}
                <div className="mt-6 grid gap-2">
                  <Label
                    htmlFor="event-time-zone"
                    className="text-text-grey text-label font-sans font-normal"
                  >
                    Event time zone
                  </Label>
                  <select
                    id="event-time-zone"
                    className="form-font bg-light_grey h-12 w-full rounded-xl border-0 px-2"
                    value={values.time_zone}
                    onChange={(e) => {
                      setValue("time_zone", e.target.value, { shouldValidate: true });
                    }}
                  >
                    <option value="">Select time zone</option>
                    {timeZones.map((timezone, index) => (
                      <option value={timezone.timeZone} key={index}>
                        {timezone.timeZone} - {timezone.gmt}
                      </option>
                    ))}
                  </select>
                  {errors.time_zone?.message ? (
                    <p className="text-meta text-left leading-normal text-[#FF8D8D]">
                      {errors.time_zone?.message}
                    </p>
                  ) : null}
                </div>
                <div className="mt-6 grid gap-2">
                  <Label
                    htmlFor="fullname"
                    className="text-text-grey text-label font-sans font-normal"
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
                            selected={values.start_date ? new Date(values.start_date) : null}
                            onChange={(date: Date | null) => {
                              if (date) {
                                // Update start date
                                const localDate = new Date(
                                  date.getTime() - date.getTimezoneOffset() * 60000,
                                )
                                  .toISOString()
                                  .split("T")[0];
                                setValue("start_date", localDate, { shouldValidate: true });
                              } else {
                                setValue("start_date", "", { shouldValidate: true });
                              }
                            }}
                            minDate={now}
                            showTimeSelect={false}
                            dateFormat="yyyy-MM-dd"
                            className="bg-light_grey font-semi-normal text-meta w-full cursor-pointer border-none px-2.5 font-sans leading-normal shadow-none focus:border-none focus:ring-0 focus:outline-none"
                            placeholderText="From"
                          />
                        </div>
                      </div>
                      {errors.start_date?.message ? (
                        <p className="text-meta text-left leading-normal text-[#FF8D8D]">
                          {errors.start_date?.message}
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
                              values.start_time ? timeStringToDate(values.start_time) : null
                            }
                            onChange={(date: Date | null) => {
                              if (date) {
                                // Update start date
                                const formated_time = date.toTimeString().split(" ")[0].slice(0, 5);
                                setValue("start_time", formated_time, { shouldValidate: true });
                              }
                            }}
                            showTimeSelect={true}
                            showTimeSelectOnly={true}
                            timeCaption={"Start Time"}
                            timeIntervals={15}
                            dateFormat="h:mm aa"
                            className="bg-light_grey font-semi-normal text-meta w-full cursor-pointer border-none px-2.5 font-sans leading-normal shadow-none focus:border-none focus:ring-0 focus:outline-none"
                            placeholderText="Start Time"
                            minTime={
                              values.start_date &&
                              new Date(values.start_date).toDateString() === now.toDateString()
                                ? now
                                : startOfDay
                            }
                            maxTime={endOfDay}
                          />
                        </div>
                      </div>
                      {errors.start_time?.message ? (
                        <p className="text-meta text-left leading-normal text-[#FF8D8D]">
                          {errors.start_time?.message}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid gap-2">
                  <Label
                    htmlFor="fullname"
                    className="text-text-grey text-label font-sans font-normal"
                  >
                    End date
                  </Label>
                  <div className="flex justify-between gap-3">
                    <div className={"flex w-full flex-col gap-1"}>
                      <div className="bg-light_grey flex h-10 w-full items-center gap-3 rounded-xl px-4">
                        <CalendarIcon />
                        <DatePicker
                          selected={values.end_date ? new Date(values.end_date) : null}
                          onChange={(date: Date | null) => {
                            if (date) {
                              const localDate = new Date(
                                date.getTime() - date.getTimezoneOffset() * 60000,
                              )
                                .toISOString()
                                .split("T")[0];
                              setValue("end_date", localDate, { shouldValidate: true });
                            } else {
                              setValue("end_date", "", { shouldValidate: true });
                            }
                          }}
                          minDate={values.start_date ? new Date(values.start_date) : now}
                          dateFormat="yyyy-MM-dd"
                          placeholderText="End Date"
                          className="bg-light_grey font-semi-normal text-meta w-full cursor-pointer border-none px-2.5 font-sans leading-normal shadow-none focus:border-none focus:ring-0 focus:outline-none"
                        />
                      </div>
                      {errors.end_date?.message ? (
                        <p className="text-meta text-left leading-normal text-[#FF8D8D]">
                          {errors.end_date?.message}
                        </p>
                      ) : null}
                    </div>

                    <div className={"flex w-full flex-col gap-1"}>
                      <div className="bg-light_grey flex h-10 w-full items-center gap-3 rounded-xl px-4">
                        <ClockIcon />
                        <DatePicker
                          selected={values.end_time ? timeStringToDate(values.end_time) : null}
                          onChange={(date: Date | null) => {
                            if (date) {
                              setValue("end_time", date.toTimeString().split(" ")[0].slice(0, 5), {
                                shouldValidate: true,
                              });
                            }
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="End Time"
                          dateFormat="h:mm aa"
                          placeholderText="End Time"
                          minTime={(() => {
                            if (values.start_time) {
                              const [hours, minutes] = values.start_time.split(":").map(Number);
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
                          className="bg-light_grey font-semi-normal text-meta w-full cursor-pointer border-none px-2.5 font-sans leading-normal shadow-none focus:border-none focus:ring-0 focus:outline-none"
                        />
                      </div>
                      {errors.end_time?.message ? (
                        <p className="text-meta text-left leading-normal text-[#FF8D8D]">
                          {errors.end_time?.message}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
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
                  <div>
                    <Switch
                      onChange={(change) => {
                        handleChange();
                        setValue("affiliate_program", change, { shouldValidate: true });
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
                      className="text-text-grey text-label font-sans font-normal"
                    >
                      Set commission (%)
                    </Label>
                    <Input
                      id="fullname"
                      type="number"
                      min={0}
                      max={100}
                      placeholder="e.g. 2.5"
                      className="form-font bg-light_grey h-12 rounded-xl border-0"
                      value={values.commission ?? ""}
                      onChange={(e) => {
                        setValue("commission", e.target.value, { shouldValidate: true });
                      }}
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
                <p className="text-light-black text-meta mt-12 font-sans font-bold">
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
                      className="bg-light_grey text-body-s w-full rounded-xl border-0 px-1 focus:border-transparent focus:ring-0 focus:outline-none"
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
                      className="bg-light_grey text-body-s w-full rounded-xl border-0 px-1 focus:border-transparent focus:ring-0 focus:outline-none"
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
                      className="bg-light_grey text-body-s w-full rounded-xl border-0 px-1 focus:border-transparent focus:ring-0 focus:outline-none"
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
                      className="bg-light_grey text-body-s w-full rounded-xl border-0 px-1 focus:border-transparent focus:ring-0 focus:outline-none"
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
                      className="bg-light_grey text-body-s w-full rounded-xl border-0 px-1 focus:border-transparent focus:ring-0 focus:outline-none"
                      placeholder="Instagram username"
                      value={socials.instagram}
                      onChange={handleSocialsChange}
                      name="instagram"
                    />
                  </div>
                </div>
                <FlatButton
                  loading={isSubmitting}
                  error={isValid}
                  onClick={() => handleSubmit(onSubmit)()}
                  title="Continue"
                  classes="mt-6 h-12 rounded-xl border border-step-color"
                />
              </div>
            </div>
          </form>
        </section>
      </section>
    </MainLayout>
  );
};

export default CreateEventClient;
