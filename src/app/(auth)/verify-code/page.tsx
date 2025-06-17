'use client'
import React, {useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import AuthLayout from "@/components/layouts/AuthLayout";
import {axiosInstance} from "@/lib/axiosInstane";
import OtpInput from "react-otp-input";
import {checkError} from "@/lib/checkError";
import {useAppDispatch} from "@/redux/hook";
import {useCookies} from "react-cookie";
import {useSelector} from "react-redux";
import * as yup from "yup";
import {useFormik} from "formik";
import {authFailure, authStart, loadStop} from "@/features/authentication/authSlice";
import {setIsRouting} from "@/redux/tempSlice";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {FormikButton} from "@/components/global/FormikButton";
import Link from "next/link";


export default function VerifyCodePage() {
    const router  = useRouter()
    const dispatch = useAppDispatch();
    const [cookie, setCookie, removeCookie] = useCookies([
        "token",
        "newToken",
        "email"
    ]);
    const { user } = useSelector((state: any) => state.auth)
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
            const { data } = await axiosInstance.post("/auth/check-otp", { ...values }, getHeader());
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
                router.push("/reset-password");
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
                <div className="min-h-screen flex flex-wrap items-start mt-10 justify-center gap-16">
                    <div className="flex flex-col">
                        <div>
                            <p className="text-[40px] font-bold leading-[48px] font-ruso">Verification code</p>
                            <p className="text-[18px] font-normal leading-[27px] font-sans">
                                Enter the 4-digit code sent to {cookie.email} <br/> to verify your account
                            </p>
                        </div>
                        <div>
                            <Image src={"/images/verification.png"} alt="signup image" width={511.06} height={519.77}/>
                        </div>
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <Card className="p-10 w-[480px]">
                            <CardContent className="flex justify-center">
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
                                    {canResend ? (
                                        <p className="font-sans font-semi-normal text-light-green text-[16px] cursor-pointer">
                                            Send now
                                        </p>
                                    ) : (
                                        <p className="font-sans font-semi-normal text-light-green text-[16px]">
                                            Resend code in {seconds} secs
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                            <CardContent className="flex flex-col space-y-2">
                                <FormikButton loading={formik.isSubmitting} title="Verify" error={formik.isValid} classes="w-full h-[48px] rounded-[12px]" />
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </section>
        </AuthLayout>
    )
}