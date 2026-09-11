"use client"
import React, {useState} from 'react';
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import {Label} from "@/components/ui/label";
import ClockIcon from "@/images/icons/clock.svg";
import CalendarIcon from "@/images/icons/calendar.svg"
import FeaturedImage from "@/images/featured.png"
import Image from "next/image";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import {formatNumberWithCommas} from "@/lib/formatNumber";
import * as yup from "yup";
import {useFormik} from "formik";
import {axiosInstance} from "@/lib/axiosInstane";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {useAppDispatch} from "@/redux/hook";
import {FormikButton} from "@/components/global/FormikButton";
import MainLayout from "@/components/layouts/MainLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {BoostPackagesSkeleton} from "@/components/Skeletons";
import {useSearchParams} from "next/navigation";
import useNxtSearchParams from "@/hooks/useSearchParams";

interface BoostPackages {
    duration: number
    price: number
}

const BoostBusinessPage = ({params}: { params: { id: number } }) => {
    const dispatch = useAppDispatch()
    const {authToken} = useSelector((state: any) => state.auth)
    const searchParams = useSearchParams();
    const {setSearchParams, nxtSearchParams} = useNxtSearchParams();
    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }
    const [packageTitle, setPackageTitle] = useState("")
    const [selectedPackage, setSelectedPackage] = useState({price: 0, duration: 0})
    const [pkgIndex, setPkgIndex] = useState<number | null>(null)
    const [selectedPackages, setSelectedPackages] = useState<BoostPackages[]>([])
    const [pkgPrice, setPkgPrice] = useState<number | null>(null);

    const {data, loading} = useRequest(`/user/listing/boosts`)

    const editBusinessSchema = yup.object({
        "package": yup
            .string()
            .required("Package is required"),
        option: yup
            .string()
            .required("Option is required"),
        start_date: yup
            .string()
            .required("Start date is required"),
        start_time: yup
            .string()
            .required("Start time is required")
    });

    const formik = useFormik({
        initialValues: {
            "package": "",
            option: "",
            start_time: "",
            start_date: "",
        },
        validationSchema: editBusinessSchema,
        onSubmit: async (values) => {
            const formData = {...values, callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/business/${params.id}`}
            const {data} = await axiosInstance.post(`/user/listing/boost-business/${params.id}`, formData, getHeader())
            if (data.status) {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Redirecting to payment",
                        type: "success",
                    })
                );
                window.location.href = data.data.payment
            } else {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Error adding business",
                        type: "error",
                    })
                );
            }
        },
    })

    const handleSelectPackage = (index: number) => {
        setPkgIndex(index)
        setPackageTitle(data?.packages[index].title)
        setSelectedPackages(data?.packages[index].packages)
        formik.setFieldValue("package", data?.packages[index].id)
    }

    const handleSelectedPackage = (index: number) => {
        const price = selectedPackages[index].price
        const duration = selectedPackages[index].duration
        setSelectedPackage({price, duration})
        formik.setFieldValue("option", index)
    }

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
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Boost business</p>
                    </div>
                </div>
                <section className="mt-4 flex flex-col items-center">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex flex-col laptop:flex-row laptop:justify-between gap-10 gap-y-[154px]">
                            <div className="flex flex-col">
                                <div
                                    className="w-screen laptop:w-[640px] p-[24px] px-[48px] bg-none laptop:bg-white rounded-[12px]">
                                    <p className="text-text-grey text-[14px] font-normal mb-[10px]">Select Package</p>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {
                                            loading ? (
                                                <BoostPackagesSkeleton count={4}/>
                                            ) : (
                                                data?.packages?.map((pkg: any, index: number) => (
                                                    <div
                                                        className={`p-[16px] bg-light-tint w-fit flex flex-col items-center justify-center rounded-[12px] cursor-pointer ${pkgIndex === index && "border-[2px] border-step-color"}`}
                                                        key={index} onClick={() => handleSelectPackage(index)}>
                                                        <Image src={"/images/featured.png"} alt="featured" width={74}
                                                               height={74}/>
                                                        <p className="font-semi-normal text-[12px] text-mid-green">Featured</p>
                                                        <p className="font-bold text-[16px]">
                                                            ₦{pkg.title}
                                                        </p>
                                                        <p className="font-normal text-[12px] text-text-grey w-[121.72px] text-center mt-[4px]">
                                                            {pkg.description}
                                                        </p>
                                                    </div>
                                                ))
                                            )
                                        }
                                    </div>
                                    {
                                        pkgIndex !== null ? (
                                            <>
                                                <div className="grid gap-2 mt-[32px]">
                                                    <Label htmlFor="fullname"
                                                           className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Duration</Label>
                                                    <select
                                                        id="fullname"
                                                        className="h-12 rounded-xl bg-light_grey form-font border-0 px-2"
                                                        onChange={(e) => {
                                                            handleSelectedPackage(parseInt(e.target.value))
                                                        }}
                                                    >
                                                        <option value="">Select package</option>
                                                        {
                                                            selectedPackages.map((pkg: {
                                                                duration: number,
                                                                price: number
                                                            }, index: number) => (
                                                                <option value={index} key={index}>
                                                                    {pkg.duration} {pkg.duration > 1 ? 'days' : 'day'}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                <div className="flex mt-[32px] flex-col">
                                                    <div className="flex flex-col">
                                                        <Label htmlFor="fullname"
                                                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Start
                                                            date</Label>
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
                                                                            placeholderText="Click to select date"
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
                                                                <div
                                                                    className="flex items-center gap-3 bg-light_grey px-[16px] h-[40px] rounded-[12px] w-full">
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
                                                                            placeholderText="Click to select time"
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
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="hidden laptop:flex flex-col">
                                <div className="w-[480px] p-[24px] px-[48px] bg-white rounded-[12px]">
                                    <p className="font-sans font-semibold text-[20px] leading-[28px]">Summary</p>
                                    <div className="flex justify-between mt-[16px]">
                                        <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom text-text-grey">Featured</p>
                                        <p className="font-sans font-semibold text-[14px] leading-[21px]">
                                            ₦ {packageTitle}
                                        </p>
                                    </div>
                                    <div className="flex justify-between mt-[16px]">
                                        <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom text-text-grey">
                                            {selectedPackage.duration} days
                                        </p>
                                        <p className="font-sans font-semibold text-[14px] leading-[21px]">
                                            ₦ {formatNumberWithCommas(selectedPackage.price)}
                                        </p>
                                    </div>
                                    <div className="border-t-[1px] border-t-mid-grey my-[16px]"></div>
                                    <div className="flex justify-between mt-[16px]">
                                        <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom text-text-grey">Subtotal</p>
                                        <p className="font-sans font-semibold text-[14px] leading-[21px]">
                                            ₦ {formatNumberWithCommas(selectedPackage.price)}
                                        </p>
                                    </div>
                                    <div className="border-t-[1px] border-t-mid-grey my-[16px]"></div>
                                    <div className="flex justify-between mt-[16px]">
                                        <p className="font-sans font-normal text-[18px] leading-[21px] tracking-custom text-text-grey">Total</p>
                                        <p className="font-sans font-semibold text-[18px] leading-[21px]">
                                            ₦ {formatNumberWithCommas(selectedPackage.price)}
                                        </p>
                                    </div>
                                    <div
                                        className="mt-[24px] flex justify-around gap-[16px] items-center pt-[16px] pl-[16px] pr-[16px]">
                                        <div className="">
                                            <p className="font-sans font-bold text-mid-green">
                                                ₦ {formatNumberWithCommas(selectedPackage.price)}
                                            </p>
                                        </div>
                                        <FormikButton title="Pay now" error={formik.isValid}
                                                      loading={formik.isSubmitting}
                                                      classes="px-[48px] p-[14px] h-[48px] flex items-center rounded-[12px] border-step-color shadow-green-inset hover:shadow-green-inset-strong"/>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t-[1px] laptop:hidden">
                                <div
                                    className="mt-[24px] flex justify-around gap-[16px] items-center pt-[16px] pl-[16px] pr-[16px]">
                                    <div className="">
                                        <p className="font-sans font-bold text-mid-green">
                                            ₦ {formatNumberWithCommas(selectedPackage.price)}
                                        </p>
                                    </div>
                                    <FormikButton title="Pay now" error={formik.isValid}
                                                  loading={formik.isSubmitting}
                                                  classes="px-[48px] p-[14px] h-[48px] flex items-center rounded-[12px] border-step-color shadow-custom-bottom"/>
                                </div>
                            </div>
                        </div>
                    </form>
                </section>
            </section>
        </MainLayout>
    );
}

export default BoostBusinessPage;