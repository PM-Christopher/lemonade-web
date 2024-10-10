'use client'
import React, {useEffect, useState} from "react"
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

import {axiosInstance} from "@/lib/axiosInstane";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {checkError} from "@/lib/checkError";
import {useFormik} from "formik";
import * as yup from "yup";
import {FormikButton} from "@/components/global/FormikButton";
import {authFailure, authStart, authSuccess, loadStop} from "@/features/authentication/authSlice";
import {useCookies} from "react-cookie";

interface AddressInterface {
    loading: Boolean,
    next_step: () => void,
    prev_step: () => void
}

const AddressStep: React.FC<AddressInterface> = ({loading, next_step, prev_step}) => {
    const dispatch = useAppDispatch();
    const [cookie, setCookie, removeCookie] = useCookies([
        "token",
        "newToken",
    ]);

    const getHeader = () => {
        const token = cookie.newToken;
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    //form validation
    const addressStepSchema = yup.object({
        address: yup
            .string()
            .required("Address is required"),
        city: yup
            .string()
            .required("City is required"),
        country: yup
            .string()
            .required("country is required"),
        state: yup
            .string()
            .required("State is required"),
    });

    const formik = useFormik({
        initialValues: {
            address: "",
            city: "",
            country: "",
            state: "",
        },
        validationSchema: addressStepSchema,
        onSubmit: async (values) => {
            await addressStep(values)
        },
    })

    const addressStep = async (values: any) => {
        dispatch(authStart())

        try {
            const { data } = await axiosInstance.post("/profile/address-set-up", { ...values }, getHeader());
            console.log({data})
            if(data.status) {
                next_step()
            } else {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Something went wrong",
                        type: "error",
                    })
                );
            }
        } catch (err: any) {
            dispatch(authFailure());
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: err?.response?.data?.message || "error",
                    type: "error",
                })
            );
        } finally {
            dispatch(loadStop())
        }
    }


    return (
        <form onSubmit={formik.handleSubmit}>
            <Card className="p-[20px] w-[480px]">
                <CardHeader className="grid gap-4">
                    <div className="flex gap-2">
                        <div className="w-[15px] h-[2px] bg-step-color"/>
                        <div className="w-[15px] h-[2px] bg-step-color"/>
                        <div className="w-[15px] h-[2px] bg-border-grey"/>
                        <div className="w-[15px] h-[2px] bg-border-grey"/>
                    </div>
                    <div>
                        <p className="font-sans text-[24px] font-semibold">Contact address</p>
                        <p className="font-sans text-[14px] leading-[21px] font-normal text-text-grey">
                            We'll use this address for important information and <br /> keep it confidential.
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4 mt-[30px]">
                    <div className="grid gap-2">
                        <Label htmlFor="address" className="font-label">Address</Label>
                        <Input
                            id="address"
                            type="text"
                            className="h-12 rounded-xl bg-light_grey form-font border-0"
                            value={formik.values.address}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                        />
                        {checkError("address", formik) ? (
                            <p className="text-[#FF8D8D] text-[12px]">
                                {formik.errors.address}
                            </p>
                        ) : null}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="city" className="font-label">City</Label>
                        <Input
                            id="city"
                            type="text"
                            className="h-12 rounded-xl bg-light_grey form-font border-0"
                            value={formik.values.city}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                        />
                        {checkError("city", formik) ? (
                            <p className="text-[#FF8D8D] text-[12px]">
                                {formik.errors.city}
                            </p>
                        ) : null}
                    </div>

                    <div className="grid gap-2 my-2">
                        <Label htmlFor="email" className="font-label">Country</Label>
                        <Select
                            onValueChange={(value) => formik.setFieldValue('country', value)} // Update value with Formik
                            value={formik.values.country}
                        >
                            <SelectTrigger className="bg-light_grey border-0 h-12">
                                <SelectValue placeholder="Select country"/>
                            </SelectTrigger>
                            <SelectContent className="form-font">
                                <SelectItem value="Nigeria">Nigeria</SelectItem>
                                <SelectItem value="United States of America">United States of America</SelectItem>
                                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                            </SelectContent>
                        </Select>
                        {checkError("country", formik) ? (
                            <p className="text-[#FF8D8D] text-[12px]">
                                {formik.errors.country}
                            </p>
                        ) : null}
                    </div>
                    <div className="grid gap-2 my-2">
                        <Label htmlFor="state" className="font-label">State/Region</Label>
                        <Input
                            id="state"
                            type="text"
                            className="h-12 rounded-xl bg-light_grey form-font border-0"
                            value={formik.values.state}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                        />
                        {checkError("state", formik) ? (
                            <p className="text-[#FF8D8D] text-[12px]">
                                {formik.errors.state}
                            </p>
                        ) : null}
                    </div>
                </CardContent>
                <CardContent className="flex flex-col space-y-2">
                    <FormikButton loading={formik.isSubmitting} title="Next" error={formik.isValid}/>
                </CardContent>
            </Card>
        </form>
    )
}
export default AddressStep