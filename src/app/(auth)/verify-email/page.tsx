'use client'
import React, {useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import verify_url from "@/image/verification.png"
import logo_url from "@/image/logo.png"
import OtpInput from 'react-otp-input';
import {checkError} from "@/lib/checkError";
import {useFormik} from "formik";
import * as yup from "yup";
import {FormikButton} from "@/components/global/FormikButton";
import {authFailure, authStart, authSuccess, loadStop} from "@/features/authentication/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {axiosInstance} from "@/lib/axiosInstane";
import {useCookies} from "react-cookie";
import { getTempError, setIsRouting, updateProperty } from "@/redux/tempSlice";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import AuthLayout from "@/components/layouts/AuthLayout";


export default function VerifyPage() {
    const router  = useRouter()
    const dispatch = useAppDispatch();
    const [cookie, setCookie, removeCookie] = useCookies([
        "token",
        "newToken",
    ]);

    const getHeader = () => {
        const token = cookie.newToken;
        console.log({token})
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    //form validation
    const verifySchema = yup.object({
        code: yup
            .string()
            .length(4)
            .required("Code is required"),
    });

    const [verifyError, setVerifyError] = useState(false);

    const formik = useFormik({
        initialValues: {
            code: "",
        },
        validationSchema: verifySchema,
        onSubmit: async (values) => {
            console.log({values})
            await verifyOtp(values);
        },
    })

    // console.log({formik})

    const [otp, setOtp] = useState(formik.values.code);

    const verifyOtp = async (values: any) => {
        dispatch(authStart())
        try {
            const { data } = await axiosInstance.post("/otp/verify", { ...values }, getHeader());
            if (data.success || data.status) {
                dispatch(setIsRouting(true));
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Email verified",
                        type: "success",
                    })
                );
                formik.resetForm();
                router.push("/profile-setup");
                return false
            }
            // return false
        } catch (err: any) {
            console.log({err})
            dispatch(authFailure());
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: err?.response?.data?.message || "error",
                    type: "error",
                })
            );
            return true;
        } finally {
            dispatch(loadStop())
        }
    }

    return (
        <AuthLayout>
            <section className="bg-gradient-light-green">
                <div className="flex flex-wrap items-center justify-between p-2 px-10">
                    <div>
                        <Image src={logo_url} alt="logo" width={127} height={56}/>
                    </div>
                    <div>
                        <p className="border-2 rounded-xl font-sans p-[9px] px-[16px] text-bl">Login</p>
                    </div>
                </div>
                <div className="min-h-screen flex flex-wrap items-start mt-52 justify-center gap-16">
                    <div className="flex flex-col">
                        <div>
                            <p className="text-[40px] font-bold leading-[48px] font-ruso">Verify email address</p>
                            <p className="text-[18px] font-normal leading-[27px] font-sans">
                                Enter the 4-digit code sent to tadeniyi@gmail.com <br/> to verify your account
                            </p>
                        </div>
                        <div className="mt-[24px]">
                            <Image src={verify_url} alt="signup image" width={320} height={257.55}/>
                        </div>
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <Card className="p-10 w-[480px] border-none shadow-none">
                            <CardContent className="grid grid-cols-1">
                                <div className="flex flex-col items-center justify-center">
                                    <OtpInput
                                        value={formik.values.code}
                                        onChange={(e) => {
                                            setOtp(e)
                                            formik.setFieldValue('code', e)
                                        }}
                                        numInputs={4}
                                        renderSeparator={<span> </span>}
                                        renderInput={(props) => <input {...props} />}
                                        containerStyle="gap-2"
                                        inputStyle={{
                                            width: "48px",
                                            height: "48px",
                                            background: "#F9FAFA",
                                            borderRadius: "12px"
                                        }}
                                    />
                                    {checkError("code", formik) ? (
                                        <p className="text-[#FF8D8D] text-[12px] mt-[8px]">
                                            {formik.errors.code}
                                        </p>
                                    ) : null}
                                </div>
                            </CardContent>
                            <CardContent className="flex justify-center mt-[10px] mb-[10px]">
                                <div>
                                    <p className="font-sans font-semi-normal text-light-green text-[16px]">Resend code
                                        in 60 secs</p>
                                </div>
                            </CardContent>
                            <CardContent className="flex flex-col space-y-2">
                                <FormikButton loading={formik.isSubmitting} title="Verify" error={formik.isValid}/>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </section>
        </AuthLayout>
    )
}