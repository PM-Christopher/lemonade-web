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
import AuthLayout from "@/components/layouts/AuthLayout";
import OtpInput from "react-otp-input";
import {checkError} from "@/lib/checkError";
import {useAppDispatch} from "@/redux/hook";
import {useCookies} from "react-cookie";
import {useSelector} from "react-redux";
import * as yup from "yup";
import {useFormik} from "formik";
import {useResendOtpMutation, useVerifyPasswordResetOtpMutation} from "@/features/authentication/mutations";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {FormikButton} from "@/components/global/FormikButton";
import Link from "next/link";


export default function VerifyCodePage() {
    const COUNTDOWN_DURATION = Number(process.env.NEXT_PUBLIC_COUNTDOWN_DURATION) || 60;
    const STORAGE_KEY = process.env.NEXT_PUBLIC_COUNTDOWN_STORAGE_KEY || "otp_timer_start";
    const router  = useRouter()
    const dispatch = useAppDispatch();
    const [cookie, setCookie] = useCookies([
        "newToken",
        "email"
    ]);
    const { user } = useSelector((state: any) => state.auth)
    const [seconds, setSeconds] = useState<number>(COUNTDOWN_DURATION);
    const [canResend, setCanResend] = useState<boolean>(false);
    const resendOtpMutation = useResendOtpMutation();
    const verifyPasswordResetOtpMutation = useVerifyPasswordResetOtpMutation();

    useEffect(() => {
        const savedStartTime = localStorage.getItem(STORAGE_KEY);

        if (savedStartTime) {
            // calculate how much time has passed
            const elapsed = Math.floor((Date.now() - parseInt(savedStartTime, 10)) / 1000);
            const remaining = COUNTDOWN_DURATION - elapsed;

            if (remaining > 0) {
                // Continue from where it left off
                setSeconds(remaining);
                setCanResend(false);
            } else {
                // Timer already expired
                setSeconds(0);
                setCanResend(true);
                localStorage.removeItem(STORAGE_KEY);
            }
        } else {
            // No key yet, start a fresh countdown
            const startTime = Date.now();
            localStorage.setItem(STORAGE_KEY, startTime.toString());
            setSeconds(COUNTDOWN_DURATION);
            setCanResend(false);
        }
    }, []);

    useEffect(() => {
        if (seconds > 0) {
            const timer = setInterval(() => {
                setSeconds((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCanResend(true);
                        localStorage.removeItem(STORAGE_KEY);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [seconds]);

    const handleResend = () => {
        formik.setFieldValue('code', null)
        resendOtpMutation.mutate(undefined, {
            onSuccess: () => {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: `A new code has been sent to ${user?.email}. Please try again`,
                        type: "success",
                    })
                );
                const newStartTime = Date.now();
                localStorage.setItem(STORAGE_KEY, newStartTime.toString());
                setSeconds(COUNTDOWN_DURATION);
                setCanResend(false);
            },
            onError: (error: any) => {
                setCanResend(true)
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: error?.message,
                        type: "error",
                    })
                );
            },
        })
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
        validateOnChange: false,
        onSubmit: async (values) => {
            await verifyOtp(values);
        },
    })

    const [otp, setOtp] = useState(formik.values.code);

    const verifyOtp = (values: any) => {
        verifyPasswordResetOtpMutation.mutate(values, {
            onSuccess: (result) => {
                // check-otp deletes the forgot-password token it was called
                // with and issues a new, differently-scoped one (ability
                // "password_reset", not "password_reset_verification") —
                // reset-password only accepts that new token. Confirmed
                // live: calling reset-password with the old cookie value
                // 403s "Invalid Token" even though check-otp itself
                // succeeded.
                setCookie("newToken", result.token, {
                    path: "/",
                    maxAge: 3600 * 6,
                    sameSite: false,
                });
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Email verified",
                        type: "success",
                    })
                );
                formik.resetForm();
                router.push("/reset-password");
            },
            onError: (error: any) => {
                setCanResend(true)
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: error?.message,
                        type: "error",
                    })
                );
                formik.setFieldValue('code', null)
            },
        })
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
                                            setOtp(e);
                                            formik.setFieldValue("code", e, true);
                                            // Automatically submit when OTP is fully entered
                                            if (e.length === 4) {
                                                setTimeout(() => {
                                                    formik.submitForm();
                                                }, 0);
                                            }
                                        }}
                                        numInputs={4}
                                        renderSeparator={<span style={{ width: "12px" }}></span>}
                                        renderInput={(props) => (
                                            <div
                                                style={{
                                                    borderRadius: "12px",
                                                    padding: "2px", // thickness of gradient border
                                                    background: "linear-gradient(90deg, #9BE303, #7FBB00)", // gradient green
                                                }}
                                            >
                                                <input
                                                    {...props}
                                                    style={{
                                                        width: "56px",
                                                        height: "56px",
                                                        borderRadius: "10px", // slightly smaller to show gradient
                                                        border: "none",
                                                        backgroundColor: "#E5E7EB", // gray background
                                                        color: "#111827",
                                                        textAlign: "center",
                                                        fontSize: "20px",
                                                        fontWeight: 500,
                                                        outline: "none",
                                                    }}
                                                />
                                            </div>
                                        )}
                                        containerStyle={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: "12px",
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
                                <div className="flex justify-center mt-[10px] mb-[5px] cursor-pointer">
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