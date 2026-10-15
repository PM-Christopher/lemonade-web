"use client";
import { images } from "@/lib/images";
import React, { useState } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { Label, FieldError } from "@lemonade/ui";
import ClockIcon from "@/images/icons/clock.svg";
import CalendarIcon from "@/images/icons/calendar.svg";
import Image from "next/image";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { boostBusinessSchema, type BoostBusinessInput } from "@/features/business/schema";
import { applyServerErrors } from "@/lib/form-errors";
import { useBoostListingMutation } from "@/features/business/mutations";
import { useBoostPackagesQuery } from "@/features/business/queries";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useAppDispatch } from "@/redux/hook";
import { SubmitButton } from "@/components/global/SubmitButton";
import MainLayout from "@/components/layouts/MainLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BoostPackagesSkeleton } from "@/components/Skeletons";
import { errorMessage } from "@/lib/api-error";

interface BoostPackages {
  duration: number;
  price: number;
}

const BoostBusinessClient = ({ id }: { id: number }) => {
  const dispatch = useAppDispatch();
  const [packageTitle, setPackageTitle] = useState("");
  const [selectedPackage, setSelectedPackage] = useState({
    price: 0,
    duration: 0,
  });
  const [pkgIndex, setPkgIndex] = useState<number | null>(null);
  const [selectedPackages, setSelectedPackages] = useState<BoostPackages[]>([]);
  const boostListingMutation = useBoostListingMutation(id);

  const { data, isLoading: loading } = useBoostPackagesQuery();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<BoostBusinessInput>({
    resolver: zodResolver(boostBusinessSchema),
    defaultValues: {
      package: "",
      option: "",
      start_time: "",
      start_date: "",
    },
    mode: "onTouched",
  });

  const startDate = useWatch({ control, name: "start_date" });
  const startTime = useWatch({ control, name: "start_time" });

  const onSubmit = async (values: BoostBusinessInput) => {
    try {
      const result = await boostListingMutation.mutateAsync({
        ...values,
        option: values.option,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/business/${id}`,
      });
      dispatch(
        updateToastifyReducer({
          show: true,
          message: "Redirecting to payment",
          type: "success",
        }),
      );
      window.location.assign(result.payment);
    } catch (err) {
      if (applyServerErrors(err, setError, ["package", "option", "start_date", "start_time"])) {
        return;
      }
      dispatch(
        updateToastifyReducer({
          show: true,
          message: errorMessage(err, "Error adding business"),
          type: "error",
        }),
      );
    }
  };

  const handleSelectPackage = (index: number) => {
    setPkgIndex(index);
    setPackageTitle(data?.packages[index].title ?? "");
    setSelectedPackages(data?.packages[index].packages ?? []);
    setValue("package", data?.packages[index].id ?? "", { shouldValidate: true });
    setValue("option", "", { shouldValidate: true });
  };

  const handleSelectedPackage = (index: number) => {
    const price = selectedPackages[index].price;
    const duration = selectedPackages[index].duration;
    setSelectedPackage({ price, duration });
    setValue("option", String(index), { shouldValidate: true });
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

  return (
    <MainLayout>
      <section className="laptop:bg-light_grey bg-white pb-10">
        <div className="border-b-grey-20 border-t-grey-20 flex items-center justify-between border-t border-b bg-white p-3 px-10">
          <div className="flex items-center gap-2 rounded-xl p-1 pr-4 pl-1">
            <ChevronLeft />
            <p className="tracking-custom text-body-l font-sans font-semibold">Boost business</p>
          </div>
        </div>
        <section className="mt-4 flex flex-col items-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="laptop:flex-row laptop:justify-between flex flex-col gap-10 gap-y-38.5">
              <div className="flex flex-col">
                <div className="laptop:w-160 laptop:bg-white w-screen rounded-xl bg-none p-6 px-12">
                  <p className="text-text-grey text-body-s mb-2.5 font-normal">Select Package</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {loading ? (
                      <BoostPackagesSkeleton count={4} />
                    ) : (
                      data?.packages?.map((pkg, index: number) => (
                        <div
                          className={`bg-light-tint flex w-fit cursor-pointer flex-col items-center justify-center rounded-xl p-4 ${pkgIndex === index && "border-step-color border-2"}`}
                          key={index}
                          onClick={() => handleSelectPackage(index)}
                        >
                          <Image src={images.FEATURED} alt="featured" width={74} height={74} />
                          <p className="font-semi-normal text-mid-green text-meta leading-normal">
                            Featured
                          </p>
                          <p className="text-body-l font-bold">₦{pkg.title}</p>
                          <p className="text-text-grey text-meta mt-1 w-30.5 text-center leading-normal font-normal">
                            {pkg.description}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  <FieldError message={errors.package?.message} />
                  {pkgIndex !== null ? (
                    <>
                      <div className="mt-8 grid gap-2">
                        <Label
                          htmlFor="duration"
                          className="text-text-grey text-label font-sans font-normal"
                        >
                          Duration
                        </Label>
                        <select
                          id="duration"
                          className="form-font bg-light_grey h-12 rounded-xl border-0 px-2"
                          onChange={(e) => {
                            if (e.target.value === "") return;
                            handleSelectedPackage(parseInt(e.target.value, 10));
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
                        <FieldError message={errors.option?.message} />
                      </div>
                      <div className="mt-8 flex flex-col">
                        <div className="flex flex-col">
                          <Label
                            htmlFor="start_date"
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
                                    selected={startDate ? new Date(startDate) : null}
                                    onChange={(date: Date | null) => {
                                      if (date) {
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
                                    placeholderText="Click to select date"
                                  />
                                </div>
                              </div>
                              <FieldError message={errors.start_date?.message} />
                            </div>
                            <div className={"flex w-full flex-col gap-1"}>
                              <div className="bg-light_grey flex h-10 w-full items-center gap-3 rounded-xl px-4">
                                <div>
                                  <ClockIcon />
                                </div>
                                <div className="w-full">
                                  <DatePicker
                                    selected={startTime ? timeStringToDate(startTime) : null}
                                    onChange={(date: Date | null) => {
                                      if (date) {
                                        const formated_time = date
                                          .toTimeString()
                                          .split(" ")[0]
                                          .slice(0, 5);
                                        setValue("start_time", formated_time, {
                                          shouldValidate: true,
                                        });
                                      }
                                    }}
                                    showTimeSelect={true}
                                    showTimeSelectOnly={true}
                                    timeCaption={"Start Time"}
                                    timeIntervals={15}
                                    dateFormat="h:mm aa"
                                    className="bg-light_grey font-semi-normal text-meta w-full cursor-pointer border-none px-2.5 font-sans leading-normal shadow-none focus:border-none focus:ring-0 focus:outline-none"
                                    placeholderText="Click to select time"
                                    minTime={
                                      startDate &&
                                      new Date(startDate).toDateString() === now.toDateString()
                                        ? now
                                        : startOfDay
                                    }
                                    maxTime={endOfDay}
                                  />
                                </div>
                              </div>
                              <FieldError message={errors.start_time?.message} />
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
                <div className="w-120 rounded-xl bg-white p-6 px-12">
                  <p className="text-title-r font-sans font-semibold">Summary</p>
                  <div className="mt-4 flex justify-between">
                    <p className="tracking-custom text-text-grey text-body-s font-sans font-normal">
                      Featured
                    </p>
                    <p className="text-body-s font-sans font-semibold">₦ {packageTitle}</p>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <p className="tracking-custom text-text-grey text-body-s font-sans font-normal">
                      {selectedPackage.duration} days
                    </p>
                    <p className="text-body-s font-sans font-semibold">
                      ₦ {formatNumberWithCommas(selectedPackage.price)}
                    </p>
                  </div>
                  <div className="border-t-mid-grey my-4 border-t"></div>
                  <div className="mt-4 flex justify-between">
                    <p className="tracking-custom text-text-grey text-body-s font-sans font-normal">
                      Subtotal
                    </p>
                    <p className="text-body-s font-sans font-semibold">
                      ₦ {formatNumberWithCommas(selectedPackage.price)}
                    </p>
                  </div>
                  <div className="border-t-mid-grey my-4 border-t"></div>
                  <div className="mt-4 flex justify-between">
                    <p className="tracking-custom text-text-grey text-body-xl font-sans leading-5.25 font-normal">
                      Total
                    </p>
                    <p className="text-body-xl font-sans leading-5.25 font-semibold">
                      ₦ {formatNumberWithCommas(selectedPackage.price)}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-around gap-4 pt-4 pr-4 pl-4">
                    <div className="">
                      <p className="text-mid-green font-sans font-bold">
                        ₦ {formatNumberWithCommas(selectedPackage.price)}
                      </p>
                    </div>
                    <SubmitButton
                      title="Pay now"
                      isValid={isValid}
                      loading={isSubmitting}
                      classes="px-12 p-3.5 h-12 flex items-center rounded-xl border-step-color shadow-green-inset hover:shadow-green-inset-strong"
                    />
                  </div>
                </div>
              </div>
              <div className="laptop:hidden border-t">
                <div className="mt-6 flex items-center justify-around gap-4 pt-4 pr-4 pl-4">
                  <div className="">
                    <p className="text-mid-green font-sans font-bold">
                      ₦ {formatNumberWithCommas(selectedPackage.price)}
                    </p>
                  </div>
                  <SubmitButton
                    title="Pay now"
                    isValid={isValid}
                    loading={isSubmitting}
                    classes="px-12 p-3.5 h-12 flex items-center rounded-xl border-step-color shadow-custom-bottom"
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
