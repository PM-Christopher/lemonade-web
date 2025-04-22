"use client";
import React, { useEffect, useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { SingleFileUploader } from "@/components/global/FileUploader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LocationIcon from "@/images/icons/location-large.svg";
import WebIcon from "@/images/icons/world.svg";
import { timezones } from "../../../../../../pageLinks";
import CalendarIcon from "@/images/icons/calendar.svg";
import ClockIcon from "@/images/icons/clock.svg";
import AffiliateUsersIcon from "@/images/icons/affiliate_users.svg";
import Switch from "react-switch";
import AttachmentIcon from "@/images/icons/attachments.svg";
import FacebookIcon from "@/images/icons/facebook-color.svg";
import LinkedInIcon from "@/images/icons/linkedin-color.svg";
import TwitterIcon from "@/images/icons/twitter-color.svg";
import InstagramIcon from "@/images/icons/instagram-color.svg";
import { FormikButton } from "@/components/global/FormikButton";
import { useAppDispatch } from "@/redux/hook";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { useFormik } from "formik";
import { addEvent, editEvent } from "@/features/events/event.slice";
import { useRequest } from "@/hooks/useRequest";
import { useSelector } from "react-redux";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import MainLayout from "@/components/layouts/MainLayout";

interface SocialMediaHandles {
  instagram: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  website: string;
}

interface SocialHandle {
  name: keyof SocialMediaHandles; // Ensure that 'name' is a valid key of SocialMediaHandles
  value: string;
}

const EditEventPage = ({ params }: { params: { id: number } }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { authToken } = useSelector((state: any) => state.auth);
  const getHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  };
  const { data, loading } = useRequest(
    `/events/${params.id}`,
    "GET",
    {},
    true,
    getHeader()
  );
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

  useEffect(() => {
    if (!loading) {
      const isAffiliateProgram =
        data?.event?.affiliate_program === 1 ? true : false;
      setChecked(isAffiliateProgram);
      setEventType(data?.event?.event_type);
      const start_date_time_string = data?.event?.start_date.split(" ");
      const end_date_time_string = data?.event?.end_date.split(" ");

      formik.setFieldValue("category", data?.event?.category);
      formik.setFieldValue("event_name", data?.event?.event_name);
      formik.setFieldValue("event_description", data?.event?.event_description);
      formik.setFieldValue("event_image", data?.event?.event_image);
      formik.setFieldValue("event_type", data?.event?.event_type);
      formik.setFieldValue("time_zone", data?.event?.time_zone);
      formik.setFieldValue("affiliate_program", isAffiliateProgram);

      formik.setFieldValue(
        "location",
        data?.event?.location ? data?.event?.location : ""
      );
      formik.setFieldValue(
        "hosting_platform",
        data?.event?.hosting_platform ? data?.event?.hosting_platform : ""
      );
      formik.setFieldValue(
        "meeting_passcode",
        data?.event?.meeting_passcode ? data?.event?.meeting_passcode : ""
      );
      formik.setFieldValue(
        "meeting_link",
        data?.event?.meeting_link ? data?.event?.meeting_link : ""
      );

      formik.setFieldValue("start_date", start_date_time_string[0]);
      formik.setFieldValue("start_time", start_date_time_string[1]);
      formik.setFieldValue("end_date", end_date_time_string[0]);
      formik.setFieldValue("end_time", end_date_time_string[1]);

      const updatedSocials = data?.event?.socials.reduce(
        (acc: SocialMediaHandles, handle: SocialHandle) => {
          acc[handle.name as keyof SocialMediaHandles] = handle.value;
          return acc;
        },
        {} as SocialMediaHandles
      );

      setSocials(updatedSocials);
    }
  }, [data?.event]);

  const editEventSchema = yup.object({
    event_image: yup.string().required("Image is required"),
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
        schema
          .required("Meeting link is required")
          .url("Meeting link must be a valid url"),
    }),
    meeting_passcode: yup.string().when("event_type", {
      is: "online",
      then: (schema) => schema.required("Hosting platform is required"),
    }),
    time_zone: yup.string().required("Time zone is required"),
    start_date: yup.string().required("Start date is required"),
    start_time: yup.string().required("Start time is required"),
    end_date: yup.string().required("End date is required"),
    end_time: yup.string().required("End time is required"),
    affiliate_program: yup.boolean().required("Affiliate program is required"),
    commission: yup.number().when("affiliate_program", {
      is: true,
      then: (schema) => schema.required("Commission rate is required"),
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
      commission: "",
    },
    validationSchema: editEventSchema,
    onSubmit: async (values) => {
      const filteredSocials = (
        Object.keys(socials) as Array<keyof SocialMediaHandles>
      )
        .filter((key) => socials[key]) // Only keep keys with non-empty values
        .map((key) => ({
          name: key,
          value: socials[key],
        }));
      const data = {
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
          commission: values.commission,
          socials: filteredSocials,
        },
      };
      console.log({ data });
      dispatch(editEvent({ token: authToken, id: params.id, data })).then(
        (res) => {
          if (res.payload.status) {
            dispatch(
              updateToastifyReducer({
                show: true,
                message: "Event updated successfully",
                type: "success",
              })
            );
            router.push("/event");
          } else {
            dispatch(
              updateToastifyReducer({
                show: true,
                message: "Error updating event",
                type: "error",
              })
            );
          }
        }
      );
    },
  });

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
          <div
            className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
            onClick={() => router.push("/event")}
          >
            <ChevronLeft />
            <p className="font-sans font-semibold text-[16px] tracking-custom">
              Edit event
            </p>
          </div>
        </div>
        <section className="mt-4 flex flex-col items-center">
          <form onSubmit={formik.handleSubmit}>
            <div className="bg-white mt-10 w-[640px] p-[48px] rounded-[12px] flex flex-col">
              <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px]">
                EVENT DETAILS
              </p>
              <SingleFileUploader
                length="single"
                type="event"
                setField={formik}
                image={data?.event?.event_image}
                title="Upload event image"
              />
              <div className="grid gap-2 mt-[24px]">
                <Label
                  htmlFor="event-name"
                  className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                >
                  Event name
                </Label>
                <Input
                  id="event-name"
                  type="text"
                  placeholder=""
                  className="h-12 rounded-xl bg-light_grey form-font border-0"
                  value={formik.values.event_name || data?.event?.event_name}
                  onChange={(e) => {
                    formik.setFieldValue("event_name", e.target.value);
                  }}
                />
              </div>
              <div className="grid gap-2 mt-[24px]">
                <Label
                  htmlFor="fullname"
                  className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                >
                  Event description
                </Label>
                <textarea
                  className="h-[131px] rounded-xl bg-light_grey form-font border-0 resize-none p-4"
                  value={
                    formik.values.event_description ||
                    data?.event?.event_description
                  }
                  onChange={(e) => {
                    formik.setFieldValue("event_description", e.target.value);
                  }}
                ></textarea>
              </div>
              <div className="grid gap-2 mt-[24px]">
                <Label
                  htmlFor="fullname"
                  className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                >
                  Event category
                </Label>
                <select
                  id="fullname"
                  className="h-12 rounded-xl bg-light_grey form-font border-0 px-2"
                  value={formik.values.category || data?.event?.category}
                  onChange={(e) => {
                    formik.setFieldValue("category", e.target.value);
                  }}
                >
                  <option value="">Select category</option>
                  <option value="spirituality">Spirituality</option>
                  <option value="summer">Summer</option>
                </select>
              </div>
              <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px] mt-[48px]">
                EVENT TYPE
              </p>
              <div className="flex gap-2 mt-[16px]">
                <div
                  className={`flex gap-2 cursor-pointer rounded-[12px] p-[12px] px-[16px] items-center ${
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
                  <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom">
                    Physical
                  </p>
                </div>
                <div
                  className={`flex gap-2 cursor-pointer rounded-[12px] p-[12px] px-[16px] items-center ${
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
                  <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom">
                    Online
                  </p>
                </div>
              </div>
              {eventType === "physical" && (
                <div className="grid gap-2 mt-[24px]">
                  <Label
                    htmlFor="fullname"
                    className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                  >
                    Event location
                  </Label>
                  <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px]">
                    <div>
                      <LocationIcon />
                    </div>
                    <div className="w-full">
                      <input
                        id="search"
                        type="text"
                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full"
                        placeholder="Enter location..."
                        value={formik.values.location || data?.event?.location}
                        onChange={(e) => {
                          formik.setFieldValue("location", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              {eventType === "online" && (
                <>
                  <div className="grid gap-2 mt-[24px]">
                    <Label
                      htmlFor="meeting-platform"
                      className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                    >
                      Meeting Platform
                    </Label>
                    <select
                      id="meeting-platform"
                      className="h-12 rounded-xl bg-light_grey form-font border-0 px-2"
                      value={
                        formik.values.hosting_platform ||
                        data?.event?.hosting_plaform
                      }
                      onChange={formik.handleChange}
                    >
                      <option value="">Select category</option>
                      <option value="google-meet">Google meet</option>
                    </select>
                  </div>

                  <div className="grid gap-2 mt-[24px]">
                    <Label
                      htmlFor="meeting-link"
                      className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                    >
                      Meeting link
                    </Label>
                    <Input
                      id="meeting-link"
                      type="text"
                      placeholder=""
                      className="h-12 rounded-xl bg-light_grey form-font border-0"
                      value={
                        formik.values.meeting_link || data?.event?.meeting_link
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  <div className="grid gap-2 mt-[24px]">
                    <Label
                      htmlFor="meeting-passcode"
                      className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                    >
                      Meeting passcode
                    </Label>
                    <Input
                      id="meeting-passcode"
                      type="text"
                      placeholder=""
                      className="h-12 rounded-xl bg-light_grey form-font border-0"
                      value={
                        formik.values.meeting_passcode ||
                        data?.event?.meeting_passcode
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </>
              )}
              <div className="grid gap-2 mt-[24px]">
                <Label
                  htmlFor="event-time-zone"
                  className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                >
                  Event time zone
                </Label>
                <select
                  id="event-time-zone"
                  className="h-12 rounded-xl bg-light_grey form-font border-0 px-2"
                  value={formik.values.time_zone || data?.event?.time_zone}
                  onChange={(e) => {
                    formik.setFieldValue("time_zone", e.target.value);
                  }}
                >
                  <option value="">Select time zone</option>
                  {timezones.map((timezone, index) => (
                    <option value={timezone.value}>{timezone.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2 mt-[24px]">
                <Label
                  htmlFor="fullname"
                  className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                >
                  Start date
                </Label>
                <div className="flex justify-between gap-3">
                  <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full">
                    <div>
                      <CalendarIcon />
                    </div>
                    <div>
                      <input
                        id="search"
                        type="date"
                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                        value={formik.values.start_date}
                        onChange={(e) => {
                          formik.setFieldValue("start_date", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full">
                    <div>
                      <ClockIcon />
                    </div>
                    <div>
                      <input
                        id="search"
                        type="time"
                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                        value={formik.values.start_time}
                        onChange={(e) => {
                          formik.setFieldValue("start_time", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-2 mt-[24px]">
                <Label
                  htmlFor="fullname"
                  className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                >
                  End date
                </Label>
                <div className="flex justify-between gap-3">
                  <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full">
                    <div>
                      <CalendarIcon />
                    </div>
                    <div>
                      <input
                        id="search"
                        type="date"
                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                        value={formik.values.end_date}
                        onChange={(e) => {
                          formik.setFieldValue("end_date", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full">
                    <div>
                      <ClockIcon />
                    </div>
                    <div>
                      <input
                        id="search"
                        type="time"
                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                        value={formik.values.end_time}
                        onChange={(e) => {
                          formik.setFieldValue("end_time", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px] mt-[48px]">
                AFFILIATE PROGRAM
              </p>
              <div className="flex justify-between mt-[28px]">
                <div className="flex gap-2">
                  <div className="mt-1">
                    <AffiliateUsersIcon />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-sans font-normal text-[16px] leading-[24px] tracking-custom">
                      Enable Affiliate program
                    </p>
                    <p className="font-sans font-normal text-[12px] leading-[14.4px] text-text-grey">
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
                <div className="grid gap-2 mt-[24px]">
                  <Label
                    htmlFor="fullname"
                    className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                  >
                    Set commission
                  </Label>
                  <Input
                    id="fullname"
                    type="number"
                    placeholder=""
                    className="h-12 rounded-xl bg-light_grey form-font border-0"
                    value={formik.values.commission}
                    onChange={(e) => {
                      formik.setFieldValue("commission", e.target.value);
                    }}
                  />
                  <span className="font-sans font-normal text-[12px] leading-[14.4px] text-grey-40">
                    Commission will be based on the per ticket sold
                  </span>
                </div>
              )}
              <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px] mt-[48px]">
                SOCIAL DETAILS{" "}
                <span className="font-semi-normal text-text-grey">
                  (Optional)
                </span>
              </p>

              <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                <div>
                  <AttachmentIcon />
                </div>
                <div className="w-full">
                  <input
                    id="search"
                    type="url"
                    className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full px-1"
                    placeholder=""
                    value={socials.website}
                    onChange={handleSocialsChange}
                    name="website"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                <div>
                  <FacebookIcon />
                </div>
                <div className="w-full">
                  <input
                    id="search"
                    type="text"
                    className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full px-1"
                    placeholder=""
                    value={socials.facebook}
                    onChange={handleSocialsChange}
                    name="facebook"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                <div>
                  <LinkedInIcon />
                </div>
                <div className="w-full">
                  <input
                    id="search"
                    type="text"
                    className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full px-1"
                    placeholder=""
                    value={socials.linkedin}
                    onChange={handleSocialsChange}
                    name="linkedin"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                <div>
                  <TwitterIcon />
                </div>
                <div className="w-full">
                  <input
                    id="search"
                    type="text"
                    className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full px-1"
                    placeholder=""
                    value={socials.twitter}
                    onChange={handleSocialsChange}
                    name="twitter"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                <div>
                  <InstagramIcon />
                </div>
                <div className="w-full">
                  <input
                    id="search"
                    type="text"
                    className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full px-1"
                    placeholder=""
                    value={socials.instagram}
                    onChange={handleSocialsChange}
                    name="instagram"
                  />
                </div>
              </div>
              {/*<Button*/}
              {/*    className="mt-[24px] bg-gradient-green h-[48px] p-[14px] px-[48px] rounded-[12px] border-[1px] border-step-color shadow-custom-bottom">*/}
              {/*    <p className="font-sans font-semi-normal text-[16px] leading-[19.2px]">Continue</p>*/}
              {/*</Button>*/}
              <FormikButton
                loading={formik.isSubmitting}
                error={formik.isValid}
                title="Save changes"
                classes="mt-[24px] h-[48px] p-[14px] px-[48px] rounded-[12px] border-[1px] border-step-color shadow-custom-bottom"
              />
            </div>
          </form>
        </section>
      </section>
    </MainLayout>
  );
};

export default EditEventPage;
