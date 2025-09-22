'use client'
import React, {useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import Image from "next/image"
import OtpInput from 'react-otp-input';
import {checkError} from "@/lib/checkError";
import {useFormik} from "formik";
import * as yup from "yup";
import {FormikButton} from "@/components/global/FormikButton";
import {authFailure, authStart, loadStop} from "@/features/authentication/authSlice";
import { useAppDispatch } from "@/redux/hook";
import {axiosInstance} from "@/lib/axiosInstane";
import {useCookies} from "react-cookie";
import { setIsRouting } from "@/redux/tempSlice";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import AuthLayout from "@/components/layouts/AuthLayout";
import {useSelector} from "react-redux";
import Link from "next/link";


export default function VerifyPage() {
    const router  = useRouter()
    const dispatch = useAppDispatch();
    const [cookie, setCookie, removeCookie] = useCookies([
        "token",
        "newToken",
    ]);
    const { user, code } = useSelector((state: any) => state.auth)
    const [seconds, setSeconds] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const getHeader = () => {
        const token = cookie.newToken;
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    useEffect(() => {
        if (seconds > 0) {
            const timer = setInterval(() => {
                setSeconds((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setCanResend(true);
        }
    }, [seconds]);

    const handleResend = () => {
        setSeconds(60);
        setCanResend(false);
    };

    useEffect(() => {
        if (code) {
            formik.setFieldValue('code', code)
        }
    }, [code])

    //form validation
    const verifySchema = yup.object({
        code: yup
            .string()
            .length(4)
            .required("Code is required"),
    });


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
            <section className="bg-gradient-light-green min-h-screen h-full overflow-hidden">
                <div className="flex flex-wrap items-center justify-between p-2 px-10">
                    <div>
                        <Link href={"/login"}>
                            <Image
                                src={"/images/logo.png"}
                                alt="logo"
                                width={127}
                                height={56}
                            />
                        </Link>
                    </div>
                    <div>
                        <Link href="/login">
                            <p className="border-2 rounded-xl font-sans p-[9px] px-[16px] text-bl">Login</p>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col mt-24 items-center tablet:items-start justify-center gap-16 tablet:px-4 tablet:flex-row">
                    <div className="flex flex-col phone:mb-[16px]">
                        <div className="text-center phone:text-left">
                            <p className="text-[24px] tablet:text-[40px] font-bold leading-[48px] font-ruso">Verify email address</p>
                            <p className="text-[14px] tablet:text-[18px] font-normal leading-[27px] w-[327px] tablet:w-[421px]">
                                Enter the 4-digit code sent to {user?.email} to verify your account
                            </p>
                        </div>
                        <div className="hidden tablet:flex mt-[24px]">
                            <Image src={"/images/verification.png"} alt="signup image" width={320} height={257.55}/>
                        </div>
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <Card className="p-[24px] w-full tablet:w-[480px] rounded-[16px] shadow-none border-none">
                            <CardContent className="grid gap-[24px] tablet:gap-[40px]">
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
                                <div className="flex justify-center mt-[10px] mb-[5px]">
                                    {canResend ? (
                                        <p
                                            className="font-sans font-semi-normal text-light-green text-[16px] cursor-pointer"
                                            onClick={handleResend}
                                        >
                                            Send code again
                                        </p>
                                    ) : (
                                        <p className="font-sans font-semi-normal text-light-green text-[16px]">
                                            Resend code in {seconds} secs
                                        </p>
                                    )}
                                </div>
                                <FormikButton loading={formik.isSubmitting} title="Verify" error={formik.isValid} classes="w-full h-[48px] rounded-[12px]" />
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </section>
        </AuthLayout>
    )
}