'use client'
import React, {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
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
import { resendOtp, verifyEmailOtp } from "@/features/authentication/authSlice";
import {useAppDispatch} from "@/redux/hook";
import {useCookies} from "react-cookie";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import AuthLayout from "@/components/layouts/AuthLayout";
import {useSelector} from "react-redux";
import Link from "next/link";
import {RootState} from "@/redux/store";


export default function VerifyPage() {
    const router = useRouter()
    const dispatch = useAppDispatch();
    const [cookie, setCookie, removeCookie] = useCookies([
        "token",
        "newToken",
    ]);
    const {user, code} = useSelector((state: RootState) => state.auth)
    const COUNTDOWN_DURATION = Number(process.env.NEXT_PUBLIC_COUNTDOWN_DURATION) || 60;
    const STORAGE_KEY = process.env.NEXT_PUBLIC_COUNTDOWN_STORAGE_KEY || "otp_timer_start";

    const [seconds, setSeconds] = useState<number>(COUNTDOWN_DURATION);
    const [canResend, setCanResend] = useState<boolean>(false);

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

    const handleResend = async () => {
        const { payload } = await dispatch(resendOtp({token: cookie.newToken}))
        formik.setFieldValue('code', null)
        if (!payload.status) {
            setCanResend(true)
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: payload?.message,
                    type: "error",
                })
            );
            return
        } else {
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
        }
    };

    //form validation
    const verifySchema = yup.object({
        code: yup
            .string()
            .length(4, 'Code must be 4 characters')
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

    const verifyOtp = async (values: any) => {
        const { payload } = await dispatch(verifyEmailOtp({data: values, url: "/otp/verify", token: cookie.newToken}))
        console.log({payload})
        if (!payload.status) {
            setCanResend(true)
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: payload?.message,
                    type: "error",
                })
            );
            formik.setFieldValue('code', null)
            return
        } else if (payload.status) {
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
                <div
                    className="flex flex-col mt-24 items-center tablet:items-start justify-center gap-16 tablet:px-4 tablet:flex-row">
                    <div className="flex flex-col phone:mb-[16px]">
                        <div className="text-center phone:text-left">
                            <p className="text-[24px] tablet:text-[40px] font-bold leading-[48px] font-ruso">Verify
                                email address</p>
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
                                            setOtp(e);
                                            formik.setFieldValue("code", e, true);
                                            // Automatically submit when OTP is fully entered
                                            // if (e.length === 4) {
                                            //     setTimeout(() => {
                                            //         formik.submitForm();
                                            //     }, 0);
                                            // }
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
                                <div className="flex justify-center mb-[5px]">
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
                                <FormikButton loading={formik.isSubmitting} title="Verify" error={formik.isValid}
                                              classes="w-full h-[48px] rounded-[12px]"/>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </section>
        </AuthLayout>
    )
}