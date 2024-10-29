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

interface BoostPackages {
    duration: number
    price: number
}

const BoostBusinessPage = ({params}: {params: {id: number}}) => {
    const dispatch = useAppDispatch()
    const {authToken} = useSelector((state: any) => state.auth)
    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }
    const [packageTitle, setPackageTitle] = useState("")
    const [selectedPackage, setSelectedPackage] = useState({price: 0, duration: 0})
    const [pkgIndex, setPkgIndex] = useState<number|null>(null)
    const [selectedPackages, setSelectedPackages] = useState<BoostPackages[]>([])
    const [pkgPrice, setPkgPrice] = useState<number|null>(null);

    const { data, loading } = useRequest(`/listing/boosts`, "GET", {}, true, getHeader())

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
            const formData = {...values, callback_url: `http://localhost:3000/business/${params.id}`}
            const {data} = await axiosInstance.post(`listing/boost-business/${params.id}`, formData, getHeader())
            if(data.status) {
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

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <TopNav/>
                <div
                    className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Boost business</p>
                    </div>
                </div>
                <section className="min-h-screen mt-4 flex flex-col items-center">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex justify-between gap-10">
                            <div className="flex flex-col">
                                <div className="w-[640px] p-[24px] px-[48px] bg-white rounded-[12px]">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {
                                            data?.packages?.map((pkg: any, index: number) => (
                                                <div
                                                    className={`p-[16px] bg-light-tint w-fit flex flex-col items-center justify-center rounded-[12px] cursor-pointer ${pkgIndex === index && "border-[2px] border-step-color"}`}
                                                    key={index} onClick={() => handleSelectPackage(index)}>
                                                    <Image src={"/images/featured.png"} alt="featured" width={74} height={74}/>
                                                    <p className="font-semi-normal text-[12px] text-mid-green">Featured</p>
                                                    <p className="font-bold text-[16px]">
                                                        ₦{pkg.title}
                                                    </p>
                                                    <p className="font-normal text-[12px] text-text-grey w-[121.72px] text-center mt-[4px]">
                                                        {pkg.description}
                                                    </p>
                                                </div>
                                            ))
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
                                                                <option value={index}
                                                                        key={index}>{pkg.duration} day</option>
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
                                                            <div
                                                                className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px] w-full">
                                                                <div>
                                                                    <CalendarIcon/>
                                                                </div>
                                                                <div>
                                                                    <input
                                                                        id="search"
                                                                        type="date"
                                                                        className="rounded-xl text-[14px] font-sans bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                                                        placeholder=""
                                                                        value={formik.values.start_date}
                                                                        onChange={(e) => {
                                                                            formik.setFieldValue("start_date", e.target.value)
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px] w-full">
                                                                <div>
                                                                    <ClockIcon/>
                                                                </div>
                                                                <div>
                                                                    <input
                                                                        id="search"
                                                                        type="time"
                                                                        className="rounded-xl text-[14px] font-sans bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                                                        placeholder=""
                                                                        value={formik.values.start_time}
                                                                        onChange={(e) => {
                                                                            formik.setFieldValue("start_time", e.target.value)
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p className="mt-[24px]">Select Package</p>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col">
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
                                        {/*<button*/}
                                        {/*    className="bg-gradient-green px-[48px] p-[14px] h-[48px] flex items-center rounded-[12px] border-step-color shadow-custom-bottom">*/}
                                        {/*    <p className="font-sans font-semi-normal text-[16px] text-white">Pay now</p>*/}
                                        {/*</button>*/}
                                        <FormikButton title="Pay now" error={formik.isValid}
                                                      loading={formik.isSubmitting}
                                                      classes="px-[48px] p-[14px] h-[48px] flex items-center rounded-[12px] border-step-color shadow-custom-bottom"/>
                                    </div>
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