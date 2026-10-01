"use client";
import React, { useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { Label } from "@lemonade/ui";
import ClockIcon from "@/images/icons/clock.svg";
import CalendarIcon from "@/images/icons/calendar.svg";
import FeaturedImage from "@/images/featured.png";
import Image from "next/image";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import * as yup from "yup";
import { useFormik } from "formik";
import { useBoostListingMutation } from "@/features/business/mutations";
import { useBoostPackagesQuery } from "@/features/business/queries";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useAppDispatch } from "@/redux/hook";
import { FormikButton } from "@/components/global/FormikButton";
import MainLayout from "@/components/layouts/MainLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BoostPackagesSkeleton } from "@/components/Skeletons";
import { useSearchParams } from "next/navigation";
import useNxtSearchParams from "@/hooks/useSearchParams";

interface BoostPackages {
  duration: number;
  price: number;
}

const BoostBusinessClient = ({ id }: { id: number }) => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { setSearchParams, nxtSearchParams } = useNxtSearchParams();
  const [packageTitle, setPackageTitle] = useState("");
  const [selectedPackage, setSelectedPackage] = useState({
    price: 0,
    duration: 0,
  });
  const [pkgIndex, setPkgIndex] = useState<number | null>(null);
  const [selectedPackages, setSelectedPackages] = useState<BoostPackages[]>([]);
  const [pkgPrice, setPkgPrice] = useState<number | null>(null);
  const boostListingMutation = useBoostListingMutation(id);

  const { data, isLoading: loading } = useBoostPackagesQuery();

  const editBusinessSchema = yup.object({
    package: yup.string().required("Package is required"),
    option: yup.string().required("Option is required"),
    start_date: yup.string().required("Start date is required"),
    start_time: yup.string().required("Start time is required"),
  });

  const formik = useFormik({
    initialValues: {
      package: "",
      option: "",
      start_time: "",
      start_date: "",
    },
    validationSchema: editBusinessSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      const formData = {
        ...values,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/business/${id}`,
      };
      boostListingMutation.mutate(formData, {
        onSuccess: (result) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Redirecting to payment",
              type: "success",
            }),
          );
          window.location.href = result.payment;
        },
        onError: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Error adding business",
              type: "error",
            }),
          );
        },
      });
    },
  });

  const handleSelectPackage = (index: number) => {
    setPkgIndex(index);
    setPackageTitle(data?.packages[index].title ?? "");
    setSelectedPackages(data?.packages[index].packages ?? []);
    formik.setFieldValue("package", data?.packages[index].id);
  };

  const handleSelectedPackage = (index: number) => {
    const price = selectedPackages[index].price;
    const duration = selectedPackages[index].duration;
    setSelectedPackage({ price, duration });
    formik.setFieldValue("option", index);
  };

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

  return (
    <MainLayout>
      <section className="laptop:bg-light_grey bg-white pb-10">
        <div className="border-b-grey-20 border-t-grey-20 flex items-center justify-between border-t-[1px] border-b-[1px] bg-white p-[12px] px-10">
          <div className="flex items-center gap-2 rounded-[12px] p-[4px] pr-[16px] pl-[4px]">
            <ChevronLeft />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Boost business</p>
          </div>
        </div>
        <section className="mt-4 flex flex-col items-center">
          <form onSubmit={formik.handleSubmit}>
            <div className="laptop:flex-row laptop:justify-between flex flex-col gap-10 gap-y-[154px]">
              <div className="flex flex-col">
                <div className="laptop:w-[640px] laptop:bg-white w-screen rounded-[12px] bg-none p-[24px] px-[48px]">
                  <p className="text-text-grey mb-[10px] text-[14px] font-normal">Select Package</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {loading ? (
                      <BoostPackagesSkeleton count={4} />
                    ) : (
                      data?.packages?.map((pkg: any, index: number) => (
                        <div
                          className={`bg-light-tint flex w-fit cursor-pointer flex-col items-center justify-center rounded-[12px] p-[16px] ${pkgIndex === index && "border-step-color border-[2px]"}`}
                          key={index}
                          onClick={() => handleSelectPackage(index)}
                        >
                          <Image
                            src={"/images/featured.png"}
                            alt="featured"
                            width={74}
                            height={74}
                          />
                          <p className="font-semi-normal text-mid-green text-[12px]">Featured</p>
                          <p className="text-[16px] font-bold">₦{pkg.title}</p>
                          <p className="text-text-grey mt-[4px] w-[121.72px] text-center text-[12px] font-normal">
                            {pkg.description}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  {pkgIndex !== null ? (
                    <>
                      <div className="mt-[32px] grid gap-2">
                        <Label
                          htmlFor="fullname"
                          className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                        >
                          Duration
                        </Label>
                        <select
                          id="fullname"
                          className="form-font bg-light_grey h-12 rounded-xl border-0 px-2"
                          onChange={(e) => {
                            handleSelectedPackage(parseInt(e.target.value));
                          }}
                        >
                          <option value="">Select package</option>
                          {selectedPackages.map(
                            (
                              pkg: {
                                duration: number;
                                price: number;
                              },
                              index: number,
                            ) => (
                              <option value={index} key={index}>
                                {pkg.duration} {pkg.duration > 1 ? "days" : "day"}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                      <div className="mt-[32px] flex flex-col">
                        <div className="flex flex-col">
                          <Label
                            htmlFor="fullname"
                            className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                          >
                            Start date
                          </Label>
                          <div className="flex justify-between gap-3">
                            <div className={"flex w-full flex-col gap-[4px]"}>
                              <div className="bg-light_grey flex h-[40px] w-full items-center gap-3 rounded-[12px] px-[16px]">
                                <div>
                                  <CalendarIcon />
                                </div>
                                <div className="w-full">
                                  <DatePicker
                                    selected={
                                      formik.values.start_date
                                        ? new Date(formik.values.start_date)
                                        : null
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
                                    className="bg-light_grey font-semi-normal w-full cursor-pointer border-none px-[10px] font-sans text-[12px] shadow-none focus:border-none focus:ring-0 focus:outline-none"
                                    placeholderText="Click to select date"
                                  />
                                </div>
                              </div>
                              {formik.touched.start_date && formik.errors.start_date ? (
                                <p className="text-left text-[12px] text-[#FF8D8D]">
                                  {formik.errors.start_date}
                                </p>
                              ) : null}
                            </div>
                            <div className={"flex w-full flex-col gap-[4px]"}>
                              <div className="bg-light_grey flex h-[40px] w-full items-center gap-3 rounded-[12px] px-[16px]">
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
                                        const formated_time = date
                                          .toTimeString()
                                          .split(" ")[0]
                                          .slice(0, 5);
                                        formik.setFieldValue("start_time", formated_time);
                                      }
                                    }}
                                    showTimeSelect={true}
                                    showTimeSelectOnly={true}
                                    timeCaption={"Start Time"}
                                    timeIntervals={15}
                                    dateFormat="h:mm aa"
                                    className="bg-light_grey font-semi-normal w-full cursor-pointer border-none px-[10px] font-sans text-[12px] shadow-none focus:border-none focus:ring-0 focus:outline-none"
                                    placeholderText="Click to select time"
                                    minTime={
                                      formik.values.start_date &&
                                      new Date(formik.values.start_date).toDateString() ===
                                        now.toDateString()
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
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="laptop:flex hidden flex-col">
                <div className="w-[480px] rounded-[12px] bg-white p-[24px] px-[48px]">
                  <p className="font-sans text-[20px] leading-[28px] font-semibold">Summary</p>
                  <div className="mt-[16px] flex justify-between">
                    <p className="tracking-custom text-text-grey font-sans text-[14px] leading-[21px] font-normal">
                      Featured
                    </p>
                    <p className="font-sans text-[14px] leading-[21px] font-semibold">
                      ₦ {packageTitle}
                    </p>
                  </div>
                  <div className="mt-[16px] flex justify-between">
                    <p className="tracking-custom text-text-grey font-sans text-[14px] leading-[21px] font-normal">
                      {selectedPackage.duration} days
                    </p>
                    <p className="font-sans text-[14px] leading-[21px] font-semibold">
                      ₦ {formatNumberWithCommas(selectedPackage.price)}
                    </p>
                  </div>
                  <div className="border-t-mid-grey my-[16px] border-t-[1px]"></div>
                  <div className="mt-[16px] flex justify-between">
                    <p className="tracking-custom text-text-grey font-sans text-[14px] leading-[21px] font-normal">
                      Subtotal
                    </p>
                    <p className="font-sans text-[14px] leading-[21px] font-semibold">
                      ₦ {formatNumberWithCommas(selectedPackage.price)}
                    </p>
                  </div>
                  <div className="border-t-mid-grey my-[16px] border-t-[1px]"></div>
                  <div className="mt-[16px] flex justify-between">
                    <p className="tracking-custom text-text-grey font-sans text-[18px] leading-[21px] font-normal">
                      Total
                    </p>
                    <p className="font-sans text-[18px] leading-[21px] font-semibold">
                      ₦ {formatNumberWithCommas(selectedPackage.price)}
                    </p>
                  </div>
                  <div className="mt-[24px] flex items-center justify-around gap-[16px] pt-[16px] pr-[16px] pl-[16px]">
                    <div className="">
                      <p className="text-mid-green font-sans font-bold">
                        ₦ {formatNumberWithCommas(selectedPackage.price)}
                      </p>
                    </div>
                    <FormikButton
                      title="Pay now"
                      error={formik.isValid}
                      loading={formik.isSubmitting}
                      classes="px-[48px] p-[14px] h-[48px] flex items-center rounded-[12px] border-step-color shadow-green-inset hover:shadow-green-inset-strong"
                    />
                  </div>
                </div>
              </div>
              <div className="laptop:hidden border-t-[1px]">
                <div className="mt-[24px] flex items-center justify-around gap-[16px] pt-[16px] pr-[16px] pl-[16px]">
                  <div className="">
                    <p className="text-mid-green font-sans font-bold">
                      ₦ {formatNumberWithCommas(selectedPackage.price)}
                    </p>
                  </div>
                  <FormikButton
                    title="Pay now"
                    error={formik.isValid}
                    loading={formik.isSubmitting}
                    classes="px-[48px] p-[14px] h-[48px] flex items-center rounded-[12px] border-step-color shadow-custom-bottom"
                  />
                </div>
              </div>
            </div>
          </form>
        </section>
      </section>
    </MainLayout>
  );
};

export default BoostBusinessClient;
