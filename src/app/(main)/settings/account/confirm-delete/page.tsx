"use client"
import React, {useState} from 'react';
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import EyeIcon from "@/images/icons/eyeIcon.svg";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {useAppDispatch} from "@/redux/hook";
import * as yup from "yup";
import {useFormik} from "formik";
import { deleteAccount } from "@/features/authentication/authSlice";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {FormikButton} from "@/components/global/FormikButton";
import MainLayout from "@/components/layouts/MainLayout";

const ConfirmDeletePage = () => {
    const router = useRouter()
    const { authToken: token } = useSelector((state: any) => state.auth)
    const dispatch = useAppDispatch()
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const passwordSchema = yup.object({
        password: yup
            .string()
            .required("Password is required")
    });

    const formik = useFormik({
        initialValues: {
            password: "",
        },
        validationSchema: passwordSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            dispatch(deleteAccount({token, data: values})).then((res) => {
                if (res.payload.status) {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: `Account deleted successfully`,
                            type: "success",
                        })
                    );
                    // redirect user to login
                    router.push("/login")
                } else {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: res.payload.message || `Something went wrong`,
                            type: "error",
                        })
                    );
                }
            }).catch((error: any) => {
                console.log({error})
            })
        },
    })
    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <TopNav/>
                <div
                    className="bg-white flex justify-between p-[8px] px-[64px] border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
                         onClick={() => router.back()}>
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Delete account</p>
                    </div>
                </div>
                <section className="min-h-screen mt-4 flex flex-col items-center">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="w-[640px] rounded-[12px] p-[24px] flex flex-col bg-white gap-4">
                            <p className="text-[16px] font-semi-normal text-black-light">
                                Enter your password to delete your account
                            </p>

                            <div className="grid gap-1 mt-[24px]">
                                <Label htmlFor="username"
                                       className="font-normal font-sans text-[14px] leading-[16.8px] text-text-grey">Password</Label>
                                <div
                                    className="flex justify-between items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full h-[48px]">
                                    <div className="w-full">
                                        <input
                                            id="search"
                                            type={showCurrentPassword ? "text" : "password"}
                                            className="rounded-xl h-[48px] text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full"
                                            placeholder=""
                                            value={formik.values.password}
                                            onChange={(e) => {
                                                formik.setFieldValue("password", e.target.value)
                                            }}
                                        />
                                    </div>
                                    <EyeIcon className="cursor-pointer" onClick={toggleCurrentPasswordVisibility}/>
                                </div>
                            </div>

                            <div className="flex justify-between gap-[16px] mt-[24px]">
                                <FormikButton title="Delete account" loading={formik.isSubmitting}
                                              error={formik.isValid} bgColor="bg-red-1" errorColor="bg-red-2"
                                              classes="h-[48px] shadow-none border-[1px] border-red-2 rounded-[12px] w-full"/>
                                <Button className="bg-transparent shadow-none h-[48px] border-none w-full"
                                        onClick={() => router.push("/delete-account")}>
                                    <p className="font-semi-normal text-[16px] text-light-green">Cancel</p>
                                </Button>
                            </div>
                        </div>
                    </form>
                </section>
            </section>
        </MainLayout>
    );
}

export default ConfirmDeletePage;