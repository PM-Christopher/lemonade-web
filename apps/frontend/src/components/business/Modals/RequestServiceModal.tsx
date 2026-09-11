"use client"
import React, {useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {Label} from "@/components/ui/label";
import {formatStringUCFirst} from "@/lib/helper";
import * as yup from "yup";
import {useFormik} from "formik";
import {FormikButton} from "@/components/global/FormikButton";
import {useAppDispatch} from "@/redux/hook";
import {requestService} from "@/features/business/business.slice";
import {updateToastifyReducer} from "@/redux/toastifySlice";

type RequestServiceInterface = {
    isOpen: boolean,
    toggleMenu: () => void,
    services: [],
    id: number,
    token: string
}

type FormValues = {
    services: string[],
    amount: number,
    additional_information: string,
}

const RequestServiceModal: React.FC<RequestServiceInterface> = ({isOpen, toggleMenu, services, id, token}) => {
    const dispatch = useAppDispatch()

    const handleServicesClick = (item: string) => {
        const currentServices = formik?.values?.services;
        if (Array.isArray(currentServices)) {
            const updatedServices = currentServices.includes(item)
                ? currentServices.filter((i) => i !== item)
                : [...currentServices, item];

            formik.setFieldValue('services', updatedServices);
        } else {
            console.error('services is not an array:', currentServices);
        }
    };

    const requestServiceSchema = yup.object({
        services: yup
            .array()
            .of(yup.string()) // Ensure it's an array of strings
            .min(1, "At least one service is required") // Add min length validation to prevent empty arrays
            .required("Services are required"), // Required field
        amount: yup
            .number()
            .min(1)
            .required("Amount is required"),
        additional_information: yup
            .string()
            .nullable()
    });

    const formik = useFormik<FormValues>({
        initialValues: {
            services: [],
            amount: 0,
            additional_information: ""
        },
        validationSchema: requestServiceSchema,
        onSubmit: async (values) => {
            dispatch(requestService({token, id, data: values})).then((res) => {
                if (res.payload.status) {
                    toggleMenu()
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Quote sent",
                            type: "success",
                        })
                    );
                } else {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Something went wrong",
                            type: "error",
                        })
                    );
                }
            })
        },
    })

    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto ${isOpen ? "flex" : "hidden"}`}>
            <form onSubmit={formik.handleSubmit}>
                <div className="w-full laptop:w-[640px] px-4 py-[5vh]">
                    <div
                        className="bg-white rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto p-6 hide-scrollbar">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="cursor-pointer" onClick={toggleMenu}>
                                    <CloseIcon/>
                                </div>
                                <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">Request a
                                    service</p>
                            </div>
                            <div className="hidden laptop:block">
                                <FormikButton title="Send quote" error={formik.isValid} loading={formik.isSubmitting}/>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-[250px]">
                            <div className="mt-10">
                                <div className="grid gap-2 mt-[24px]">
                                    <Label htmlFor="amount" className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">
                                        I want to book you for
                                    </Label>
                                    <div
                                        className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full h-[48px]">
                                        <div>
                                            <p className="font-semi-normal text-[14px]">₦</p>
                                        </div>
                                        <div className="w-full">
                                            <input
                                                id="amount"
                                                type="text"
                                                className="text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full"
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
                                <div className="grid gap-2 mt-[24px]">
                                    <Label htmlFor="fullname"
                                           className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Required
                                        services</Label>
                                    <div className="mt-2">
                                        <div className="flex flex-wrap gap-2">
                                            {
                                                services?.map((service, index) => (
                                                    <div className={`w-fit rounded-[12px] p-[12px] px-[16px] cursor-pointer ${
                                                        Array.isArray(formik.values.services) && formik.values.services.includes(service) ? 'bg-gradient-green-2 shadow-event-custom' : 'bg-light_grey'
                                                    }`} key={index} onClick={() => handleServicesClick(service)}>
                                                        <p className="font-normal text-[14px] text-text-grey">
                                                            {formatStringUCFirst(service)}
                                                        </p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-2 mt-[24px]">
                                    <div className="flex justify-between">
                                        <Label htmlFor="additional-information"
                                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Additional
                                            information</Label>
                                        <p className="font-normal text-[12px] text-text-grey">200 characters</p>
                                    </div>
                                    <textarea
                                        id="additional-information"
                                        placeholder=""
                                        className="h-[128px] rounded-xl bg-light_grey font-normal text-[14px] border-0 resize-none p-4"
                                        readOnly={false}
                                        value={formik.values.additional_information}
                                        onChange={formik.handleChange}
                                        name="additional_information"
                                    />
                                </div>
                            </div>
                            <div className="laptop:hidden">
                                <FormikButton title="Send quote" error={formik.isValid} loading={formik.isSubmitting} classes="w-full rounded-[12px] h-[48px] px-[48px] py-[16px]"/>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default RequestServiceModal;