"use client";
import React, { useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { Label } from "@/components/ui/label";
import ClockIcon from "@/images/icons/clock.svg";
import CalendarIcon from "@/images/icons/calendar.svg";
import FeaturedImage from "@/images/featured.png";
import Image from "next/image";
import { useRequest } from "@/hooks/useRequest";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import * as yup from "yup";
import { useFormik } from "formik";
import { useBoostListingMutation } from "@/features/business/mutations";
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

const BoostBusinessPage = ({ params }: { params: { id: number } }) => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { setSearchParams, nxtSearchParams } = useNxtSearchParams();
  const [packageTitle, setPackageTitle] = useState("");
  const [selectedPackage, setSelectedPackage] = useState({ price: 0, duration: 0 });
  const [pkgIndex, setPkgIndex] = useState<number | null>(null);
  const [selectedPackages, setSelectedPackages] = useState<BoostPackages[]>([]);
  const [pkgPrice, setPkgPrice] = useState<number | null>(null);
  const boostListingMutation = useBoostListingMutation(params.id);

  // NOTE: /user/listing/boosts is not wired to business.slice.ts at all —
  // out of scope for this migration (see docs/ARCHITECTURE.md's business
  // domain note).
  const { data, loading } = useRequest(`/user/listing/boosts`);

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
    onSubmit: (values) => {
      const formData = {
        ...values,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/business/${params.id}`,
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
    setPackageTitle(data?.packages[index].title);
    setSelectedPackages(data?.packages[index].packages);
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
      <section className="bg-white pb-10 laptop:bg-light_grey">
        <div className="flex items-center justify-between border-b-[1px] border-t-[1px] border-b-grey-20 border-t-grey-20 bg-white p-[12px] px-10">
          <div className="flex items-center gap-2 rounded-[12px] p-[4px] pl-[4px] pr-[16px]">
            <ChevronLeft />
            <p className="font-sans text-[16px] font-semibold tracking-custom">Boost business</p>
          </div>
        </div>
        <section className="mt-4 flex flex-col items-center">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-10 gap-y-[154px] laptop:flex-row laptop:justify-between">
              <div className="flex flex-col">
                <div className="w-screen rounded-[12px] bg-none p-[24px] px-[48px] laptop:w-[640px] laptop:bg-white">
                  <p className="mb-[10px] text-[14px] font-normal text-text-grey">Select Package</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {loading ? (
                      <BoostPackagesSkeleton count={4} />
                    ) : (
                      data?.packages?.map((pkg: any, index: number) => (
                        <div
                          className={`flex w-fit cursor-pointer flex-col items-center justify-center rounded-[12px] bg-light-tint p-[16px] ${pkgIndex === index && "border-[2px] border-step-color"}`}
                          key={index}
                          onClick={() => handleSelectPackage(index)}
                        >
                          <Image
                            src={"/images/featured.png"}
                            alt="featured"
                            width={74}
                            height={74}
                          />
                          <p className="text-[12px] font-semi-normal text-mid-green">Featured</p>
                          <p className="text-[16px] font-bold">₦{pkg.title}</p>
                          <p className="mt-[4px] w-[121.72px] text-center text-[12px] font-normal text-text-grey">
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
                          className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                        >
                          Duration
                        </Label>
                        <select
                          id="fullname"
                          className="form-font h-12 rounded-xl border-0 bg-light_grey px-2"
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
                            className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                          >
                            Start date
                          </Label>
                          <div className="flex justify-between gap-3">
                            <div className={"flex w-full flex-col gap-[4px]"}>
                              <div className="flex h-[40px] w-full items-center gap-3 rounded-[12px] bg-light_grey px-[16px]">
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
                                    className="w-full cursor-pointer border-none bg-light_grey px-[10px] font-sans text-[12px] font-semi-normal shadow-none focus:border-none focus:outline-none focus:ring-0"
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
                              <div className="flex h-[40px] w-full items-center gap-3 rounded-[12px] bg-light_grey px-[16px]">
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
                                    className="w-full cursor-pointer border-none bg-light_grey px-[10px] font-sans text-[12px] font-semi-normal shadow-none focus:border-none focus:outline-none focus:ring-0"
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
              <div className="hidden flex-col laptop:flex">
                <div className="w-[480px] rounded-[12px] bg-white p-[24px] px-[48px]">
                  <p className="font-sans text-[20px] font-semibold leading-[28px]">Summary</p>
                  <div className="mt-[16px] flex justify-between">
                    <p className="font-sans text-[14px] font-normal leading-[21px] tracking-custom text-text-grey">
                      Featured
                    </p>
                    <p className="font-sans text-[14px] font-semibold leading-[21px]">
                      ₦ {packageTitle}
                    </p>
                  </div>
                  <div className="mt-[16px] flex justify-between">
                    <p className="font-sans text-[14px] font-normal leading-[21px] tracking-custom text-text-grey">
                      {selectedPackage.duration} days
                    </p>
                    <p className="font-sans text-[14px] font-semibold leading-[21px]">
                      ₦ {formatNumberWithCommas(selectedPackage.price)}
                    </p>
                  </div>
                  <div className="my-[16px] border-t-[1px] border-t-mid-grey"></div>
                  <div className="mt-[16px] flex justify-between">
                    <p className="font-sans text-[14px] font-normal leading-[21px] tracking-custom text-text-grey">
                      Subtotal
                    </p>
                    <p className="font-sans text-[14px] font-semibold leading-[21px]">
                      ₦ {formatNumberWithCommas(selectedPackage.price)}
                    </p>
                  </div>
                  <div className="my-[16px] border-t-[1px] border-t-mid-grey"></div>
                  <div className="mt-[16px] flex justify-between">
                    <p className="font-sans text-[18px] font-normal leading-[21px] tracking-custom text-text-grey">
                      Total
                    </p>
                    <p className="font-sans text-[18px] font-semibold leading-[21px]">
                      ₦ {formatNumberWithCommas(selectedPackage.price)}
                    </p>
                  </div>
                  <div className="mt-[24px] flex items-center justify-around gap-[16px] pl-[16px] pr-[16px] pt-[16px]">
                    <div className="">
                      <p className="font-sans font-bold text-mid-green">
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
              <div className="border-t-[1px] laptop:hidden">
                <div className="mt-[24px] flex items-center justify-around gap-[16px] pl-[16px] pr-[16px] pt-[16px]">
                  <div className="">
                    <p className="font-sans font-bold text-mid-green">
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

export default BoostBusinessPage;
