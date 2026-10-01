"use client";
import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Label, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { formatStringUCFirst } from "@/lib/helper";
import * as yup from "yup";
import { useFormik } from "formik";
import { FormikButton } from "@/components/global/FormikButton";
import { useAppDispatch } from "@/redux/hook";
import { useRequestServiceMutation } from "@/features/business/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";

type RequestServiceInterface = {
  isOpen: boolean;
  toggleMenu: () => void;
  // Was typed `[]` (the empty-tuple type) — a pre-existing typo only
  // surfaced now that `business?.services` is properly typed instead of
  // `any`.
  services: string[] | undefined;
  id: number;
};

type FormValues = {
  services: string[];
  amount: number;
  additional_information: string;
};

const RequestServiceModal: React.FC<RequestServiceInterface> = ({
  isOpen,
  toggleMenu,
  services,
  id,
}) => {
  const dispatch = useAppDispatch();
  const requestServiceMutation = useRequestServiceMutation(id);

  const handleServicesClick = (item: string) => {
    const currentServices = formik?.values?.services;
    if (Array.isArray(currentServices)) {
      const updatedServices = currentServices.includes(item)
        ? currentServices.filter((i) => i !== item)
        : [...currentServices, item];

      formik.setFieldValue("services", updatedServices);
    } else {
      console.error("services is not an array:", currentServices);
    }
  };

  const requestServiceSchema = yup.object({
    services: yup
      .array()
      .of(yup.string()) // Ensure it's an array of strings
      .min(1, "At least one service is required") // Add min length validation to prevent empty arrays
      .required("Services are required"), // Required field
    amount: yup.number().min(1).required("Amount is required"),
    additional_information: yup.string().nullable(),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      services: [],
      amount: 0,
      additional_information: "",
    },
    validationSchema: requestServiceSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      requestServiceMutation.mutate(values, {
        onSuccess: () => {
          toggleMenu();
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Quote sent",
              type: "success",
            }),
          );
        },
        onError: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Something went wrong",
              type: "error",
            }),
          );
        },
      });
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggleMenu();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Request a service"}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <div className="laptop:w-[640px] w-full px-4 py-[5vh]">
            <div className="hide-scrollbar max-h-[90vh] w-full overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="cursor-pointer" onClick={toggleMenu}>
                    <CloseIcon />
                  </div>
                  <p className="tracking-custom font-sans text-[18px] leading-[27px] font-semibold">
                    Request a service
                  </p>
                </div>
                <div className="laptop:block hidden">
                  <FormikButton
                    title="Send quote"
                    error={formik.isValid}
                    loading={formik.isSubmitting}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-y-[250px]">
                <div className="mt-10">
                  <div className="mt-[24px] grid gap-2">
                    <Label
                      htmlFor="amount"
                      className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                    >
                      I want to book you for
                    </Label>
                    <div className="bg-light_grey flex h-[48px] w-full items-center gap-3 rounded-[12px] p-2 px-[12px]">
                      <div>
                        <p className="font-semi-normal text-[14px]">₦</p>
                      </div>
                      <div className="w-full">
                        <input
                          id="amount"
                          type="text"
                          className="bg-light_grey w-full border-0 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                          value={formik.values.amount}
                          onChange={(e) => {
                            // Only digits, no leading 0
                            let value = e.target.value.replace(/\D/g, ""); // remove non-digits

                            if (value.startsWith("0")) {
                              value = value.replace(/^0+/, ""); // strip leading zeros
                            }

                            formik.setFieldValue("amount", value);
                          }}
                          inputMode="numeric" // brings up number pad on mobile
                          pattern="[1-9][0-9]*" // regex: must start with 1–9
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-[24px] grid gap-2">
                    <Label
                      htmlFor="fullname"
                      className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                    >
                      Required services
                    </Label>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {services?.map((service, index) => (
                          <div
                            className={`w-fit cursor-pointer rounded-[12px] p-[12px] px-[16px] ${
                              Array.isArray(formik.values.services) &&
                              formik.values.services.includes(service)
                                ? "bg-gradient-green-2 shadow-event-custom"
                                : "bg-light_grey"
                            }`}
                            key={index}
                            onClick={() => handleServicesClick(service)}
                          >
                            <p className="text-text-grey text-[14px] font-normal">
                              {formatStringUCFirst(service)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-[24px] grid gap-2">
                    <div className="flex justify-between">
                      <Label
                        htmlFor="additional-information"
                        className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                      >
                        Additional information
                      </Label>
                      <p className="text-text-grey text-[12px] font-normal">200 characters</p>
                    </div>
                    <textarea
                      id="additional-information"
                      placeholder=""
                      className="bg-light_grey h-[128px] resize-none rounded-xl border-0 p-4 text-[14px] font-normal"
                      readOnly={false}
                      value={formik.values.additional_information}
                      onChange={formik.handleChange}
                      name="additional_information"
                    />
                  </div>
                </div>
                <div className="laptop:hidden">
                  <FormikButton
                    title="Send quote"
                    error={formik.isValid}
                    loading={formik.isSubmitting}
                    classes="w-full rounded-[12px] h-[48px] px-[48px] py-[16px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
};

export default RequestServiceModal;
