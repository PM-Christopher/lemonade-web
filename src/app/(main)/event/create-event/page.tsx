"use client";
import React, {useState} from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import {SingleFileUploader} from "@/components/global/FileUploader";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
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
import {useFormik} from "formik";
import Switch from "react-switch";
import {FormikButton} from "@/components/global/FormikButton";
import {timezones} from "../../../../../pageLinks";
import {useAppDispatch} from "@/redux/hook";
import {addEvent} from "@/features/events/event.slice";
import {useRouter} from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {FlatButton} from "@/components/global/FlatButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
        const {name, value} = e.target;
        setSocials((prev) => ({...prev, [name]: value}));
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
        end_date: yup
            .string()
            .required("End date is required")
            .test(
                "end-date-validation",
                "End date and time cannot be before start date and time",
                function (value) {
                    const {start_date, start_time, end_time} = this.parent;

                    if (!value || !start_date || !start_time || !end_time) {
                        return true; // Let required validation handle missing values
                    }

                    // Create complete datetime strings
                    const startDateTime = new Date(`${start_date}T${start_time}`);
                    const endDateTime = new Date(`${value}T${end_time}`);

                    // Check if end datetime is after start datetime
                    return endDateTime > startDateTime;
                }
            ),
        end_time: yup
            .string()
            .required("End time is required")
            .test(
                "end-time-validation",
                "End date and time cannot be before start date and time",
                function (value) {
                    const {start_date, start_time, end_date} = this.parent;

                    if (!value || !start_date || !start_time || !end_date) {
                        return true; // Let required validation handle missing values
                    }

                    // Create complete datetime strings
                    const startDateTime = new Date(`${start_date}T${start_time}`);
                    const endDateTime = new Date(`${end_date}T${value}`);

                    // Check if end datetime is after start datetime
                    return endDateTime > startDateTime;
                }
            ),
        affiliate_program: yup
            .boolean()
            .required("Affiliate program is required"),

        commission: yup
            .number()
            .when("affiliate_program", {
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
        onSubmit: async (values) => {
            try {
                await createEventSchema.validate(formik.values);
                const filteredSocials = (
                    Object.keys(socials) as Array<keyof SocialMediaHandles>
                )
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
            } catch (error: any) {
                if (error.name === "ValidationError") {
                    const firstError = error.errors[0];

                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: firstError,
                            type: "error",
                        })
                    );
                } else {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "An error occurred while creating the event",
                            type: "error",
                        })
                    );
                }
            }
        }
    });

    const submitFunc = async () => {
        try {
            await createEventSchema.validate(formik.values);
            const filteredSocials = (
                Object.keys(socials) as Array<keyof SocialMediaHandles>
            )
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
        } catch (error: any) {
            if (error.name === "ValidationError") {
                const firstError = error.errors[0];

                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: firstError,
                        type: "error",
                    })
                );
            } else {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "An error occurred while creating the event",
                        type: "error",
                    })
                );
            }
        }
    };

    const now = new Date()
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

    return (
        <MainLayout>
            <section className="bg-white laptop:bg-light_grey pb-10">
                <div
                    className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                    <div
                        className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]"
                        onClick={() => router.push("/event")}
                    >
                        <ChevronLeft className="cursor-pointer"/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">
                            Add event
                        </p>
                    </div>
                </div>
                <section className="mt-0 laptop:mt-4 flex flex-col laptop:items-center">
                    <div>
                        <div className="bg-white mt-10 w-full laptop:w-[640px] p-[48px] rounded-[12px] flex flex-col">
                            <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px]">
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
                                <p className="text-[#FF8D8D] text-[12px] text-left">
                                    {formik.errors.event_image}
                                </p>
                            ) : null}
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
                                    value={formik.values.event_name}
                                    onChange={(e) => {
                                        formik.setFieldValue("event_name", e.target.value);
                                    }}
                                />
                                {formik.touched.event_name && formik.errors.event_name ? (
                                    <p className="text-[#FF8D8D] text-[12px] text-left">
                                        {formik.errors.event_name}
                                    </p>
                                ) : null}
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
                                    value={formik.values.event_description}
                                    onChange={(e) => {
                                        formik.setFieldValue("event_description", e.target.value);
                                    }}
                                ></textarea>
                                {formik.touched.event_description && formik.errors.event_description ? (
                                    <p className="text-[#FF8D8D] text-[12px] text-left">
                                        {formik.errors.event_description}
                                    </p>
                                ) : null}
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
                                    <p className="text-[#FF8D8D] text-[12px] text-left">
                                        {formik.errors.category}
                                    </p>
                                ) : null}
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
                                    <LocationIcon/>
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
                                    <WebIcon/>
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
                                            <LocationIcon/>
                                        </div>
                                        <div className="w-full">
                                            <input
                                                id="search"
                                                type="text"
                                                className="text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full px-[4px]"
                                                placeholder="Enter location..."
                                                value={formik.values.location}
                                                onChange={(e) => {
                                                    formik.setFieldValue("location", e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {formik.touched.location && formik.errors.location ? (
                                        <p className="text-[#FF8D8D] text-[12px] text-left">
                                            {formik.errors.location}
                                        </p>
                                    ) : null}
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
                                            value={formik.values.hosting_platform}
                                            onChange={formik.handleChange("hosting_platform")}
                                        >
                                            <option value="">Select category</option>
                                            <option value="google-meet">Google meet</option>
                                        </select>
                                        {formik.touched.hosting_platform && formik.errors.hosting_platform ? (
                                            <p className="text-[#FF8D8D] text-[12px] text-left">
                                                {formik.errors.hosting_platform}
                                            </p>
                                        ) : null}
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
                                            value={formik.values.meeting_link}
                                            onChange={formik.handleChange("meeting_link")}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.meeting_link && formik.errors.meeting_link ? (
                                            <p className="text-[#FF8D8D] text-[12px] text-left">
                                                {formik.errors.meeting_link}
                                            </p>
                                        ) : null}
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
                                            value={formik.values.meeting_passcode}
                                            onChange={formik.handleChange("meeting_passcode")}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.meeting_passcode && formik.errors.meeting_passcode ? (
                                            <p className="text-[#FF8D8D] text-[12px] text-left">
                                                {formik.errors.meeting_passcode}
                                            </p>
                                        ) : null}
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
                                    className="w-full h-12 rounded-xl bg-light_grey form-font border-0 px-2"
                                    value={formik.values.time_zone}
                                    onChange={(e) => {
                                        formik.setFieldValue("time_zone", e.target.value);
                                    }}
                                >
                                    <option value="">Select time zone</option>
                                    {timezones.map((timezone, index) => (
                                        <option value={timezone.value}>{timezone.label}</option>
                                    ))}
                                </select>
                                {formik.touched.time_zone && formik.errors.time_zone ? (
                                    <p className="text-[#FF8D8D] text-[12px] text-left">
                                        {formik.errors.time_zone}
                                    </p>
                                ) : null}
                            </div>
                            <div className="grid gap-2 mt-[24px]">
                                <Label
                                    htmlFor="fullname"
                                    className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                                >
                                    Start date
                                </Label>
                                <div className="flex justify-between gap-3">
                                    <div className={'flex flex-col gap-[4px] w-full'}>
                                        <div
                                            className="flex items-center gap-3 bg-light_grey px-[16px] h-[40px] rounded-[12px] w-full">
                                            <div>
                                                <CalendarIcon/>
                                            </div>
                                            <div className="w-full">
                                                <DatePicker
                                                    selected={formik.values.start_date ? new Date(formik.values.start_date) : null}
                                                    onChange={(date: Date | null) => {
                                                        if (date) {
                                                            // Update start date
                                                            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0]
                                                            formik.setFieldValue("start_date", localDate);
                                                        } else {
                                                            formik.setFieldValue('start_date', null)
                                                        }
                                                    }}
                                                    minDate={now}
                                                    showTimeSelect={false}
                                                    dateFormat="yyyy-MM-dd"
                                                    className="font-sans font-semi-normal text-[12px] shadow-none cursor-pointer w-full bg-light_grey px-[10px] border-none focus:border-none focus:outline-none focus:ring-0"
                                                    placeholderText="From"
                                                />
                                            </div>
                                        </div>
                                        {formik.touched.start_date && formik.errors.start_date ? (
                                            <p className="text-[#FF8D8D] text-[12px] text-left">
                                                {formik.errors.start_date}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className={'flex flex-col w-full gap-[4px]'}>
                                        <div className="flex items-center gap-3 bg-light_grey px-[16px] h-[40px] rounded-[12px] w-full">
                                            <div>
                                                <ClockIcon/>
                                            </div>
                                            <div className="w-full">
                                                <DatePicker
                                                    selected={formik.values.start_time ? timeStringToDate(formik.values.start_time) : null}
                                                    onChange={(date: Date | null) => {
                                                        if (date) {
                                                            // Update start date
                                                            let formated_time = date.toTimeString().split(" ")[0].slice(0, 5)
                                                            formik.setFieldValue("start_time", formated_time);
                                                        }
                                                    }}
                                                    showTimeSelect={true}
                                                    showTimeSelectOnly={true}
                                                    timeCaption={'Start Time'}
                                                    timeIntervals={15}
                                                    dateFormat="h:mm aa"
                                                    className="font-sans font-semi-normal text-[12px] shadow-none cursor-pointer w-full bg-light_grey px-[10px] border-none focus:border-none focus:outline-none focus:ring-0"
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
                                            <p className="text-[#FF8D8D] text-[12px] text-left">
                                                {formik.errors.start_time}
                                            </p>
                                        ) : null}
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
                                    <div className={'flex flex-col gap-[4px] w-full'}>
                                        <div
                                            className="flex items-center gap-3 bg-light_grey px-[16px] h-[40px] rounded-[12px] w-full">
                                            <CalendarIcon/>
                                            <DatePicker
                                                selected={formik.values.end_date ? new Date(formik.values.end_date) : null}
                                                onChange={(date) => {
                                                    if (date) {
                                                        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0]
                                                        formik.setFieldValue("end_date", localDate);
                                                    } else {
                                                        formik.setFieldValue('end_date', null)
                                                    }
                                                }}
                                                minDate={
                                                    formik.values.start_date ? new Date(formik.values.start_date) : now
                                                }
                                                dateFormat="yyyy-MM-dd"
                                                placeholderText="End Date"
                                                className="font-sans font-semi-normal text-[12px] shadow-none cursor-pointer w-full bg-light_grey px-[10px] border-none focus:border-none focus:outline-none focus:ring-0"
                                            />
                                        </div>
                                        {formik.touched.end_date && formik.errors.end_date ? (
                                            <p className="text-[#FF8D8D] text-[12px] text-left">
                                                {formik.errors.end_date}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className={'flex flex-col gap-[4px] w-full'}>
                                        <div
                                            className="flex items-center gap-3 bg-light_grey px-[16px] h-[40px] rounded-[12px] w-full">
                                            <ClockIcon/>
                                            <DatePicker
                                                selected={formik.values.end_time ? timeStringToDate(formik.values.end_time) : null}
                                                onChange={(date) => {
                                                    if (date) {
                                                        formik.setFieldValue(
                                                            "end_time",
                                                            date.toTimeString().split(" ")[0].slice(0, 5)
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
                                                        const [hours, minutes] = formik.values.start_time.split(":").map(Number);
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
                                                className="font-sans font-semi-normal text-[12px] shadow-none cursor-pointer w-full bg-light_grey px-[10px] border-none focus:border-none focus:outline-none focus:ring-0"
                                            />
                                        </div>
                                        {formik.touched.end_time && formik.errors.end_time ? (
                                            <p className="text-[#FF8D8D] text-[12px] text-left">
                                                {formik.errors.end_time}
                                            </p>
                                        ) : null}
                                    </div>

                                </div>
                            </div>
                            <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px] mt-[48px]">
                                AFFILIATE PROGRAM
                            </p>
                            <div className="flex justify-between mt-[28px]">
                                <div className="flex gap-2">
                                    <div className="mt-1">
                                        <AffiliateUsersIcon/>
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
                                        Set commission (%)
                                    </Label>
                                    <Input
                                        id="fullname"
                                        type="number"
                                        placeholder=""
                                        className="h-12 rounded-xl bg-light_grey form-font border-0"
                                        value={formik.values.commission ?? ""}
                                        onChange={(e) => {
                                            formik.setFieldValue("commission", e.target.value);
                                        }}
                                    />
                                    <span className="font-sans font-normal text-[12px] leading-[14.4px] text-grey-40">Commission will be based on the per ticket sold</span>
                                    {formik.touched.commission && formik.errors.commission ? (
                                        <p className="text-[#FF8D8D] text-[12px] text-left">
                                            {formik.errors.commission}
                                        </p>
                                    ) : null}
                                </div>
                            )}
                            <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px] mt-[48px]">
                                SOCIAL DETAILS{" "}
                                <span className="font-semi-normal text-text-grey">(Optional)</span>
                            </p>
                            <div
                                className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                                <div>
                                    <AttachmentIcon/>
                                </div>
                                <div className="w-full">
                                    <input
                                        id="search"
                                        type="url"
                                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full px-1"
                                        placeholder="https://example.com"
                                        value={socials.website}
                                        onChange={handleSocialsChange}
                                        name="website"
                                    />
                                </div>

                            </div>
                            <div
                                className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                                <div>
                                    <FacebookIcon/>
                                </div>
                                <div className="w-full">
                                    <input
                                        id="search"
                                        type="text"
                                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full px-1"
                                        placeholder="Facebook username"
                                        value={socials.facebook}
                                        onChange={handleSocialsChange}
                                        name="facebook"
                                    />
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                                <div>
                                    <LinkedInIcon/>
                                </div>
                                <div className="w-full">
                                    <input
                                        id="search"
                                        type="text"
                                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full px-1"
                                        placeholder="LinkedIn username"
                                        value={socials.linkedin}
                                        onChange={handleSocialsChange}
                                        name="linkedin"
                                    />
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                                <div>
                                    <TwitterIcon/>
                                </div>
                                <div className="w-full">
                                    <input
                                        id="search"
                                        type="text"
                                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full px-1"
                                        placeholder="Twitter username"
                                        value={socials.twitter}
                                        onChange={handleSocialsChange}
                                        name="twitter"
                                    />
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                                <div>
                                    <InstagramIcon/>
                                </div>
                                <div className="w-full">
                                    <input
                                        id="search"
                                        type="text"
                                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full px-1"
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
                                onClick={formik.handleSubmit}
                                title="Continue"
                                classes="mt-[24px] h-[48px] p-[14px] px-[48px] rounded-[12px] border-[1px] border-step-color shadow-custom-bottom"
                            />
                        </div>
                    </div>
                </section>
            </section>
        </MainLayout>
    );
};

export default CreateEventPage;
